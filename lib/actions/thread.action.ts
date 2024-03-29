/* We can't directly create DB actions through Browser-Side, Cross Origin Request not allowed.
DB are mostly Server && API services */
"use server";

import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDb } from "../mongoose";

interface Params {
  text: string,
  author: string,
  communityId: string | null,
  path: string,
}

// 接口---create their own post
export async function createThread({ text, author, communityId, path }: Params) {
  try {
    connectToDb();

    /* What is Thread in that case ?
    It's a mongoose mongodb model which we have to create
    */
    const createdThread = await Thread.create({
      text, author, community: null
    });

    // Update userModel
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id } // push it to that specific user who created
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Error creating thread: ${error.message}`)
  }

  // Update communityModel
};


// 接口---获取Posts
export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  connectToDb();

  // Calculate the number of posts to skip
  const skipAmount = (pageNumber - 1) * pageSize; // first page is going to show the post

  // pass the requirements of searching
  // Fetch the posts that have no parents【top-level threads...】. Do not wanna find comments, only Thread
  const postsQuery = Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: 'desc' }).skip(skipAmount).limit(pageSize)
    .populate({ path: 'author', model: User })
    .populate({
      path: "children", // Populate the children field
      populate: {
        path: "author", // Populate the author field within children
        model: User,
        select: "_id name parentId image", // Select only _id and username fields of the author
      },
    });

  const totalPostsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] }, });

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
};


// 接口---通过ID获取Thread
export async function fetchThreadById(id: string) {
  connectToDb();

  try {
    // TODO: Populate Community

    const thread = await Thread.findById(id).populate({
      path: 'author',
      model: User,
      select: "_id id name image"
    }).populate({
      path: "children",
      populate: [
        {
          path: 'author',
          model: User,
          select: "_id id name parentId image"
        }
      ]
    }).exec();
    return thread;
  } catch (error: any) {
    throw new Error(`Error fetching thread: ${error.message}`)
  }
};


// 接口---添加评论
export async function addCommentToThread(threadId: string, commentText: string, userId: string, path: string) {
  connectToDb();

  try {
    // Add a comment --- 1. Find the orginal thread by it's ID
    const originalThread = await Thread.findById(threadId);
    if (!originalThread) throw new Error('Thread not found');

    // 2. Create a new thread with the comment text
    const commentThread = new Thread({
      text: commentText, author: userId, parentId: threadId
    }); // Model from the instance of Thread

    // 3. Save the new Thread
    const savedCommentThread = await commentThread.save();

    // 4. Update the original thread to include the new comment;
    originalThread.children.push(savedCommentThread._id);

    await originalThread.save(); // 5. Save the original Thread
    revalidatePath(path);
    
  } catch (error: any) {
    throw new Error(`Error adding comment to thread: ${error.message}`)

  }
}
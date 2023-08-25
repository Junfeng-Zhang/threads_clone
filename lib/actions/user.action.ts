"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDb } from "../mongoose";
import Thread from "../models/thread.model";
import { FilterQuery, SortOrder } from "mongoose";

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

// 接口---更新用户信息的
export async function updateUser({ userId, username, name, bio, image, path }: Params): Promise<void> {
  // Destructure the values from Object
  connectToDb();
  try {
    await User.findOneAndUpdate( // make call to DB
      { id: userId },
      { username: username.toLowerCase(), name, bio, image, onboarded: true },
      { upsert: true }
    );

    if (path === '/profile/edit') {
      /* allows you to revalidate data associated with a specific path. 
      This is useful for scenarios where you want to update your cached data without 
      waiting for a revalidation period to expire. */
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`)
  }
};

// 接口---获取用户
export async function fetchUser(userId: string) {
  try {
    connectToDb();
    return await User.findOne({ id: userId })
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

// 接口---获取用户的POSTs
export async function fetchUserPosts(userId: string) {
  try {
    connectToDb();

    // TODO: populate Community
    // Find all threads authored by user with the given userId
    const threads = await User.findOne({ id: userId }).populate({
      path: 'threads',
      model: Thread,
      populate: {
        path: 'children',
        model: Thread,
        populate: {
          path: 'author',
          model: User,
          select: 'name image id'
        }
      }
    });

    return threads;
  } catch (error: any) {
    throw new Error(`Failed to fetch user posts: ${error.message}`);
  }
}


// 接口---获取群体用户
export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {

  try {
    connectToDb();

    // 1. we have to calculate the numbers of users to skip, based on the pageNumber and pageSize
    const skipAmount = (pageNumber - 1) * pageSize;

    const regex = new RegExp(searchString, "i");

    // create an initial query to get the users
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }, // not equal to userId
    };

    // Check searchString is exists
    if (searchString.trim() != '') { // in that case, proceed with search and append a query
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ]
    };

    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query).sort(sortOptions).skip(skipAmount).limit(pageSize);

    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext }

  } catch (error: any) {
    throw new Error(`Failed to fetch users: ${error.message}`)
  }
}


// 接口---获取通知
export async function getActivity(userId: string) {
  try {
    connectToDb();

    // find all threads created by the user
    const userThreads = await Thread.find({ author: userId });

    // collect all the child thread ids (replies) from the 'children field
    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []); // [] provide default value

    // get access to all of the replies, excluding the ones created by the same user
    const replies = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId }, // Exclude threads authored by the same user
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    return replies

  } catch (error: any) {
    throw new Error(`Failed to fetch activity: ${error.message}`)
  }
}
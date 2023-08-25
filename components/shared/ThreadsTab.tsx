import { fetchUserPosts } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const ThreadsTab = async ({ currentUserId, accountId, accountType }: Props) => {
  // TODO: Fetch profile threads

  let res = await fetchUserPosts(accountId);
  if (!res) redirect('/');

  return (
    <section className="flex flex-col gap-10 mt-9">
      {res.threads.map((thread: any) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={currentUserId}
          parentId={thread.parentId}
          content={thread.text}
          author={accountType === 'User' ?
            { name: res.name, image: res.image, id: res.id } :
            { name: thread.author.name, image: thread.author.image, id: thread.author.id }
            // get the data directly from the Thread itsels
          }
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      ))}
    </section>
  )
}

export default ThreadsTab
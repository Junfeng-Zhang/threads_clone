
import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";


async function Page() {

  const user = await currentUser(); // 1. we have to know which user is currently creating the Threads
  if (!user) return null;

  // if have user, then fetch his data from DB;
  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect('/onboarding');
  
  return (
    <>
      <h1 className="head-text">Create Threads</h1>
      <PostThread userId={userInfo._id} />
    </>
  )
};

export default Page;
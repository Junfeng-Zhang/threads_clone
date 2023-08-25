

import ProfileHeader from "@/components/shared/ProfileHeader";
import { fetchUser, fetchUsers, getActivity } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

import { redirect } from "next/navigation";

const Page = async () => {

  const user = await currentUser(); // 1. we have to know which user is currently creating the Threads
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect('/onboarding'); // 确保用户是否登录

  // getActivity
  const activity = await getActivity(userInfo._id);


  return (
    <section>
      <h1 className="mb-10 head-text"> Activity </h1>

      <section className="flex flex-col gap-5 mt-10">
        {activity.length > 0 ? (
          <>
            {activity.map((activity) => (
              <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                <article className="activity-card">
                  <Image
                    src={activity.author.image}
                    alt="Profile Picture"
                    width={20} height={20}
                    className="object-cover rounded-full"
                  />

                  {/* add notification */}
                  <p className="!text-base-regular text-light-1">
                    <span className="mr-1 text-primary-500">
                      {activity.author.name}
                    </span>{" "}
                    Replied to your thread
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (<p className="!text-base-regular text-light-3">No Activity Yet!</p>)}
      </section>
    </section>
  )
}

export default Page
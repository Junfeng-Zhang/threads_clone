import UserCard from "@/components/cards/UserCard";
import ProfileHeader from "@/components/shared/ProfileHeader";
import ThreadsTab from "@/components/shared/ThreadsTab";

import { profileTabs } from "@/constants";
import { fetchUser, fetchUsers } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from "next/navigation";

const Page = async () => {

  const user = await currentUser(); // 1. we have to know which user is currently creating the Threads
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect('/onboarding');

  // Additional FN to fetch all the users
  const result = await fetchUsers({
    userId: user.id,
    searchString: '',
    pageNumber: 1,
    pageSize: 25
  });

  return (
    <section>
      <h1 className="mb-10 head-text">Search</h1>

      {/* SearchBar */}

      <div className="flex flex-col mt-14 gap-9">
        {result.users.length === 0 ? (
          <p className="no-result">No users</p>
        ): (
          <>
          {result.users.map((person) => (
            <UserCard
              key={person.id}
              id={person.id}
              name={person.name}
              username={person.username}
              imgUrl={person.image}
              personType='User'
             />
          ))}
          </>
        )}
      </div>
    </section>
  )
}

export default Page
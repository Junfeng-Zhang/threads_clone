"use client";

import Link from "next/link";
import Image from "next/image";
import { sidebarLinks } from "@/constants";
import { usePathname, useRouter } from "next/navigation"; // That's allow us to know the currentURL we're on
import { SignedIn, SignOutButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";

const LeftSidebar = () => {

  const router = useRouter();
  const pathname = usePathname();
  const { userId } = useAuth()

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex flex-col flex-1 w-full gap-6 px-6">
        {/* Dynamically map constants  显示左侧图标 */}
        {sidebarLinks.map((link) => {
          // how do we know which link is currently active?   >1 meaning is not just home
          const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route;

          if (link.route === '/profile') link.route = `${link.route}/${userId}`; // 动态ID 跳转profile页面

          return (
            <Link href={link.route} key={link.label} className={`leftsidebar_link ${isActive && 'bg-primary-500'}`}>
              <Image src={link.imgURL} alt={link.label} width={24} height={24} />
              <p className="text-light-1 max-lg:hidden">{link.label}</p>
            </Link>
          )
        })}
      </div>

      <div className="px-6 mt-10">
        <SignedIn>
          <SignOutButton signOutCallback={() => router.push("/sign-in")}>
            <div className="flex gap-4 p-4 cursor-pointer">
              <Image src="/assets/logout.svg" alt="logout" width={24} height={24} />
              <p className="text-light-2 max-lg:hidden">Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  )
}

export default LeftSidebar
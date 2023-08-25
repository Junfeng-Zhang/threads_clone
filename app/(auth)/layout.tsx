// Nested Layout: That's going to allow us to specify different rules for the authentication route
// For example, don't wanna show Navbar or Footer here

import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";

import "../globals.css";

// How Next.js do SEO ?
export const metadata = {
  title: 'Threads',
  description: "A Next.js 13 Meta Threads Application"
};

const inter = Inter({ subsets: ["latin"] });

/* In most cases Layouts are going to have children, because we need to display sth within it.
Also we have to define the type of these children, because of TypeScript

props    type of props  */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  // wrap this Layout with Clerk
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-dark-1`}>
          <div className="flex items-center justify-center w-full min-h-screen">{children}</div>
        </body>
      </html>
    </ClerkProvider>
  )
}
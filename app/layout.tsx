import "./globals.css";
import { Public_Sans } from "next/font/google";

import { Navbar } from "@/components/Navbar";

const publicSans = Public_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={"bg-background "  + publicSans.className}>
        <div className="flex flex-col p-4 md:p-12 h-[100vh]">
          <div className="grid grid-cols-1 gap-4 w-full max-w-6xl mx-auto p-5 text-secondary-foreground">
            <Navbar></Navbar>
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}

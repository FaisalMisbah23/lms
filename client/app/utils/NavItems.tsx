"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { FC } from "react";

export const navItemsData = [
  { name: "Home", url: "/" },
  { name: "Courses", url: "/courses" },
  { name: "About", url: "/about" },
  { name: "Policy", url: "/policy" },
  { name: "FAQ", url: "/faq" },
];

function activeNavIndex(pathname: string | null): number {
  if (!pathname) return -1;
  if (pathname === "/") return 0;
  for (let i = 1; i < navItemsData.length; i++) {
    const u = navItemsData[i].url;
    if (pathname === u || pathname.startsWith(`${u}/`)) {
      return i;
    }
  }
  return -1;
}

interface Props {
  isMobile: boolean;
}

const NavItems: FC<Props> = ({ isMobile }) => {
  const pathname = usePathname();
  const activeItem = activeNavIndex(pathname);

  return (
    <>
      <div className="hidden lg:flex items-center space-x-1">
        {navItemsData.map((item, index) => (
          <Link
            href={item.url}
            key={item.url}
            className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeItem === index
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {item.name}
            {activeItem === index && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
            )}
          </Link>
        ))}
      </div>

      {isMobile && (
        <div className="space-y-2">
          {navItemsData.map((item, index) => (
            <Link
              href={item.url}
              key={item.url}
              className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                activeItem === index
                  ? "text-primary bg-primary/10 border-l-2 border-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default NavItems;

import Link from "next/link";
import React, { FC } from "react";

interface Props {
  activeItem: number;
  isMobile: boolean;
}

export const navItemsData = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "Courses",
    url: "/courses",
  },
  {
    name: "About",
    url: "/about",
  },
  {
    name: "Policy",
    url: "/policy",
  },
  {
    name: "FAQ",
    url: "/faq",
  },
];

const NavItems: FC<Props> = ({ activeItem, isMobile }) => {
  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center space-x-1">
        {navItemsData.map((item, index) => (
          <Link 
            href={item.url} 
            key={index}
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

      {/* Mobile Navigation */}
      {isMobile && (
        <div className="space-y-2">
          {navItemsData.map((item, index) => (
            <Link 
              href={item.url} 
              key={index}
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
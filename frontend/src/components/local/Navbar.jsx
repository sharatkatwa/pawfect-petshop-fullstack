"use client";
import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import DropDown from "./DropDown";
import CartMenu from "./CartMenu";
import Image from "next/image";

const getNavLinkClass = (isActive) =>
  [
    "border-2 px-3 py-2 font-heading text-sm uppercase transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2",
    isActive
      ? "border-border bg-main shadow-[4px_4px_0_0_var(--border)]"
      : "border-transparent hover:-rotate-3   hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-border hover:bg-main hover:shadow-[4px_4px_0_0_var(--border)]",
  ].join(" ");

const isActiveRoute = (pathName, href) => {
  if (href === "/") return pathName === "/";

  return pathName === href || pathName.startsWith(`${href}/`);
};

const Navbar = () => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const router = useRouter();
  const pathName = usePathname();
  return (
    <div className="fixed inset-x-0 z-99 flex h-20 items-center justify-between border-b-[4px] border-border bg-secondary-background px-5 md:px-8">
      <div className="flex items-center gap-7 md:gap-9">
        <Link
          href={"/"}
          className="transition-transform duration-150 hover:-rotate-2 hover:scale-105"
        >
          <Image src={'/logo.png'} width={100} height={100} alt="logo" />
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href={"/"}
            className={getNavLinkClass(isActiveRoute(pathName, "/"))}
          >
            Home
          </Link>
          <Link
            href={"/shop"}
            className={getNavLinkClass(isActiveRoute(pathName, "/shop"))}
          >
            Shop
          </Link>
          <Link href={"/"} className={getNavLinkClass(false)}>
            New
          </Link>
          <Link
            href={"/products"}
            className={getNavLinkClass(isActiveRoute(pathName, "/products"))}
          >
            Brands
          </Link>
          <Link
            href={"/pets"}
            className={getNavLinkClass(isActiveRoute(pathName, "/pets"))}
          >
            Sale
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-5">
        <input
          type="search"
          aria-label="Search"
          placeholder="SEARCH..."
          className="hidden h-10 w-64 border-2 border-border bg-secondary-background px-4 font-heading text-sm uppercase outline-none placeholder:text-foreground/60 md:block"
        />
        {isAuthenticated ? (
          <>
            {" "}
            <DropDown  />
            <CartMenu />
          </>
        ) : pathName == "/auth/login" ? (
          <Button onClick={() => router.push("/auth/signup")}>Signup</Button>
        ) : (
          <Button onClick={() => router.push("/auth/login")}>Login</Button>
        )}
      </div>
    </div>
  );
};

export default Navbar;

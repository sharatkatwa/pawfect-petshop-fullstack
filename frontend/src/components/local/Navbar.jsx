"use client";
import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { CircleUserRound, ShoppingCart } from "lucide-react";

const Navbar = () => {
  return (
    <div className="fixed inset-x-0 z-99 flex h-20 items-center justify-between border-b-[4px] border-border bg-secondary-background px-5 md:px-8">
      <div className="flex items-center gap-7 md:gap-9">
        <Link
          href={"/"}
          className="flex border-[4px] border-border bg-main px-4 py-2 font-heading text-xl font-black uppercase shadow-shadow"
        >
          Petpunk
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <Button asChild variant={'noShadow'} className="h-10 px-6 font-heading text-sm uppercase">
            <Link href={"/shop"}>Shop</Link>
          </Button>
          <Link href={"/"} className="font-heading text-sm uppercase">
            New
          </Link>
          <Link href={"/products"} className="font-heading text-sm uppercase">
            Brands
          </Link>
          <Link href={"/pets"} className="font-heading text-sm uppercase">
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
        <ShoppingCart className="h-6 w-6" strokeWidth={2.25} />
        <CircleUserRound className="h-6 w-6" strokeWidth={2.25} />
      </div>
    </div>
  );
};

export default Navbar;

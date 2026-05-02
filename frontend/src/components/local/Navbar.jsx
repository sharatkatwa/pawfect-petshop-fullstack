"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { CarFrontIcon, CircleUserRound, ShoppingCart } from "lucide-react";

const Navbar = () => {
  return (
    <div className="h-20 bg-secondary-background border-b-[5px] flex items-center justify-between px-20 fixed inset-x-0 z-99">
      <div className="flex items-center gap-10">
        <Link href={"/"} className="cursor-pointer flex ">
          <img src="/logo.png" width={120} height={0} alt="Pawfect" className="object-cover object-center" />
        </Link>
        <div className="space-x-5">
          <Link href={"/"} className="font-bold uppercase font-base">
            Shop all
          </Link>
          <Link href={"/pets"} className="font-bold uppercase font-heading">
            Dogs
          </Link>
          <Link href={"/pets"} className="font-bold uppercase font-heading">
            Cats
          </Link>
          <Link href={"/pets"} className="font-bold uppercase font-heading">
            Small Pets
          </Link>
          <Link href={"/products"} className="font-bold uppercase font-heading">
            Exotics
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button className={"font-bold font-heading"}>Adopt Now</Button>
        <ShoppingCart fill="true" strokeWidth={2.25} />
        <CircleUserRound strokeWidth={2.25} />
      </div>
    </div>
  );
};

export default Navbar;

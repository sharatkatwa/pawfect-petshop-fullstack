import { Heart, LogOut, Package, PlusCircle, User, UserCircle2Icon } from "lucide-react";

import React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { logoutUser } from "@/store/thunks/authThunk";

export default function DropDown() {
  const { user,isAuthenticated, } = useSelector((state) => state.auth);
  // console.log(user);
  const dispatch = useDispatch()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UserCircle2Icon />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 z-[99] ">
        <DropdownMenuLabel>My Account {isAuthenticated && user?.role === 'seller' &&<Badge>Seller</Badge>}</DropdownMenuLabel>
     
        <DropdownMenuSeparator />
        {isAuthenticated && user?.role === "seller" && (
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <PlusCircle />
              <span>Add More Products</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User />
            <span> {user?.name}</span>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Package />
            <span>Orders</span>
          </DropdownMenuItem>

          <DropdownMenuItem>
            <Heart />
            <span>WishList</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => dispatch(logoutUser())}>
          <LogOut />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { Heart, LogOut, Package, PlusCircle, User, UserCircle2Icon } from "lucide-react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
            <DropdownMenuItem asChild>
              <Link href="/seller/dashboard">
                <PlusCircle />
                <span>Seller Dashboard</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <User />
              <span> {user?.name}</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/orders">
              <Package />
              <span>My Orders</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/wishlist">
              <Heart />
              <span>WishList</span>
            </Link>
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

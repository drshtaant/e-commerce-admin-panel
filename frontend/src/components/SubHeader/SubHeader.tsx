import React from "react";
import {
  BuildingLibraryIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

function SubHeader() {
  return (
    <div className="bg-gray-900">
      <div className="flex justify-between py-2 px-48">
        <Link href="/" className="flex items-center">
          <BuildingLibraryIcon className="h-5 w-5 text-white text-sm font-sm" />
          <span className="ml-2 font-semibold text-gray-400">E-Commerce</span>
        </Link>

        <div className="ml-6 flex flex-1 gap-x-3">
          <input
            type="text"
            className="w-full text-slate-100 rounded-md border bg-gray-500 border-gray-500 px-3 py-2 text-sm"
            defaultValue="Search"
          />
        </div>

        <div className="ml-2 flex">
          <div className="flex cursor-pointer items-center gap-x-1 rounded-md py-2 px-4 hover:text-indigo-300">
            <ShoppingBagIcon className="h-5 w-5 text-white text-sm font-sm" />
            <span className="text-sm font-medium">Orders</span>
          </div>

          <div className="flex cursor-pointer items-center gap-x-1 rounded-md py-2 px-4 hover:text-indigo-300">
            <HeartIcon className="h-5 w-5 text-white text-sm font-sm" />
            <span className="text-sm font-medium">Favorites</span>
          </div>

          <div className="flex cursor-pointer items-center gap-x-1 rounded-md py-2 px-4 hover:text-indigo-300">
            <div className="relative">
              <ShoppingCartIcon className="h-5 w-5 text-white text-sm font-sm" />
              <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 p-2 text-xs text-white">
                3
              </span>
            </div>
            <span className="text-sm font-medium">Cart</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubHeader;

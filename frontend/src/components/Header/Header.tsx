import React from "react";
import {
  UserCircleIcon,
  InformationCircleIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Header() {
  return (
    <div className="bg-gray-900 py-2 px-48">
      <div className="flex items-center justify-between text-sm mb-1">
        <div className="flex gap-x-2 py-1 px-2">
          <p className="text-sm font-sm">Welcome to the E-Commerce store!</p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <MapPinIcon className="h-5 w-5 text-white text-sm font-sm" />
            <Link
              href="/contact"
              className="cursor-pointer rounded-sm py-1 px-2 text-sm font-sm hover:text-indigo-300"
            >
              Contact
            </Link>
          </div>
          <div className="flex items-center text-sm font-sm">
            <InformationCircleIcon className="h-5 w-5 text-white" />
            <Link
              href="/help"
              className="cursor-pointer rounded-sm py-1 px-2 text-sm font-sm hover:text-indigo-300"
            >
              Need Help?
            </Link>
          </div>
          <div className="flex items-center">
            <UserCircleIcon className="h-5 w-5 text-white text-sm font-sm" />
            <a className="cursor-pointer rounded-sm py-1 px-2 text-sm font-sm hover:text-indigo-300">
              Sign in
            </a>
            /
            <a className="cursor-pointer rounded-sm py-1 px-2 text-sm font-sm hover:text-indigo-300">
              Register
            </a>
          </div>
        </div>
      </div>
      <hr />
    </div>
  );
}

import React, { useState } from "react";
import {
  UserCircleIcon,
  InformationCircleIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import SignIn from "@/components/SignIn/SignIn";
import SignUp from "@/components/SignUp/SignUp";

export default function Header() {
  const [isSignInOpen, setSignInOpen] = useState(false);
  const [isSignUpOpen, setSignUpOpen] = useState(false);

  const handleSignInClick = () => {
    setSignInOpen(true);
  };
  const handleSignUpClick = () => {
    setSignUpOpen(true);
  };

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
            <button
              onClick={handleSignInClick}
              className="cursor-pointer rounded-sm py-1 px-2 text-sm font-sm hover:text-indigo-300"
            >
              Sign in
            </button>
            /
            <button
              onClick={handleSignUpClick}
              className="cursor-pointer rounded-sm py-1 px-2 text-sm font-sm hover:text-indigo-300"
            >
              Register
            </button>
          </div>
        </div>
      </div>
      <hr />
      {isSignInOpen && <SignIn closeModal={setSignInOpen} />}
      {isSignUpOpen && <SignUp closeModal={setSignUpOpen} />}
    </div>
  );
}

import React from "react";
import { XCircleIcon } from "@heroicons/react/24/outline";

interface SignInProps {
  closeModal: (value: boolean) => void;
}

function SignIn({ closeModal }: SignInProps) {
  return (
    <div
      id="default-modal"
      tabIndex={-1}
      aria-hidden="true"
      className=" fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-y-auto overflow-x-hidden z-50 w-full md:w-[80%] max-w-2xl bg-white lg:max-w-xl p-4 space-y-8 sm:p-6 rounded-lg shadow-xl dark:bg-gray-800"
    >
      <div className="flex items-center justify-between p-b-1 md:p-2 border-b rounded-t dark:border-gray-600">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Sign in
        </h2>
        <button
          onClick={() => closeModal(false)}
          type="button"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          data-modal-hide="default-modal"
        >
          <XCircleIcon className="w-6 h-6" />
        </button>
      </div>
      <form className="mt-8 space-y-6" action="#">
        <div>
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="name@company.com"
            required
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="••••••••"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            required
          />
        </div>
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="remember"
              aria-describedby="remember"
              name="remember"
              type="checkbox"
              className="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>
          <div className="ms-3 text-sm">
            <label
              htmlFor="remember"
              className="font-medium text-gray-500 dark:text-gray-400"
            >
              Remember this device
            </label>
          </div>
          <a
            href="#"
            className="ms-auto text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
          >
            Lost Password?
          </a>
        </div>
        <button
          type="submit"
          className="w-full px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 sm:w-auto dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Login to your account
        </button>
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          Not registered yet?{" "}
          <a className="text-blue-600 hover:underline dark:text-blue-500">
            Create account
          </a>
        </div>
      </form>
    </div>
  );
}

export default SignIn;

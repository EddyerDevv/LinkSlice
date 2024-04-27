"use client";
import { memo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuthState } from "@/providers/authState.provider";
import { useSession } from "next-auth/react";
import { GoogleIcon } from "./Icons";
import Loader from "./Loader";
import Image from "next/image";
import Link from "next/link";
import UserMenu from "./Header/UserMenu";

const navLinks = [
  { href: "/", label: "Latest Urls" },
  { href: "/dashboard", label: "Dashboard" },
];

function Header() {
  const { state, handleSignIn } = useAuthState();
  const { data: session, status } = useSession();
  const [activeMenuUser, setActiveMenuUser] = useState(false);
  const menuUserButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  const handleActiveMenuUser = () => {
    const appMenuUser = document.querySelector("#app_header_user_menu");

    if (!(appMenuUser instanceof HTMLElement)) {
      setActiveMenuUser(true);
    } else {
      appMenuUser.style.opacity = "0";

      appMenuUser.addEventListener("transitionend", () => {
        setActiveMenuUser(false);
      });
    }
  };

  return (
    <header className="bg-[var(--global-background-color)] bg-opacity-40 h-16 border-b-[1px] border-neutral-700 flex justify-between items-center px-8 md:px-[12%] transition-[padding] ease-in-out duration-[.2s] fixed top w-full backdrop-blur-md">
      <section className="flex flex-row justify-start items-center gap-6">
        <Link href="/" className="flex flex-row justify-center items-center ">
          <h1 className="text-[1.3rem] font-semibold font-rubik text-gray-200">
            Link<span className="text-emerald-300">Snip</span>
          </h1>
        </Link>
        <nav className="flex flex-row justify-center items-center gap-3 mt-[0.15rem]">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`${
                pathname === href ? "text-emerald-300" : "text-gray-200"
              }
               font-geist-sans font-semibold text-[.915rem] hover:text-emerald-300 transition-colors duration-[.25s] ease-in-out `}
            >
              {label}
            </Link>
          ))}
        </nav>
      </section>
      <section className="flex flex-row justify-start items-center gap-4">
        {state.loading ? (
          <Loader size={"1.25rem"} />
        ) : status === "authenticated" && state.loggedIn ? (
          <article className="flex flex-col justify-center items-center relative">
            <button
              onClick={handleActiveMenuUser}
              ref={menuUserButtonRef}
              className="flex flex-row justify-center items-center rounded-full"
            >
              <Image
                src={session.user!.image!}
                alt="User Avatar"
                width={50}
                height={50}
                className="rounded-full w-[2.2rem] h-[2.2rem]"
                priority
              />
            </button>
            {activeMenuUser && (
              <UserMenu
                activeMenuUser={activeMenuUser}
                setActiveMenuUser={setActiveMenuUser}
                menuUserButtonRef={menuUserButtonRef}
              />
            )}
          </article>
        ) : (
          <button
            onClick={handleSignIn}
            className="bg-neutral-50 min-h-[2rem] px-[1.1rem] rounded-full flex flex-row justify-center items-center gap-[0.4rem]"
          >
            <GoogleIcon className="w-5 h-[1.25rem]" />
            <span className="text-[1rem] mt-[.1rem] font-rubik font-semibold text-neutral-900">
              Sign In
            </span>
          </button>
        )}
      </section>
    </header>
  );
}

export default memo(Header);

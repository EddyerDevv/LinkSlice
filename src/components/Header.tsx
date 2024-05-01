"use client";
import { Fragment, memo, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth.provider";
import { useSession } from "next-auth/react";
import { MenuIcon } from "lucide-react";
import { GoogleIcon } from "./Icons";
import Loader from "./Loader";
import Image from "next/image";
import Link from "next/link";
import UserMenu from "./Header/UserMenu";
import MobileMenu from "./Header/MobileMenu";

const navLinks = [
  { href: "/", label: "Latest Urls" },
  { href: "/dashboard", label: "Dashboard" },
];

function Header() {
  const { state, handleSignIn } = useAuth();
  const { data: session, status } = useSession();
  const [activeMenuUser, setActiveMenuUser] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeMenu, setActiveMenu] = useState(false);
  const menuUserButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleResize() {
      if (isMobile && activeMenu && window.innerWidth >= 768) {
        setActiveMenu(false);
      }
      setIsMobile(window.innerWidth <= 768);
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile, activeMenu]);

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

  const handleActiveMenu = () => {
    const appMenu = document.querySelector("#app_header_menu");

    if (!(appMenu instanceof HTMLElement)) {
      setActiveMenu(true);
    } else {
      appMenu.style.opacity = "0";

      appMenu.addEventListener("transitionend", () => {
        setActiveMenu(false);
      });
    }
  };

  useEffect(() => {
    const html = document.querySelector("html");
    if (!(html instanceof HTMLElement)) return;
    if (activeMenu) html.style.overflow = "hidden";
    else html.removeAttribute("style");

    return () => html.removeAttribute("style");
  }, [activeMenu]);

  return (
    <Fragment>
      <header
        className={`fixed top w-full backdrop-blur-[5px] bg-[var(--global-header-background-color)] h-16 border-b-[1px] border-neutral-700 flex justify-between items-center px-[1.5rem] md:px-[12%] z-30 ${
          pathname.includes("/url/") && "hidden"
        }`}
      >
        <section className="flex flex-row justify-start items-center gap-3">
          <Link
            href="/"
            className="flex flex-row justify-center items-center gap-1"
          >
            <h1 className="text-[1.4rem] font-semibold font-rubik text-neutral-100">
              Link<span className="text-rose-300">Slice</span>
            </h1>
            <div className="h-[1.5rem] min-w-[3rem] px-3 bg-rose-500/70 border-[1px] border-rose-400 text-[.855rem] font-medium text-neutral-100 rounded-lg flex justify-center items-center font-rubik">
              <span className="text-rose-50">v1.0.0</span>
            </div>
          </Link>
          {!isMobile && (
            <nav className="hidden flex-row justify-center items-center gap-3  md:flex">
              {navLinks.map(({ href, label }) => (
                <Link
                  replace
                  key={href}
                  href={href}
                  className={`${
                    pathname === href ? "text-rose-300" : "text-neutral-100"
                  }
               font-geist-sans font-medium text-[.925rem] hover:text-rose-300 transition-colors duration-[.25s] ease-in-out `}
                >
                  {label}
                </Link>
              ))}
            </nav>
          )}
        </section>
        <section className="flex flex-row justify-start items-center gap-[.3rem]">
          {state.loading ? (
            <Loader size={"1.25rem"} />
          ) : status === "authenticated" && state.loggedIn ? (
            <div className="flex flex-col justify-center items-center relative">
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
                  className="rounded-full w-[2.3rem] h-[2.3rem]"
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
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              className="bg-opacity-40 bg-neutral-700 border-neutral-700 border-[1px] min-w-[2.3rem] h-[2.3rem] px-[0.9rem] rounded-lg flex flex-row justify-center items-center gap-[0.4rem] text-neutral-200 hover:bg-opacity-50 hover:text-white hover:border-neutral-600 transition-colors duration-[.25s] ease-in-out"
            >
              <GoogleIcon className="w-[1.325rem] h-[1.325rem]" />
              <span className="text-[.95rem] font-geist-sans font-medium">
                Continue with Google
              </span>
            </button>
          )}
          {isMobile && (
            <div className="flex flex-col justify-center items-center relative">
              <button
                className="bg-opacity-40 bg-neutral-700 border-neutral-700 border-[1px] min-w-[2.3rem] h-[2.3rem] rounded-lg flex flex-row justify-center items-center gap-[0.4rem] text-neutral-200 hover:bg-opacity-50 hover:text-white hover:border-neutral-600 transition-colors duration-[.25s] ease-in-out"
                onClick={handleActiveMenu}
                ref={menuButtonRef}
              >
                <MenuIcon className="w-[1.55rem] h-[1.55rem]" />
              </button>
              {activeMenu && (
                <MobileMenu
                  activeMenu={activeMenu}
                  setActiveMenu={setActiveMenu}
                  menuButtonRef={menuButtonRef}
                />
              )}
            </div>
          )}
        </section>
      </header>
    </Fragment>
  );
}

export default memo(Header);

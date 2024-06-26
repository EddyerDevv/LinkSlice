"use client";
import { useSession } from "next-auth/react";
import { Fragment, memo, useEffect, useRef, useState } from "react";
import {
  AlbumIcon,
  ArchiveIcon,
  LayoutDashboardIcon,
  LogOutIcon,
} from "lucide-react";
import { useAuth } from "@/providers/auth.provider";
import Image from "next/image";
import Link from "next/link";

interface UserMenuProps {
  activeMenuUser: boolean;
  setActiveMenuUser: React.Dispatch<React.SetStateAction<boolean>>;
  menuUserButtonRef: React.RefObject<HTMLElement>;
}

interface ButtonProps {
  label: string;
  href?: string;
  icon: React.ReactNode;
  spacer?: boolean;
  accent?: boolean;
  disabled?: boolean;
}

const buttonIconSize = "w-[1.15rem] h-[1.15rem] pointer-events-none";
const buttonArray: ButtonProps[] = [
  {
    label: "Management",
    href: "/manage",
    icon: <AlbumIcon className={buttonIconSize} />,
    spacer: false,
    disabled: true,
  },
  {
    label: "Latest Urls",
    href: "/",
    icon: <ArchiveIcon className={buttonIconSize} />,
    spacer: false,
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboardIcon className={buttonIconSize} />,
    spacer: true,
  },
  {
    label: "Sign Out",
    icon: <LogOutIcon className={buttonIconSize} />,
    spacer: false,
    accent: true,
  },
];

function UserMenu({
  activeMenuUser,
  setActiveMenuUser,
  menuUserButtonRef,
}: UserMenuProps) {
  const { data: session } = useSession();
  const { handleSignOut } = useAuth();
  const [activeOutside, setActiveOutside] = useState(true);
  const menuUserRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const appHeaderUserMenu = document.getElementById("app_header_user_menu");
    if (!(appHeaderUserMenu instanceof HTMLElement)) return;

    appHeaderUserMenu.style.transform = "scale(0)";
    appHeaderUserMenu.style.opacity = "0";

    setTimeout(() => {
      appHeaderUserMenu.style.transition =
        "transform 0.4s cubic-bezier(.32,.72,0,1), opacity 0.25s ease";
      appHeaderUserMenu.style.transform = "scale(1)";
      appHeaderUserMenu.style.opacity = "1";

      appHeaderUserMenu.addEventListener("transitionend", () => {
        setActiveOutside(false);
      });
    }, 10);

    return () => {
      appHeaderUserMenu.style.transform = "scale(0)";
      appHeaderUserMenu.style.opacity = "0";
    };
  }, [activeMenuUser]);

  useEffect(() => {
    const menuUserButton = menuUserButtonRef.current;
    const menuUser = menuUserRef.current;
    if (!(menuUserButton instanceof HTMLElement)) return;
    if (!(menuUser instanceof HTMLElement)) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (activeOutside) return;
      if (
        !menuUserButton.contains(event.target as Node) &&
        !menuUser.contains(event.target as Node)
      ) {
        menuUser.style.opacity = "0";

        menuUser.addEventListener("transitionend", () => {
          setActiveMenuUser(false);
        });
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuUserButtonRef, menuUserRef, activeOutside]);

  const handleMenuSignOut = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    const menuUser = menuUserRef.current;
    if (!(menuUser instanceof HTMLElement)) return;

    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    menuUser.style.opacity = "0";

    menuUser.addEventListener("transitionend", () => {
      setActiveMenuUser(false);
      if (target.classList.contains("button-sign-out")) handleSignOut();
    });
  };

  return (
    <article
      className="flex flex-col items-start justify-start absolute top-10 right-0 z-10 bg-neutral-800 w-72 min-h-40 rounded-lg border-[1px] border-neutral-700 gap-1 origin-top-right "
      id="app_header_user_menu"
      ref={menuUserRef}
    >
      <figure className="flex flex-row items-center justify-start w-full p-[0.85rem] gap-2">
        <Image
          src={session!.user!.image!}
          alt="User Avatar"
          width={200}
          height={200}
          className="object-cover rounded-full w-12 h-12"
          priority
        />
        <figcaption className="flex flex-col items-start justify-start">
          <p className="text-[.9rem] text-white font-rubik font-semibold overflow-hidden whitespace-nowrap text-ellipsis w-48 leading-[0.9rem]">
            {session!.user!.name}
          </p>
          <p className="text-[.8rem] font-rubik font-normal overflow-hidden whitespace-nowrap text-ellipsis w-60 leading-[0.9rem] text-neutral-400">
            {session!.user!.email}
          </p>
        </figcaption>
      </figure>
      <div className="flex flex-col items-center justify-start w-full px-[0.85rem] pb-[0.9rem] gap-1">
        {buttonArray.map((button, index) => {
          if (
            session &&
            session.user.role === "USER" &&
            button.href === "/manage"
          )
            return null;

          return (
            <Fragment key={index}>
              {button.href ? (
                <Link
                  href={button.href}
                  className={`
                  ${
                    button.accent
                      ? "bg-rose-600 bg-opacity-50 border-rose-500 hover:bg-opacity-60 hover:border-rose-400 text-rose-50"
                      : "border-neutral-700 bg-neutral-800 bg-opacity-10 text-neutral-200 hover:text-white hover:bg-neutral-600 hover:bg-opacity-20 hover:border-neutral-600 hover:border-opacity-95"
                  } ${
                    button.disabled
                      ? "cursor-not-allowed opacity-60 pointer-events-none"
                      : ""
                  } w-full flex justify-between items-center px-2 h-[2.1rem] gap-2 rounded-md cursor-pointer border-[1px]  transition-colors ease-in-out duration-[.25s]`}
                  onClick={handleMenuSignOut}
                >
                  <span className="mt-[0.025rem] leading-[0] font-normal font-geist-sans text-[.885rem] pointer-events-none">
                    {button.label}
                  </span>
                  {button.icon}
                </Link>
              ) : (
                <button
                  className={`
                  button-sign-out
                   ${
                     button.accent
                       ? "bg-rose-600 bg-opacity-50 border-rose-500 hover:bg-opacity-60 hover:border-rose-400 text-rose-50"
                       : "border-neutral-700 bg-neutral-800 bg-opacity-10 text-neutral-200 hover:text-white hover:bg-neutral-600 hover:bg-opacity-20 hover:border-neutral-600 hover:border-opacity-95"
                   } w-full flex justify-between items-center px-2 h-[2.1rem] gap-2 rounded-md cursor-pointer border-[1px]  transition-colors ease-in-out duration-[.25s]`}
                  onClick={handleMenuSignOut}
                >
                  <span className="mt-[0.025rem] leading-[0] font-normal font-geist-sans text-[.885rem] pointer-events-none">
                    {button.label}
                  </span>
                  {button.icon}
                </button>
              )}
              {button.spacer && index !== buttonArray.length - 1 && (
                <hr className="w-[98%] bg-neutral-600 border-none my-1 h-[0.05rem]" />
              )}
            </Fragment>
          );
        })}
      </div>
    </article>
  );
}

export default memo(UserMenu);

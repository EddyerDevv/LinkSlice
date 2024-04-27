"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import { ArchiveIcon, LayoutDashboardIcon } from "lucide-react";
import Link from "next/link";

interface MenuProps {
  activeMenu: boolean;
  setActiveMenu: React.Dispatch<React.SetStateAction<boolean>>;
  menuButtonRef: React.RefObject<HTMLElement>;
}

interface ButtonProps {
  label: string;
  href?: string;
  icon: React.ReactNode;
  spacer?: boolean;
  accent?: boolean;
}

const buttonIconSize = "w-[1.15rem] h-[1.15rem]";
const buttonArray: ButtonProps[] = [
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
  },
];

export default function Menu({
  activeMenu,
  setActiveMenu,
  menuButtonRef,
}: MenuProps) {
  const [activeOutside, setActiveOutside] = useState(true);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const appHeaderMenu = document.getElementById("app_header_menu");
    if (!(appHeaderMenu instanceof HTMLElement)) return;

    appHeaderMenu.style.transform = "scale(0)";
    appHeaderMenu.style.opacity = "0";

    setTimeout(() => {
      appHeaderMenu.style.transition =
        "transform 0.4s cubic-bezier(.32,.72,0,1), opacity 0.25s ease";
      appHeaderMenu.style.transform = "scale(1)";
      appHeaderMenu.style.opacity = "1";

      appHeaderMenu.addEventListener("transitionend", () => {
        setActiveOutside(false);
      });
    }, 10);

    return () => {
      appHeaderMenu.style.transform = "scale(0)";
      appHeaderMenu.style.opacity = "0";
    };
  }, [activeMenu]);

  useEffect(() => {
    const menuButton = menuButtonRef.current;
    const menu = menuRef.current;
    if (!(menuButton instanceof HTMLElement)) return;
    if (!(menu instanceof HTMLElement)) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (activeOutside) return;
      if (
        !menuButton.contains(event.target as Node) &&
        !menu.contains(event.target as Node)
      ) {
        menu.style.opacity = "0";

        menu.addEventListener("transitionend", () => {
          setActiveMenu(false);
        });
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuButtonRef, menuRef, activeOutside]);

  const handleMenuSignOut = () => {
    const menu = menuRef.current;
    if (!(menu instanceof HTMLElement)) return;

    menu.style.opacity = "0";

    menu.addEventListener("transitionend", () => {
      setActiveMenu(false);
    });
  };

  return (
    <article
      className="flex flex-col items-start justify-start absolute top-10 right-0 z-10 bg-neutral-800 w-64 rounded-lg border-[1px] border-neutral-700 gap-1 origin-top-right"
      id="app_header_menu"
      ref={menuRef}
    >
      <div className="flex flex-col items-center justify-start w-full px-[0.85rem] py-[0.9rem] gap-1">
        {buttonArray.map((button, index) => (
          <Fragment key={index}>
            {button.href ? (
              <Link
                href={button.href}
                className={`
                  ${
                    button.accent
                      ? "bg-emerald-600 bg-opacity-50 border-emerald-500 text-white hover:bg-opacity-60"
                      : "border-neutral-700 bg-neutral-800 bg-opacity-10 text-neutral-300 hover:text-white hover:bg-neutral-600 hover:bg-opacity-20 hover:border-neutral-600 hover:border-opacity-95"
                  } w-full flex justify-between items-center px-2 h-[2.1rem] gap-2 rounded-md cursor-pointer border-[1px] text-neutral-200  transition-colors ease-in-out duration-[.25s]`}
                onClick={() => setActiveMenu(false)}
              >
                <span className="mt-[0.025rem] leading-[0] font-normal font-geist-sans text-[.885rem]">
                  {button.label}
                </span>
                {button.icon}
              </Link>
            ) : (
              <button
                className={`
                   ${
                     button.accent
                       ? "bg-emerald-600 bg-opacity-50 border-emerald-500 text-white hover:bg-opacity-60"
                       : "border-neutral-700 bg-neutral-800 bg-opacity-10 text-neutral-300 hover:text-white hover:bg-neutral-600 hover:bg-opacity-20 hover:border-neutral-600 hover:border-opacity-95"
                   } w-full flex justify-between items-center px-2 h-[2.1rem] gap-2 rounded-md cursor-pointer border-[1px] text-neutral-200  transition-colors ease-in-out duration-[.25s]`}
                onClick={() => handleMenuSignOut()}
              >
                <span className="mt-[0.025rem] leading-[0] font-normal font-geist-sans text-[.885rem]">
                  {button.label}
                </span>
                {button.icon}
              </button>
            )}
            {button.spacer && index !== buttonArray.length - 1 && (
              <hr className="w-[98%] bg-neutral-600 border-none my-1 h-[0.05rem]" />
            )}
          </Fragment>
        ))}
      </div>
    </article>
  );
}

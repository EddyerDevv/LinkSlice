"use client";
import { memo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navLinks = [
  { href: "/", label: "Dashboard" },
  { href: "/latest-urls", label: "Latest Urls" },
];

function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-[var(--global-background-color)] h-16 border-b-[1px] border-neutral-700 flex justify-between items-center px-8 md:px-36">
      <section className="flex flex-row justify-start items-center gap-6">
        <div className="flex flex-row justify-center items-center ">
          <h1 className="text-[1.3rem] font-semibold font-rubik text-stone-100">
            Link<span className="text-emerald-300">Snip</span>
          </h1>
        </div>
        <nav className="flex flex-row justify-center items-center gap-3 mt-[0.15rem]">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-stone-100 font-geist-sans font-semibold text-[.915rem] hover:text-emerald-300 transition-colors duration-[.25s] ease-in-out ${
                pathname === href ? "text-emerald-300" : ""
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </section>
      <section></section>
    </header>
  );
}

export default memo(Header);

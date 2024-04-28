"use client";
import { type LinksUser, getLinksUser } from "@/actions/links.actions";
import { InboxIcon, PlusIcon, SearchIcon } from "lucide-react";
import { memo, useEffect, useState } from "react";
import formatNumber from "@/utils/formatNumber";

function Dashboard() {
  const [lengthList, setLengthList] = useState(0);
  const [linksUser, setLinksUser] = useState<LinksUser>();
  const [loading, setLoading] = useState(true);
  const [animatedLengthList, setAnimatedLengthList] = useState(0);

  useEffect(() => {
    const getLinks = async () => {
      const res = await getLinksUser();
      if (!(res && res.user)) return;
      if (res.message !== "OK") return;

      setLinksUser(res);
      setLengthList(res.user.linksLength);
      setLoading(false);
    };

    getLinks();
    return () => {};
  }, []);

  useEffect(() => {
    const startTime = Date.now();
    const targetValue = lengthList;
    let currentValue = 0;

    const updateValue = () => {
      const elapsedTime = Date.now() - startTime;
      const animationDuration = 1750;
      const progress = Math.min(1, elapsedTime / animationDuration);
      currentValue = Math.floor(progress * targetValue);
      setAnimatedLengthList(currentValue);

      if (progress < 1) requestAnimationFrame(updateValue);
    };

    updateValue();

    return () => {};
  }, [lengthList]);

  return (
    <main className="w-full 100dvh pt-[8rem] flex flex-col justify-center items-center px-8 md:px-[12%] gap-4">
      <header className="w-full flex flex-col justify-center items-start">
        <h1 className="text-[1.5rem] font-bold gap-2 font-rubik md:text-[1.9rem]">
          Explore <span className="text-rose-300">your urls posteds</span>
        </h1>
        <p className="text-[.95rem] md:text-[1.05rem] font-normal text-neutral-300">
          There are currently{" "}
          <span className="text-rose-300 font-medium">
            {formatNumber(animatedLengthList)}
          </span>{" "}
          links posted by you
        </p>
      </header>
      <section className="w-full flex h-full flex-col justify-center items-center gap-4">
        <header className="w-full h-[2.55rem] flex justify-center items-center gap-1 flex-wrap">
          <div className="relative h-full flex-auto flex justify-start items-center ">
            <span className="absolute inset-y-0 left-0 flex items-center pl-[0.7rem] pointer-events-none">
              <SearchIcon
                className="w-[1.3rem] h-[1.3rem] text-rose-400"
                absoluteStrokeWidth
              />
            </span>
            <input
              className="placeholder:text-neutral-300 block bg-neutral-800 w-full border-[1px] border-neutral-600 rounded-lg py-2 pr-[0.8rem] pl-[2.3rem] outline-none text-neutral-300 h-full text-[1rem] focus:border-rose-400 transition-[border] ease-in-out duration-[.2s]"
              placeholder="Search your links..."
              type="text"
              name="search"
            />
          </div>
          <div className="flex flex-auto h-full  justify-center items-center gap-2 bg-neutral-800 border-[1px] border-neutral-600 rounded-lg py-2 px-2 min-w-16 max-w-[6.1rem] text-neutral-100">
            <InboxIcon
              className="h-[1.3rem] w-[1.3rem] text-rose-400"
              absoluteStrokeWidth
            />
            <h1 className="text-[.975rem]">
              {formatNumber(animatedLengthList)} / 20
            </h1>
          </div>
          <button className="flex h-full  justify-center items-center gap-2 border-[1px] bg-rose-600 bg-opacity-50 border-rose-500 hover:bg-opacity-60 hover:border-rose-400 rounded-lg py-2 px-2 min-w-11 transition-colors duration-[.25s]">
            <PlusIcon className="h-[1.525rem] w-[1.525rem] text-rose-50" />
          </button>
        </header>
      </section>
    </main>
  );
}

export default memo(Dashboard);

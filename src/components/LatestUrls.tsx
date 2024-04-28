"use client";
import { type LinksOfUsers, getLinksOfUsers } from "@/actions/links.actions";
import { SearchIcon } from "lucide-react";
import { memo, useEffect, useState } from "react";
import formatNumber from "@/utils/formatNumber";

function LatestUrls() {
  const [lengthList, setLengthList] = useState(0);
  const [animatedLengthList, setAnimatedLengthList] = useState(0);
  const [linksOfUsers, setLinksOfUsers] = useState<LinksOfUsers[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLinks = async () => {
      const res = await getLinksOfUsers();
      let lengthAll = 0;

      for (const user of res) lengthAll += user.user.linksLength;

      setLengthList(lengthAll);
      setLinksOfUsers(res);
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
        <h1 className="text-[1.5rem] font-bold flex flex-row justify-center  items-center gap-2 font-rubik md:text-[1.9rem]">
          Explore <span className="text-emerald-300">latest urls</span>
          <div className="h-[1.45rem] min-w-[3rem] px-3 bg-emerald-500 text-[.9rem] font-medium text-neutral-100 rounded-full flex justify-center items-center font-rubik md:text-[1rem] md:h-[1.5rem]">
            <span>WIP</span>
          </div>
        </h1>
        <p className="text-[.95rem] md:text-[1.05rem] font-normal text-neutral-300">
          There are currently{" "}
          <span className="text-emerald-300 font-medium">
            {formatNumber(animatedLengthList)}
          </span>{" "}
          links posted by users
        </p>
      </header>
      <section className="w-full flex h-full flex-col justify-center items-center gap-4">
        <header className="w-full h-[2.55rem] flex justify-center items-center">
          <div className="relative w-full h-full flex justify-start items-center">
            <span className="absolute inset-y-0 left-0 flex items-center pl-[0.7rem] pointer-events-none">
              <SearchIcon
                className="w-[1.3rem] h-[1.3rem] text-emerald-400"
                absoluteStrokeWidth
              />
            </span>
            <input
              className="placeholder:text-neutral-300 block bg-neutral-800 w-full border-[1px] border-neutral-600 rounded-lg py-2 pr-[0.8rem] pl-[2.3rem] outline-none text-neutral-300 h-full text-[1rem]  focus:border-emerald-400 transition-[border] ease-in-out duration-[.2s]"
              placeholder="Search links posted by users and yourself..."
              type="text"
              name="search"
            />
          </div>
        </header>
      </section>
    </main>
  );
}

export default memo(LatestUrls);

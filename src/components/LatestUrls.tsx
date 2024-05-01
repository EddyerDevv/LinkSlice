"use client";

import { type LinksOfUsers, getLinksOfUsers } from "@/actions/links.actions";
import { SearchIcon } from "lucide-react";
import { memo, useEffect, useState } from "react";
import formatNumber from "@/utils/formatNumber";
import LinkCardSkeleton from "./Cards/LinkCardSkeleton";
import AnyData from "./AnyData";
import LinkCard from "./Cards/LinkCard";

interface filteredLinks {
  id: string;
  url: string;
  nameUrl: string;
  userId: string;
  createdAt: Date;
  user: {
    name: string | null;
    image: string | null;
  };
}

function LatestUrls() {
  const [lengthList, setLengthList] = useState(0);
  const [animatedLengthList, setAnimatedLengthList] = useState(0);
  const [linksOfUsers, setLinksOfUsers] = useState<LinksOfUsers[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredLinks, setFilteredLinks] = useState<filteredLinks[]>([]);

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
      let animationDuration = 1500;
      if (lengthList < 10) animationDuration = 250;
      const progress = Math.min(1, elapsedTime / animationDuration);
      currentValue = Math.floor(progress * targetValue);
      setAnimatedLengthList(currentValue);

      if (progress < 1) requestAnimationFrame(updateValue);
    };

    updateValue();

    return () => {};
  }, [lengthList]);

  useEffect(() => {
    if (linksOfUsers.length > 0) {
      const filteredLinks = linksOfUsers
        .flatMap((data) =>
          data.user.links.map((link) => ({ ...link, user: data.user }))
        )
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      setLengthList(filteredLinks.length);
      setFilteredLinks(filteredLinks);
    }
  }, [linksOfUsers]);

  const handleInputSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    let timeout;

    setLoading(true);
    const filteredLinks = linksOfUsers
      .flatMap((data) =>
        data.user.links
          .filter(
            (link) =>
              link.nameUrl
                .toLowerCase()
                .includes(event.target.value.toLowerCase()) ||
              link.url.toLowerCase().includes(event.target.value.toLowerCase())
          )
          .map((link) => ({ ...link, user: data.user }))
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    setLengthList(filteredLinks.length);
    setFilteredLinks(filteredLinks);

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <main className="-full min-h-screen pt-[8rem] flex flex-col justify-start items-center px-8 md:px-[12%] gap-4">
      <header className="w-full flex flex-col justify-center items-start">
        <h1 className="text-[1.5rem] font-bold flex flex-row justify-center  items-center gap-2 font-rubik md:text-[1.9rem]">
          Explore <span className="text-rose-300">latest urls</span>
          <div className="h-[1.5rem] min-w-[3rem] px-3 bg-rose-500/70 border-[1px] border-rose-400 text-[.855rem] font-medium text-neutral-100 rounded-lg flex justify-center items-center font-rubik">
            <span className="text-rose-50">Feature</span>
          </div>
        </h1>
        <p className="text-[.95rem] md:text-[1.05rem] font-normal text-neutral-300">
          There are currently{" "}
          <span className="text-rose-300 font-medium">
            {formatNumber(animatedLengthList)}
          </span>{" "}
          links posted by users
        </p>
      </header>
      <section className="w-full h-full flex flex-col justify-start items-center gap-2">
        <header className="w-full min-h-[2.55rem] flex justify-center items-center">
          <div className="relative w-full h-full flex justify-start items-center">
            <span className="absolute inset-y-0 left-0 flex items-center pl-[0.7rem] pointer-events-none">
              <SearchIcon
                className="w-[1.3rem] h-[1.3rem] text-rose-400"
                absoluteStrokeWidth
              />
            </span>
            <input
              className="placeholder:text-neutral-300 block bg-neutral-800 w-full border-[1px] border-neutral-600 rounded-lg py-2 pr-[0.8rem] pl-[2.3rem] outline-none text-neutral-300 h-full text-[1rem] focus:border-rose-400 transition-[border] ease-in-out duration-[.2s]"
              placeholder="Search links posted by users and yourself..."
              type="text"
              name="search"
              onChange={handleInputSearch}
            />
          </div>
        </header>
        <div className="w-full h-full flex flex-col items-center justify-start">
          {loading ? (
            <div className="w-full grid grid-cols-3 max-[1160px]:grid-cols-2 max-[650px]:grid-cols-1 items-start justify-start gap-2 mt-2 pb-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <LinkCardSkeleton key={index} />
              ))}
            </div>
          ) : filteredLinks.length > 0 ? (
            <div className="w-full grid grid-cols-3 max-[1160px]:grid-cols-2 max-[650px]:grid-cols-1 items-start justify-start gap-2 mt-2 pb-2">
              {filteredLinks.map((link) => (
                <LinkCard
                  key={link.id}
                  dateUploaded={link.createdAt}
                  nameURL={link.nameUrl}
                  toURL={link.url}
                  dataBy={{
                    name: link.user.name || "Unknown",
                    image: link.user.image || "",
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center mt-2">
              <AnyData />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default memo(LatestUrls);

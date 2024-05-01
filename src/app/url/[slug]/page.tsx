"use client";

import { getLink } from "@/actions/links.actions";
import { CheckCheckIcon, CloudyIcon, UnlinkIcon } from "lucide-react";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";

function Page({ params }: { params: { slug: string } }) {
  const [loading, setLoading] = useState(true);
  const [exists, setExists] = useState(false);
  useEffect(() => {
    const slug = params.slug;
    const fetchData = async () => {
      setLoading(true);
      const res = await getLink({ name: slug });
      console.log(res);
      if (res.message !== "OK") {
        setLoading(false);
        setExists(false);
      }

      if (res.message === "OK") {
        setLoading(false);
        setExists(true);

        setTimeout(() => {
          window.location.replace(res.url);
        }, 1000);
      }
    };

    fetchData();
  }, []);
  return (
    <main className="h-screen w-screen flex-col flex items-center justify-center">
      <section className="w-full flex-col flex items-center justify-center gap-3">
        <header className="flex items-center justify-center gap-2">
          <CloudyIcon
            className="w-[3.5rem] h-[3.5rem] text-rose-300"
            absoluteStrokeWidth
          />
          <h1 className="text-[3.5rem] font-semibold font-rubik text-neutral-100">
            Link<span className="text-rose-300">Slice</span>
          </h1>
        </header>

        <div className=" max-w-[30rem]">
          {loading ? (
            <div className="flex flex-col items-center justify-center w-full gap-3">
              <div className="flex flex-row items-center justify-center w-full gap-2">
                <Loader size={"2rem"} />
                <span className="text-rose-50 text-[1.5rem] font-medium">
                  Verifying the URL...
                </span>
              </div>
              <p className="text-neutral-500 text-[1rem] text-center">
                Please wait while we verify that the URL exists.
              </p>
            </div>
          ) : exists ? (
            <div className="flex flex-col items-center justify-center w-full gap-3">
              <div className="flex flex-row items-center justify-center w-full gap-2">
                <CheckCheckIcon className="text-emerald-300" size={"2rem"} />
                <span className="text-rose-50 text-[1.5rem] font-medium">
                  Redirecting to the URL...
                </span>
              </div>
              <p className="text-neutral-500 text-[1rem] text-center">
                The URL you requested has been found. Redirecting you now.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full gap-3">
              <div className="flex flex-row items-center justify-center w-full gap-2">
                <UnlinkIcon className="text-red-500" size={"2rem"} />
                <span className="text-rose-50 text-[1.5rem] font-medium">
                  The URL does not exist
                </span>
              </div>
              <p className="text-neutral-500 text-[1rem] text-center">
                The URL you are looking for does not exist. Please check the URL
                and try again.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Page;

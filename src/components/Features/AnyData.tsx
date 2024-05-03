"use client";
import { CloudHailIcon } from "lucide-react";
import { memo } from "react";

function AnyData() {
  return (
    <article className="w-full h-full flex flex-col items-center justify-center gap-2 mb-[3.25rem]">
      <CloudHailIcon className="w-[5rem] h-[5rem] text-neutral-400 md:w-[6rem] md:h-[6rem]" />
      <span className="text-neutral-400 font-medium text-3xl md:text-4xl">
        No found links yet
      </span>
    </article>
  );
}

export default memo(AnyData);

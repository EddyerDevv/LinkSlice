"use client";

function LinkCardSkeleton() {
  return (
    <article className="bg-neutral-900/80 border-neutral-700 rounded-xl border-[1px] flex-auto p-3 flex flex-col justify-between items-center gap-3">
      <div className="w-full flex flex-row items-center justify-center">
        <div className="w-full rounded-lg h-[2.6rem] animate-pulse bg-neutral-700/80"></div>
      </div>
      <hr className="w-[70%] h-[1px] bg-neutral-700 border-none"></hr>
      <footer className="w-full h-full flex flex-col justify-between items-center">
        <div className="w-full h-full flex flex-row justify-start items-center gap-[0.6rem]">
          <div className="w-12 h-12 flex flex-col justify-center items-center">
            <div className="rounded-full w-12 h-12 animate-pulse bg-neutral-700/80"></div>
          </div>
          <div className="h-full flex flex-col justify-center items-start">
            <div className="w-[5rem] h-4 animate-pulse rounded-full bg-neutral-700/80 mb-[0.3rem]"></div>
            <div className="w-[7.5rem] h-4 animate-pulse rounded-full bg-neutral-700/80"></div>
          </div>
        </div>
      </footer>
    </article>
  );
}

export default LinkCardSkeleton;

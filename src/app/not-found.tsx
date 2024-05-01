import { CloudyIcon, UnlinkIcon } from "lucide-react";

function NotFound() {
  return (
    <main className="h-screen w-screen flex flex-col items-center justify-center px-6">
      <section className="w-full flex flex-col items-center justify-center gap-3">
        <header className="flex items-center justify-center gap-2">
          <CloudyIcon
            className="w-[3.5rem] h-[3.5rem] text-rose-300"
            absoluteStrokeWidth
          />
          <h1 className="text-[3.5rem] font-semibold font-rubik text-neutral-100">
            Link<span className="text-rose-300">Slice</span>
          </h1>
        </header>

        <div className="max-w-[30rem]">
          <div className="flex flex-col items-center justify-center w-full gap-3">
            <div className="flex flex-row items-center justify-center w-full gap-2">
              <UnlinkIcon className="text-red-500" size={"2rem"} />
              <span className="text-rose-50 text-[1.5rem] font-medium">
                Oops! Page Not Found
              </span>
            </div>
            <p className="text-neutral-500 text-[1rem] text-center">
              Looks like you're lost in cyberspace. The page you are looking for
              could not be found. Please try again later or return to the
              homepage.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default NotFound;

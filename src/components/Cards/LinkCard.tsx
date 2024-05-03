"use client";

import { CheckIcon, CopyIcon, ExternalLink, Link2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { format } from "date-fns-tz";
import { toast } from "sonner";
import { UserRole } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import UserRoleBadge from "../User/UserRoleBadge";

interface Props {
  toURL: string;
  nameURL: string;
  dateUploaded: Date;
  dataBy: {
    name: string;
    image: string;
    userRole: UserRole;
  };
}

function LinkCard({ toURL, nameURL, dateUploaded, dataBy }: Props) {
  const [copied, setCopied] = useState(false);
  const [uploadedDate, setUploadedDate] = useState("");
  const [serverUrl, setServerUrl] = useState("");

  useEffect(() => {
    const url = window.location.href;
    setServerUrl(url.substring(0, url.lastIndexOf("/")));
  }, []);

  useEffect(() => {
    if (dateUploaded) {
      const date = new Date(dateUploaded);
      const formattedDate = format(date, "dd-MM-yyyy HH:mm:ss", {
        timeZone: "auto",
      });

      setUploadedDate(formattedDate);
    }
  }, [dateUploaded]);

  const copyToClipboard = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!(e.target instanceof HTMLElement)) return;
    const dataURL = e.target.getAttribute("data-to-copy");
    if (!dataURL) return;

    setCopied(true);
    navigator.clipboard.writeText(dataURL);

    toast.success("Copied to clipboard", {
      description: "The link has been copied to your clipboard",
    });

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <article className="bg-neutral-900/80 border-neutral-700 rounded-xl border-[1px] flex-auto p-3 flex flex-col justify-between items-center gap-3 animate-fade-in animate-duration-300">
      <div className="w-full flex flex-row items-center justify-center">
        <div className="bg-neutral-800 border-[1px] border-neutral-700 shadow-sm text-sm relative overflow-hidden flex items-center pl-2 w-full rounded-lg h-[2.6rem]">
          <div className="flex items-center flex-grow overflow-clip gap-2">
            <div className="flex items-center text-sm gap-2 ml-1 text-neutral-300">
              <Link2Icon className="w-[1.45rem] h-[1.45rem] flex-shrink-0" />
            </div>
            <div className="flex-grow overflow-clip relative flex-shrink-0">
              <span className="text-neutral-300">
                url/
                <span className="text-rose-300 font-medium">{nameURL}</span>
              </span>
              <span className="text-neutral-300  px-1">to</span>
              <span className="text-rose-300 font-medium">{toURL}</span>
            </div>
          </div>
          <div className="flex items-center pl-1 pr-1 border-l border-neutral-600 gap-[.1rem]">
            <Link
              target="_blank"
              href={`${serverUrl}/url/${nameURL}`}
              className="w-[1.8rem] h-[1.8rem] flex-shrink-0 flex flex-col justify-center items-center hover:bg-neutral-700/70 rounded-md text-rose-50"
            >
              <ExternalLink
                className="w-[1.1rem] h-[1.1rem] pointer-events-none"
                absoluteStrokeWidth
              />
            </Link>
            <button
              className="w-[1.8rem] h-[1.8rem] flex-shrink-0 flex flex-col justify-center items-center hover:bg-neutral-700/70 rounded-md text-rose-50"
              data-to-copy={`${serverUrl}/url/${nameURL}`}
              onClick={copyToClipboard}
              disabled={copied}
            >
              {copied ? (
                <CheckIcon
                  className="w-[1.1rem] h-[1.1rem] pointer-events-none"
                  absoluteStrokeWidth
                />
              ) : (
                <CopyIcon
                  className="w-[1.1rem] h-[1.1rem] pointer-events-none"
                  absoluteStrokeWidth
                />
              )}
            </button>
          </div>
        </div>
      </div>
      <hr className="w-[70%] h-[1px] bg-neutral-700 border-none"></hr>
      <footer className="w-full h-full flex flex-col justify-between items-center">
        <div className="w-full h-full flex flex-row justify-start items-center gap-[0.6rem]">
          <div className="w-12 h-12 flex flex-col justify-center items-center">
            {dataBy && dataBy.image ? (
              <Image
                src={dataBy.image}
                alt="image"
                width={48}
                height={48}
                className="rounded-full w-12 h-12"
              />
            ) : (
              <div className="rounded-full w-12 h-12 bg-neutral-700/80"></div>
            )}
          </div>
          <div className="h-full flex flex-col justify-center items-start">
            <span className="flex flex-row items-center justify-start text-white font-semibold text-[.935rem] leading-[.975rem] font-geist-sans gap-[0.25rem]">
              {dataBy.name || "Unknown"}
              <UserRoleBadge
                userRole={dataBy.userRole || "USER"}
                className="font-medium px-[0.6rem] min-h-[1.225rem] rounded-full text-[0.8rem]"
              />
            </span>
            <span className="text-neutral-500 font-normal text-[.825rem] leading-[.975rem] font-geist-sans">
              Uploaded {uploadedDate}
            </span>
          </div>
        </div>
      </footer>
    </article>
  );
}

export default LinkCard;

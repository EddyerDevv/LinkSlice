"use client";

import { useAuth } from "@/providers/auth.provider";
import {
  CheckIcon,
  CopyIcon,
  ExternalLink,
  Link2Icon,
  SettingsIcon,
  TrashIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { Fragment, useEffect, useState } from "react";
import { format } from "date-fns-tz";
import {
  deleteLinkUser,
  getLinkUser,
  updateLinkUser,
} from "@/actions/links.actions";
import { toast } from "sonner";
import { UserRole } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import Loader from "../Features/Loader";
import UserRoleBadge from "../User/UserRoleBadge";
import Modal from "../Features/Modal";
import Checkbox from "../Features/Checkbox";

interface Props {
  toURL: string;
  idURL: string;
  nameURL: string;
  userRole: UserRole;
  dateUploaded: Date;
  refreshData: () => void;
}

function LinkCardDash({
  nameURL,
  toURL,
  dateUploaded,
  idURL,
  userRole,
  refreshData,
}: Props) {
  const { state } = useAuth();
  const { data: session } = useSession();
  const [copied, setCopied] = useState(false);
  const [uploadedDate, setUploadedDate] = useState("");
  const [serverUrl, setServerUrl] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isShowModalSettings, setIsShowModalSettings] = useState(false);
  const [stateModalSettings, setStateModalSettings] = useState({
    loading: false,
    loadingVisual: true,
    success: false,
    error: false,
    changed: true,
    settings: {
      isPublic: true,
    },
    modalClose: () => {},
  });

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

  const deleteLink = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setDeleteLoading(true);
    if (!(e.target instanceof HTMLElement)) return;
    const dataURL = e.target.getAttribute("data-to-delete");
    if (!dataURL) return setDeleteLoading(false);

    const res = await deleteLinkUser({ id: idURL });
    if (res.message.split("-")[0] === "OK") {
      if (res.type)
        toast[res.type](res.title, {
          description: res.message.split("-")[1],
        });

      setDeleteLoading(false);
      return refreshData();
    } else {
      setDeleteLoading(false);
      if (res.type)
        toast[res.type](res.title, {
          description: res.message,
        });
      return;
    }
  };

  const setChanged = (payload: boolean) => {
    setStateModalSettings((prev) => ({
      ...prev,
      changed: payload,
    }));
  };

  const handleModalClose = (fn: () => void) => {
    setStateModalSettings((prev) => ({
      ...prev,
      modalClose: fn,
    }));
  };

  const setModalSettings = (payload: boolean, name: string) => {
    setStateModalSettings((prev) => ({
      ...prev,
      [name]: payload,
    }));
  };

  const setOptionsSettings = (payload: boolean, name: string) => {
    setStateModalSettings((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [name]: payload,
      },
    }));
  };
  const handleModalSettings = async () => {
    if (state.loading) return;
    const fetchData = async () => {
      setModalSettings(true, "loadingVisual");

      const resData = await getLinkUser({
        id: idURL,
        userId: session?.user.id!,
      });
      if (resData.message === "OK") {
        if (!resData.data) return;

        setStateModalSettings((prev) => ({
          ...prev,
          settings: {
            isPublic: resData.data!.isPublic ?? true,
          },
          loadingVisual: false,
        }));
      } else {
        toast.error("Oops, something went wrong", {
          description: resData.message,
        });
        stateModalSettings.modalClose();
      }
    };

    fetchData();
    setIsShowModalSettings(!isShowModalSettings);
  };

  const handleModalForm = async (e: React.MouseEvent<HTMLFormElement>) => {
    setModalSettings(true, "loading");
    e.preventDefault();

    console.log(stateModalSettings.settings);

    const res = await updateLinkUser({
      id: idURL,
      userId: session?.user.id!,
      data: stateModalSettings.settings,
    });

    if (res.noLabel && res.message.split("-")[0] === "OK") {
      if (res.type)
        toast[res.type](res.title, {
          description: res.message.split("-")[1],
        });

      stateModalSettings.modalClose();
      setModalSettings(false, "loading");
    } else if (res.noLabel && res.type && res.message.split("-")[0] !== "OK") {
      toast[res.type](res.title, {
        description: res.message,
      });

      return setModalSettings(false, "loading");
    }

    setModalSettings(false, "loading");
  };

  return (
    <Fragment>
      <article className="bg-neutral-900/80 border-neutral-700 rounded-xl border-[1px] flex-auto p-3 flex flex-col justify-between items-center gap-3 animate-fade-in animate-duration-300">
        <div className="w-full flex flex-row items-center justify-center">
          {state.loading ? (
            <div className="w-full rounded-lg h-[2.6rem] animate-pulse bg-neutral-700/80"></div>
          ) : (
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
                  <span className="text-neutral-300 px-1">to</span>
                  <span className="text-rose-300 font-medium">{toURL}</span>
                </div>
              </div>
              <div className="flex items-center pl-1 pr-1 border-l border-neutral-600 gap-[.1rem]">
                {!deleteLoading && (
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
                )}
                <button
                  className="w-[1.8rem] h-[1.8rem] flex-shrink-0 flex flex-col justify-center items-center hover:bg-neutral-700/70 rounded-md text-rose-50"
                  data-to-delete={idURL}
                  onClick={deleteLink}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? (
                    <Loader size={"1.1rem"} />
                  ) : (
                    <TrashIcon
                      className="w-[1.1rem] h-[1.1rem] pointer-events-none"
                      absoluteStrokeWidth
                    />
                  )}
                </button>
                {!deleteLoading && (
                  <button
                    className="w-[1.8rem] h-[1.8rem] flex-shrink-0 flex flex-col justify-center items-center hover:bg-neutral-700/70 rounded-md text-rose-50"
                    onClick={handleModalSettings}
                    data-to-config={`${nameURL}-${idURL}`}
                  >
                    <SettingsIcon
                      className="w-[1.1rem] h-[1.1rem] pointer-events-none"
                      absoluteStrokeWidth
                    />
                  </button>
                )}
                <button
                  className="w-[1.8rem] h-[1.8rem] flex-shrink-0 flex flex-col justify-center items-center hover:bg-neutral-700/70 rounded-md text-rose-50"
                  data-to-copy={`${serverUrl}/url/${nameURL}`}
                  onClick={copyToClipboard}
                  disabled={copied || deleteLoading}
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
          )}
        </div>
        <hr className="w-[70%] h-[1px] bg-neutral-700 border-none"></hr>
        <footer className="w-full h-full flex flex-col justify-between items-center">
          <div className="w-full h-full flex flex-row justify-start items-center gap-[0.6rem]">
            <div className="w-12 h-12 flex flex-col justify-center items-center">
              {state.loading ? (
                <div className="rounded-full w-12 h-12 animate-pulse bg-neutral-700/80"></div>
              ) : session && session.user.image ? (
                <Image
                  src={session.user.image}
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
              {state.loading ? (
                <Fragment>
                  <div className="w-[5rem] h-4 animate-pulse rounded-full bg-neutral-700/80 mb-[0.3rem]"></div>
                  <div className="w-[7.5rem] h-4 animate-pulse rounded-full bg-neutral-700/80"></div>
                </Fragment>
              ) : (
                session &&
                session.user && (
                  <Fragment>
                    <span className="flex flex-row items-center justify-start text-white font-semibold text-[.935rem] leading-[.975rem] font-geist-sans gap-[0.25rem]">
                      {session.user.name}
                      <UserRoleBadge
                        userRole={userRole || "USER"}
                        className="font-medium px-[0.6rem] min-h-[1.225rem] rounded-full text-[0.8rem]"
                      />
                    </span>
                    <span className="text-neutral-500 font-normal text-[.825rem] leading-[.975rem] font-geist-sans">
                      Uploaded {uploadedDate}
                    </span>
                  </Fragment>
                )
              )}
            </div>
          </div>
        </footer>
      </article>
      {isShowModalSettings && (
        <Modal
          state={{ open: true, setOpen: setIsShowModalSettings }}
          modalClose={(fn) => handleModalClose(fn)}
        >
          <form
            className="w-full h-full flex flex-col items-start gap-2"
            onSubmit={handleModalForm}
          >
            <header className="w-full flex flex-col justify-center items-start">
              <span className="text-rose-100 font-rubik font-semibold text-[1.15rem]">
                Settings for link name: {nameURL}
              </span>
              <p className="text-neutral-100 font-geist-sans font-normal text-[.85rem]">
                This modal will allow you to change the settings for this link
              </p>
            </header>
            <div className="w-full flex flex-col items-start mt-1 gap-2">
              {stateModalSettings.loadingVisual ? (
                <section className="flex w-full flex-col items-center gap-[0.15rem]">
                  <Loader className="my-[1.925rem]" />
                </section>
              ) : (
                <Fragment>
                  <section className="inline-flex w-full flex-col items-start gap-[0.15rem]">
                    <span className="text-sm font-medium text-rose-100">
                      Options for the link
                    </span>
                    <article className="inline-flex w-full flex-col items-start gap-[0.5rem]">
                      <div className="w-full inline-flex flex-row items-center justify-start gap-1.5">
                        <Checkbox
                          sizeContainer="size-[1.5rem]"
                          initialState={stateModalSettings.settings.isPublic}
                          borderRadiusContent="rounded-[0.3rem]"
                          onChange={(value) => {
                            setChanged(false);
                            setOptionsSettings(value, "isPublic");
                          }}
                        />
                        <span className="text-[.95rem] font-normal text-rose-100">
                          Is visible to other users?
                        </span>
                      </div>
                    </article>
                  </section>
                  <button
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-[.95rem] font-bold transition-colors disabled:pointer-events-none outline-none  disabled:opacity-70 bg-rose-300 text-neutral-900 hover:bg-rose-200 h-9 px-8 py-2 self-end mt-2"
                    type="submit"
                    disabled={
                      stateModalSettings.loading || stateModalSettings.changed
                    }
                  >
                    {stateModalSettings.loading ? (
                      <Loader
                        size={"1.2rem"}
                        strokeWidth={"2"}
                        className="text-neutral-900"
                      />
                    ) : (
                      "Save"
                    )}
                  </button>
                </Fragment>
              )}
            </div>
          </form>
        </Modal>
      )}
    </Fragment>
  );
}

export default LinkCardDash;

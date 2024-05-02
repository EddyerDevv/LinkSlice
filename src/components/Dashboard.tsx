"use client";
import {
  type LinksUser,
  getLinksUser,
  setLinkUser,
} from "@/actions/links.actions";
import { InboxIcon, PlusIcon, SearchIcon } from "lucide-react";
import { Fragment, memo, useEffect, useState } from "react";
import { useAuth } from "@/providers/auth.provider";
import { validateLink, validateName } from "@/utils/formLink";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import formatNumber from "@/utils/formatNumber";
import LinkCardSkeleton from "./Cards/LinkCardSkeleton";
import LinkCardDash from "./Cards/LinkCardDash";
import AnyData from "./AnyData";
import Modal from "./Modal";
import Loader from "./Loader";

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

function Dashboard() {
  const [lengthList, setLengthList] = useState(0);
  const [linksUser, setLinksUser] = useState<LinksUser>();
  const [filteredLinksUser, setFilteredLinksUser] = useState<filteredLinks[]>();
  const [loading, setLoading] = useState(true);
  const [animatedLengthList, setAnimatedLengthList] = useState(0);
  const [showModalLink, setShowModalLink] = useState(false);
  const [serverUrl, setServerUrl] = useState("");
  const [stateModalLink, setStateModalLink] = useState({
    loading: false,
    success: false,
    error: false,
    errorLabel1: {
      label: "",
      state: false,
    },
    errorLabel2: {
      label: "",
      state: false,
    },
  });
  const { state } = useAuth();
  const useNavigate = useRouter();

  useEffect(() => {
    const url = window.location.href;
    setServerUrl(url.substring(0, url.lastIndexOf("/")));
  }, []);

  useEffect(() => {
    if (state.loggedIn) refreshData();
    else if (!state.loading) setAnyData();
    return () => {};
  }, [state]);

  const refreshData = async () => {
    setAnyData();
    setLoading(true);
    const res = await getLinksUser();
    if (!(res && res.user)) {
      useNavigate.refresh();
      return setAnyData();
    } else if (res.message !== "OK") {
      useNavigate.refresh();
      return setAnyData();
    }

    setLinksUser(res);
    setLengthList(res.user.linksLength);
    setLoading(false);
  };

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
    if (linksUser && linksUser.user && linksUser.user.links) {
      const filteredLinks = linksUser!.user?.links.map((link) => ({ ...link }));

      const filteredUser = filteredLinks
        ?.map((link) => {
          return {
            ...link,
            user: {
              name: linksUser!.user!.name,
              image: linksUser!.user!.image,
            },
          };
        })
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      setFilteredLinksUser(filteredUser);
      setLengthList(filteredLinks!.length);
    }
  }, [linksUser]);

  const setAnyData = () => {
    setLinksUser(undefined);
    setLengthList(0);
    setLoading(false);
  };

  const setModalLink = async () => {
    if (state.loading) return;
    setShowModalLink(!showModalLink);
  };

  const setFormLoading = (payload: boolean) =>
    setStateModalLink((prev) => ({
      ...prev,
      loading: payload,
    }));

  const setErrorFormLabel1 = (payload: string, state: boolean) => {
    setStateModalLink((prev) => ({
      ...prev,
      errorLabel1: {
        state: state,
        label: payload,
      },
    }));
  };

  const setErrorFormLabel2 = (payload: string, state: boolean) => {
    setStateModalLink((prev) => ({
      ...prev,
      errorLabel2: {
        state: state,
        label: payload,
      },
    }));
  };

  const formLink = async (e: React.FormEvent<HTMLFormElement>) => {
    setFormLoading(true);
    e.preventDefault();

    if (!(e.target instanceof HTMLFormElement)) return setLoading(false);
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries()) as {
      formLink: string;
      formLinkName: string;
    };

    if (!data.formLink || !data.formLinkName) {
      setErrorFormLabel1("All fields are required", true);
      setErrorFormLabel2("All fields are required", true);
      return setLoading(false);
    }

    const isValidLink = validateLink(data.formLink);
    const isValidName = validateName(data.formLinkName);

    if (!isValidLink || !isValidName) {
      if (!isValidLink) setErrorFormLabel1("The link is not valid", true);
      else setErrorFormLabel1("", false);

      if (isValidName.error) setErrorFormLabel2(isValidName.message, true);
      else setErrorFormLabel2("", false);

      return setFormLoading(false);
    }

    setErrorFormLabel1("", false);
    setErrorFormLabel2("", false);

    const res = await setLinkUser({
      url: data.formLink,
      name: data.formLinkName,
    });

    if (res.label1) {
      setErrorFormLabel1(res.message, true);
      return setFormLoading(false);
    } else {
      setErrorFormLabel1("", false);
    }

    if (res.label2) {
      setErrorFormLabel2(res.message, true);
      return setFormLoading(false);
    } else {
      setErrorFormLabel2("", false);
    }

    if (res.noLabel && res.message.split("-")[0] === "OK") {
      const formInputName = e.target.formLinkName;
      const formInputLink = e.target.formLink;

      navigator.clipboard.writeText(`${serverUrl}/url/${formInputName.value}`);
      toast.success("Copied to clipboard", {
        description: "The link has been copied to your clipboard",
      });

      if (formInputName instanceof HTMLInputElement) formInputName.value = "";
      if (formInputLink instanceof HTMLInputElement) formInputLink.value = "";

      if (res.type)
        toast[res.type](res.title, {
          description: res.message.split("-")[1],
        });

      setFormLoading(false);
      return refreshData();
    } else if (res.noLabel && res.type && res.message.split("-")[0] !== "OK") {
      toast[res.type](res.title, {
        description: res.message,
      });

      return setFormLoading(false);
    }

    setFormLoading(false);
  };

  const onChangeFormInput = {
    inputLink: (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!(e.target instanceof HTMLInputElement)) return;
      const isValidLink = validateLink(e.target.value);

      if (!isValidLink) setErrorFormLabel1("The link is not valid", true);
      else setErrorFormLabel1("", false);
    },
    inputLinkName: (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!(e.target instanceof HTMLInputElement)) return;
      const isValidName = validateName(e.target.value);

      if (isValidName.error) setErrorFormLabel2(isValidName.message, true);
      else setErrorFormLabel2("", false);
    },
    inputSearch: (e: React.ChangeEvent<HTMLInputElement>) => {
      let timeout;
      setLoading(true);

      const filteredLinks = linksUser!.user?.links
        .filter(
          (link) =>
            link.nameUrl.toLowerCase().includes(e.target.value.toLowerCase()) ||
            link.url.toLowerCase().includes(e.target.value.toLowerCase())
        )
        .map((link) => ({ ...link }))
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      const filteredUser = filteredLinks?.map((link) => {
        return {
          ...link,
          user: {
            name: linksUser!.user!.name,
            image: linksUser!.user!.image,
          },
        };
      });

      setFilteredLinksUser(filteredUser);
      setLengthList(filteredLinks!.length);

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setLoading(false);
      }, 1000);
    },
  };

  return (
    <Fragment>
      <main className="w-full min-h-screen pt-[8rem] flex flex-col justify-start items-center px-8 md:px-[12%] gap-4 ">
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
        <section className="w-full h-full flex flex-col justify-start items-center gap-2">
          <header className="w-full h-[2.55rem] flex justify-center items-center gap-1 flex-wrap">
            <div className="relative h-full flex-[1] flex justify-start items-center ">
              <span className="absolute inset-y-0 left-0 flex items-center pl-[0.7rem] pointer-events-none">
                <SearchIcon
                  className="w-[1.3rem] h-[1.3rem] text-rose-400"
                  absoluteStrokeWidth
                />
              </span>
              <input
                className="placeholder:text-neutral-300 block bg-neutral-800 w-full border-[1px] h-full border-neutral-600 rounded-lg py-2 pr-[0.8rem] pl-[2.3rem] outline-none text-neutral-300 text-[1rem] focus:border-rose-400 transition-[border] ease-in-out duration-[.2s]"
                placeholder="Search your links..."
                type="text"
                name="search"
                onChange={onChangeFormInput.inputSearch}
              />
            </div>
            <div className="flex flex-auto h-full justify-center items-center gap-2 bg-neutral-800 border-[1px] border-neutral-600 rounded-lg py-2 px-2 min-w-[2rem] max-w-[6.45rem] text-neutral-100">
              <InboxIcon
                className="h-[1.3rem] w-[1.3rem] text-rose-400"
                absoluteStrokeWidth
              />
              <h1 className="text-[.975rem]">
                {formatNumber(animatedLengthList)} / 20
              </h1>
            </div>
            <button
              className={`flex h-full justify-center items-center gap-2 border-[1px] bg-rose-500/55 border-rose-400 hover:bg-rose-500/70 hover:border-rose-300 rounded-lg py-2 px-2 min-w-11 transition-colors duration-[.25s] flex-shrink max-w-[2.75rem]  ${
                state.loading ? "cursor-progress" : ""
              } ${state.loggedIn ? "cursor-pointer" : "cursor-not-allowed"}`}
              onClick={setModalLink}
            >
              <PlusIcon
                className="h-[1.6rem] w-[1.6rem] text-rose-50 pointer-events-none"
                absoluteStrokeWidth
              />
            </button>
          </header>
          <div className="w-full h-full flex flex-col items-center justify-start">
            {loading ? (
              <div className="w-full grid grid-cols-3 max-[1160px]:grid-cols-2 max-[650px]:grid-cols-1 items-start justify-start gap-2 mt-2 pb-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <LinkCardSkeleton key={index} />
                ))}
              </div>
            ) : linksUser &&
              linksUser.user &&
              filteredLinksUser &&
              filteredLinksUser.length > 0 ? (
              <div className="w-full grid grid-cols-3 max-[1160px]:grid-cols-2 max-[650px]:grid-cols-1 items-start justify-start gap-2 mt-2 pb-2">
                {filteredLinksUser.map((link) => (
                  <LinkCardDash
                    key={link.id}
                    idURL={link.id}
                    nameURL={link.nameUrl}
                    toURL={link.url}
                    refreshData={refreshData}
                    dateUploaded={link.createdAt}
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
      {showModalLink && (
        <Modal state={{ open: showModalLink, setOpen: setShowModalLink }}>
          {!state.loggedIn ? (
            <div className="w-full h-full flex flex-col justify-start items-start">
              <header className="w-full flex justify-start items-center gap-1">
                <span className="text-neutral-100 font-rubik font-semibold text-[1.3rem]">
                  Not authorized
                </span>
              </header>
              <p className="text-rose-100 font-geist-sans font-[300] text-[0.9rem] mt-[0.8rem]">
                You need to be logged in to access the features of this page.
              </p>
            </div>
          ) : (
            <form
              className="w-full h-full flex flex-col items-start gap-2"
              onSubmit={formLink}
            >
              <header className="w-full flex flex-col justify-center items-start">
                <span className="text-rose-100 font-rubik font-semibold text-[1.15rem]">
                  Add a new link
                </span>
                <p className="text-neutral-100 font-geist-sans font-normal text-[.85rem]">
                  When you click add, the URL is copied to your clipboard
                  automatically
                </p>
              </header>
              <div className="w-full flex flex-col items-start mt-1 gap-2">
                <label className="inline-flex w-full flex-col items-start gap-[0.15rem]">
                  <span className="text-sm font-medium text-rose-100">
                    The link you want to shorten
                  </span>
                  <input
                    className="flex h-9 w-full rounded-md placeholder:text-neutral-300 bg-neutral-800 border-[1px] border-neutral-600 px-2 outline-none text-neutral-300 text-[.925rem] focus:border-rose-400 transition-[border] ease-in-out duration-[.2s]"
                    placeholder="https://google.com"
                    type="text"
                    name="formLink"
                    onChange={onChangeFormInput.inputLink}
                    required
                  />
                  {stateModalLink.errorLabel1.state && (
                    <p className="text-[.85rem] pt-[0.05rem] font-semibold text-red-400 self-end min-h-1 line-clamp-1">
                      {stateModalLink.errorLabel1.label}
                    </p>
                  )}
                </label>
                <label className="inline-flex w-full flex-col items-start gap-[0.15rem]">
                  <span className="text-sm font-medium text-rose-100">
                    The name of the link
                  </span>
                  <input
                    className="flex h-9 w-full rounded-md placeholder:text-neutral-300 bg-neutral-800 border-[1px] border-neutral-600 px-2 outline-none text-neutral-300 text-[.925rem] focus:border-rose-400 transition-[border] ease-in-out duration-[.2s]"
                    placeholder="My link"
                    onChange={onChangeFormInput.inputLinkName}
                    type="text"
                    required
                    maxLength={60}
                    name="formLinkName"
                  />
                  {stateModalLink.errorLabel2.state && (
                    <p className="text-[.85rem] pt-[0.05rem] font-semibold text-red-400 self-end min-h-1 line-clamp-1">
                      {stateModalLink.errorLabel2.label}
                    </p>
                  )}
                </label>
                <button
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-[.95rem] font-bold transition-colors disabled:pointer-events-none outline-none  disabled:opacity-70 bg-rose-300 text-neutral-900 hover:bg-rose-200 h-9 px-8 py-2 self-end mt-2"
                  type="submit"
                  disabled={stateModalLink.loading}
                >
                  {stateModalLink.loading ? (
                    <Loader
                      size={"1.2rem"}
                      strokeWidth={"2"}
                      className="text-neutral-900"
                    />
                  ) : (
                    "Add"
                  )}
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </Fragment>
  );
}

export default memo(Dashboard);

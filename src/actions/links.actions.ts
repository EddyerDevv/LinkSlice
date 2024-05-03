"use server";
import { User, UserURLS } from "@prisma/client";
import { validateLink, validateName } from "@/utils/formLink";
import { auth } from "#auth";
import db from "#db";

const LimitLinksPerUser = 20;
export interface LinksOfUsers {
  user: User & { links: UserURLS[]; linksLength: number };
}

export interface LinksUser {
  user?: User & { links: UserURLS[]; linksLength: number };
  message: string;
}

type ToastType = "success" | "error" | "info" | "warning";
export interface LinkUser {
  message: string;
  title?: string;
  label1?: boolean;
  label2?: boolean;
  type?: ToastType;
  noLabel?: boolean;
}

export const getLinksOfUsers = async (): Promise<LinksOfUsers[]> => {
  let response: LinksOfUsers[] = [];
  const users = await db.user.findMany();

  for (const user of users) {
    const links = await db.userURLS.findMany({
      where: {
        userId: user.id,
      },
    });

    const visibleLinks = links.filter((link) => link.isPublic);

    response.push({
      user: {
        ...user,
        links: visibleLinks,
        linksLength: visibleLinks.length || 0,
      },
    });
  }

  return response;
};

export const getLinksUser = async (): Promise<LinksUser> => {
  const session = await auth();
  let response: LinksUser;

  if (!(session && session.user))
    return {
      message: "Not logged in",
    };

  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user)
    return {
      message: "User not found",
    };

  const links = await db.userURLS.findMany({
    where: {
      userId: user.id,
    },
  });

  return (response = {
    message: "OK",
    user: {
      ...user,
      links: links,
      linksLength: links.length || 0,
    },
  });
};

export const setLinkUser = async ({
  url,
  name,
  isPublic = true,
}: {
  url: string;
  name: string;
  isPublic?: boolean;
}): Promise<LinkUser> => {
  const session = await auth();
  let response: LinkUser;

  if (!(session && session.user))
    return {
      title: "Not logged in",
      message: "Please login to continue",
      noLabel: true,
      type: "warning",
    };

  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user)
    return {
      title: "User not found",
      message: "The user not found",
      noLabel: true,
      type: "error",
    };

  const isValidLink = validateLink(url);
  const isValidName = validateName(name);

  if (!isValidLink)
    return {
      message: "The link is not valid",
      label1: true,
    };

  if (isValidName.error)
    return {
      message: isValidName.message,
      label2: true,
    };

  const exitLink = await db.userURLS.findFirst({
    where: {
      nameUrl: name,
    },
  });

  if (exitLink)
    return {
      message: "The name or the link already exists",
      label2: true,
    };

  const links = await db.userURLS.findMany({
    where: {
      userId: user.id,
    },
  });

  if (links.length >= LimitLinksPerUser)
    return {
      title: "Limit of links reached",
      message: "You can't add more links",
      noLabel: true,
      type: "error",
    };

  await db.userURLS.create({
    data: {
      url: url,
      nameUrl: name,
      userId: user.id,
      isPublic: isPublic,
    },
  });

  return (response = {
    title: "Link added",
    message: "OK-The link has been added successfully",
    noLabel: true,
    type: "success",
  });
};

export const deleteLinkUser = async ({
  id,
}: {
  id: string;
}): Promise<LinkUser> => {
  const session = await auth();
  let response: LinkUser;

  if (!(session && session.user))
    return {
      title: "Not logged in",
      message: "Please login to continue",
      noLabel: true,
      type: "warning",
    };

  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user)
    return {
      title: "User not found",
      message: "The user not found",
      noLabel: true,
      type: "error",
    };

  const exitLink = await db.userURLS.findFirst({
    where: {
      id: id,
      userId: user.id,
    },
  });

  if (!exitLink)
    return {
      title: "Link not found",
      message: "The link to delete no has been found",
      noLabel: true,
      type: "error",
    };

  await db.userURLS.delete({
    where: {
      id: id,
      userId: user.id,
    },
  });

  return (response = {
    title: "Link deleted",
    message: "OK-The link has been deleted successfully",
    noLabel: true,
    type: "success",
  });
};

export const updateLinkUser = async ({
  id,
  userId,
  data,
}: {
  id: string;
  userId: string;
  data: {
    isPublic: boolean;
  };
}): Promise<LinkUser> => {
  const session = await auth();
  let response: LinkUser;

  if (!(session && session.user))
    return {
      title: "Not logged in",
      message: "Please login to continue",
      noLabel: true,
      type: "warning",
    };

  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (!user)
    return {
      title: "User not found",
      message: "The user not found",
      noLabel: true,
      type: "error",
    };

  const exitLink = await db.userURLS.findFirst({
    where: {
      id: id,
      userId: user.id,
    },
  });

  if (!exitLink)
    return {
      title: "Link not found",
      message: "The link to update no has been found",
      noLabel: true,
      type: "error",
    };

  const { isPublic } = data;

  await db.userURLS.update({
    where: {
      id: id,
      userId: userId,
    },
    data: {
      isPublic: isPublic,
    },
  });

  return (response = {
    title: "Link updated",
    message: "OK-The link has been updated successfully",
    noLabel: true,
    type: "success",
  });
};

export const getLinkUser = async ({
  id,
  userId,
}: {
  id: string;
  userId: string;
}): Promise<{
  data: UserURLS | null;
  message: string;
}> => {
  const exitLink = await db.userURLS.findFirst({
    where: {
      id: id,
      userId: userId,
    },
  });

  if (!exitLink)
    return {
      data: null,
      message: "The link not found",
    };

  return {
    data: exitLink,
    message: "OK",
  };
};

export const getLink = async ({
  name,
}: {
  name: string;
}): Promise<{
  url: string;
  message: string;
}> => {
  const exitLink = await db.userURLS.findFirst({
    where: {
      nameUrl: name,
    },
  });

  if (!exitLink)
    return {
      url: "",
      message: "The link not found",
    };

  return {
    url: exitLink.url,
    message: "OK",
  };
};

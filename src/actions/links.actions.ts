"use server";
import { User, UserURLS } from "@prisma/client";
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

export const getLinksOfUsers = async (): Promise<LinksOfUsers[]> => {
  let response: LinksOfUsers[] = [];
  const users = await db.user.findMany();

  for (const user of users) {
    const links = await db.userURLS.findMany({
      where: {
        userId: user.id,
      },
    });

    response.push({
      user: {
        ...user,
        links: links,
        linksLength: links.length || 0,
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

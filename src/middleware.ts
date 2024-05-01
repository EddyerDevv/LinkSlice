/* Currently the next auth auth middleware will not be used since I do not have protected url zones */

import { NextRequest, NextResponse } from "next/server";
// import { auth } from "#auth"; // this is not used since I do not have protected url zones

export async function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

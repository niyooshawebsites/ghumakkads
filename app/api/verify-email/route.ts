import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    const email = req.nextUrl.searchParams.get("email");

    if (!token || !email) {
      return NextResponse.json(
        {
          success: false,
          msg: "Invalid request",
        },
        { status: 400 },
      );
    }

    // find token
    const existingToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token,
      },
    });

    if (!existingToken) {
      return NextResponse.json(
        {
          success: false,
          msg: "Invalid Token",
        },
        { status: 400 },
      );
    }

    // check expiration
    if (existingToken.expires < new Date()) {
      return NextResponse.json(
        {
          success: false,
          msg: "Token expired",
        },
        { status: 400 },
      );
    }

    // verfiy User
    await prisma.user.update({
      where: { email },
      data: {
        emailVerified: new Date(),
      },
    });

    // delete the VerificationToken
    await prisma.verificationToken.delete({ where: { token } });

    return NextResponse.redirect(
      new URL("/login?verified=true", process.env.APP_URL),
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        success: false,
        message: "Verification failed",
      },
      { status: 500 },
    );
  }
}

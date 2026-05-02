import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { chapterId } = body;

    if (!chapterId) {
      return new NextResponse("Missing chapterId", { status: 400 });
    }

    // Update the reading progress in the user model
    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        readingProgress: chapterId,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error("PROGRESS_UPDATE_ERROR:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

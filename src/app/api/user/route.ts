import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { name } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        name: name,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error(error, "USER_UPDATE_ERROR");
    return new NextResponse("Internal Error", { status: 500 });
  }
}

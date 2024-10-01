import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: any) {
  const { movieId, reviewerName, rating, reviewComments } = await req.json();
  console.log(movieId, reviewerName, rating, reviewComments);
  const newUser = await prisma.rating.create({
    data: {
      movieId,
      reviewerName,
      rating,
      reviewComments,
    },
  });
  return NextResponse.json(newUser);
}

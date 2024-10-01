import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma/PrismaClient'; // Adjust the import path as needed

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  // Parse the request body
  const { name, releaseDate, averageRating } = await request.json();

  // Validate the data
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Invalid movie ID' }, { status: 400 });
  }

  try {
    // Update the movie
    const updatedMovie = await prisma.movie.update({
      where: { id },
      data: {
        name,
        releaseDate,
        averageRating,
      },
    });

    return NextResponse.json(updatedMovie, { status: 200 });
  } catch (error) {
    console.error("Error updating movie:", error);
    return NextResponse.json({ error: 'Failed to update the movie' }, { status: 500 });
  }
}

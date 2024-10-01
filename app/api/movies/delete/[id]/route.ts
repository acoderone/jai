import { NextResponse } from 'next/server';
import prisma from '../../../../../prisma/PrismaClient'; // Adjust the import path as needed

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  // Check if ID is valid
  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Invalid movie ID' }, { status: 400 });
  }

  try {
    // Attempt to delete the movie
    const deletedMovie = await prisma.movie.delete({
      where: { id },
    });

    return NextResponse.json(deletedMovie, { status: 200 });
  } catch (error) {
    console.error("Error deleting movie:", error);
    return NextResponse.json({ error: 'Failed to delete the movie' }, { status: 500 });
  }
}

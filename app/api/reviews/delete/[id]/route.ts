import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../../../prisma/PrismaClient'; // Adjust the import path based on your project structure

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid review ID' });
    }

    try {
      const deletedReview = await prisma.rating.delete({
        where: { id }, // Ensure that 'id' is the correct field name in your database schema
      });

      res.status(200).json(deletedReview);
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: 'Failed to delete the review' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

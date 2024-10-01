"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

interface MyMovies {
  id: string;
  name: string;
  releaseDate: Date;
  averageRating?: number;
}

export function Addreviews() {
  const router = useRouter();

  const [movies, setMovies] = useState<MyMovies[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<string>(""); // Track selected movie
  const [name, setName] = useState<string>(""); // Track user's name
  const [rating, setRating] = useState<number | undefined>(); // Track rating
  const [comments, setComments] = useState<string>("");

  // Fetch the movies when the component mounts
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get<MyMovies[]>(
          "http://localhost:3000/api/movies/all"
        );
        setMovies(response.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, []);

  // Handle the form submission
  const handleSubmit = async () => {
    if (!selectedMovie || !name || !rating || !comments) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const reviewData = {
        movieId: selectedMovie, // Use movie ID here
        userName: name,
        rating: Number(rating),
        comments: comments,
      };

      const response = await axios.post(
        "http://localhost:3000/api/reviews/add",
        reviewData
      );
      alert("Review added successfully!");
      router.push("/reviews"); // Redirect to reviews page after success
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="mt-24 flex flex-col px-5 py-10 gap-7 w-1/4 border-2 border-gray-400">
        <div className="font-bold text-2xl">Add new review</div>

        {/* Movie selection dropdown */}
        <select
          className="border-2 border-gray-400 outline-none px-2 py-1"
          value={selectedMovie}
          onChange={(e) => setSelectedMovie(e.target.value)}
        >
          <option value="">Select Movie</option>
          {movies.map((movie) => (
            <option key={movie.id} value={movie.id}>
              {movie.name}
            </option>
          ))}
        </select>

        {/* Input for user's name */}
        <input
          className="border-2 border-gray-400 outline-none px-2 py-1"
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Input for rating */}
        <input
          className="border-2 border-gray-400 outline-none px-2 py-1"
          type="number"
          placeholder="Rating out of 10"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        />

        {/* Textarea for review comments */}
        <textarea
          className="border-2 border-gray-400 outline-none px-2 py-1 h-28"
          placeholder="Review Comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          className="border-2 border-white bg-indigo-600 text-white px-2 w-fit py-1 rounded-md self-end"
        >
          Add new review
        </button>
      </div>
    </div>
  );
}

"use client";
import { Search, Trash2, FilePenLine, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

interface MyMovies {
  id: string;
  name: string;
  releaseDate: Date|null;
  averageRating?: number;
}

export function Main() {
  const router = useRouter();
  const [data, setData] = useState<MyMovies[]>([]);
  const [editingMovie, setEditingMovie] = useState<MyMovies | null>(null);
  const [movieName, setMovieName] = useState("");
  const [releaseDate, setReleaseDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get<MyMovies[]>(
          "http://localhost:3000/api/movies/all"
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    }
    fetchData();
  }, []);

  async function handleDeleteMovie(id: string) {
    console.log('Deleting movie with ID:', id);
    try {
      const response = await axios.delete(`http://localhost:3000/api/movies/delete/${id}`);
      if (response.status === 204) {
        setData((prevData) => prevData.filter((movie) => movie.id !== id));
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  }

  function handleEditMovie(movie: MyMovies) {
    setEditingMovie(movie);
    setMovieName(movie.name);
    setReleaseDate(new Date(movie.releaseDate));
    setIsModalOpen(true); // Open the modal
  }

  async function handleUpdateMovie() {
    if (editingMovie) {
      try {
        await axios.put(`http://localhost:3000/api/movies/edit/${editingMovie.id}`, {
          name: movieName,
          releaseDate: releaseDate?.toISOString(), // Send as string in ISO format
        });
        // Update state with edited movie
        setData((prevData) =>
          prevData.map((movie) =>
            movie.id === editingMovie.id
              ? { ...movie, name: movieName, releaseDate }
              : movie
          )
        );
        setIsModalOpen(false); // Close the modal
        setEditingMovie(null); // Reset editing state
      } catch (error) {
        console.error("Error updating movie:", error);
      }
    }
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingMovie(null);
  }

  return (
    <div className="h-auto p-10 flex flex-col gap-5">
      <div className="text-3xl font-semibold">The best movie review site!</div>
      <div className="flex items-center gap-2 px-3 py-1 rounded-md border-2 border-indigo-400 w-2/6">
        <Search size={20} />
        <input
          className="w-full outline-none"
          type="text"
          placeholder="Search for your favourite movie."
        />
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl mb-2">Edit Movie</h2>
            <input
              type="text"
              value={movieName}
              onChange={(e) => setMovieName(e.target.value)}
              placeholder="Movie Name"
              className="border rounded p-2 mb-2 w-full"
            />
            <input
              type="date"
              value={releaseDate ? releaseDate.toISOString().split('T')[0] : ''}
              onChange={(e) => setReleaseDate(new Date(e.target.value))}
              className="border rounded p-2 mb-2 w-full"
            />
            <div className="flex justify-between">
              <button
                onClick={handleUpdateMovie}
                className="bg-blue-500 text-white rounded p-2"
              >
                Update Movie
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 rounded p-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-16">
        {data.map((movie) => (
          <div key={movie.id} className="bg-indigo-200 px-8 py-8 flex flex-col gap-2">
            <div className="text-xl font-semibold">{movie.name}</div>
            <div className="text-lg italic">
              Released: {new Date(movie.releaseDate).toLocaleDateString()}
            </div>
            <div className="font-bold">Rating: {movie.averageRating}</div>
            <div className="flex justify-end gap-2">
              <Eye
                onClick={() => {
                  router.push("/reviews");
                }}
                className="text-gray-600 hover:text-black cursor-pointer"
                size={20}
              />
              <Trash2
                onClick={() => handleDeleteMovie(movie.id)}
                className="text-gray-600 hover:text-black cursor-pointer"
                size={20}
              />
              <FilePenLine
                onClick={() => handleEditMovie(movie)}
                className="text-gray-600 hover:text-black cursor-pointer"
                size={20}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

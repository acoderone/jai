"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export function Addmovie() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  async function handlePost() {
    const response = await axios.post("http://localhost:3000/api/movies/add", {
      name: name,
      releaseDate: date,
    });
    console.log(response);
    router.push("/");
  }

  return (
    <div className="flex justify-center">
      <div className="mt-36 flex flex-col px-5 py-10 gap-7 w-1/4 border-2 border-gra-400">
        <div className="font-bold text-2xl">Add new movie</div>
        <input
          className="border-2 border-gra-400 outline-none px-2 py-1"
          type="text"
          placeholder=" Name"
          onChange={(e) => {
            console.log(e.target.value);
            setName(e.target.value);
          }}
        />
        <input
          className="border-2 border-gra-400 outline-none px-2 py-1 "
          type="date"
          placeholder="Release date"
          onChange={(e) => {
            console.log(e.target.value);

            setDate(e.target.value);
          }}
        />
        <button
          onClick={handlePost}
          className="border-2 border-white bg-indigo-600 text-white px-2 w-fit py-1 rounded-md self-end"
        >
          Add new movie
        </button>
      </div>
    </div>
  );
}

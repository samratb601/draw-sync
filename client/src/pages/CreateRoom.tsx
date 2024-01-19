import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateRoom() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState<number>();

  function generateRoomID(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const roomId = Date.now();
    setRoomId(roomId);
    navigate(`/${roomId}`);
  }

  return (
    <div className="bg-gradient-to-tr from-white to-blue-700 h-screen w-full flex justify-center items-center">
      <div className="w-[400px] h-[500px] p-8 bg-white rounded-md shadow-xl">
        <div className="">
          <h2 className="text-[2rem] font-bold tracking-wide text-blue-600">
            Welcome
          </h2>
        </div>
        <form className="mt-20" onSubmit={generateRoomID}>
          <div className="tracking-wide">
            <label className="text-md font-semibold text-blue-600">
              Generate Room ID
            </label>

            <input
              value={roomId}
              className="block border-2 border-blue-600 rounded-md 
              mt-4 px-2 py-3 focus:outline-blue-500 text-blue-700
              font-semibold tracking-wide
              "
              disabled
            />
            <button
              type="submit"
              className="rounded-md h-[40px] bg-blue-700 hover:bg-blue-600 text-white font-semibold tracking-wider my-4 px-5"
            >
              Generate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

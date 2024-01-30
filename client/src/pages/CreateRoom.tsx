import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

async function delay(amt: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, amt);
  });
}
export default function CreateRoom() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"join" | "create">("create");
  const [roomId, setRoomId] = useState<number | string | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [isRoomIdCreated, setIsRoomIdCreated] = useState(false);

  async function formSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (mode === "join" || isRoomIdCreated) {
      if (!roomId) return;
      setIsLoading(true);
      await delay(1000 * 2);
      setIsLoading(false);
      navigate(`/${roomId}`);
      return;
    }
    setIsLoading(true);
    setIsRoomIdCreated(false);
    await delay(1000 * 2);
    setRoomId(Math.random().toString(36).slice(2));
    setIsLoading(false);
    setIsRoomIdCreated(true);
    
  }
  const switchMode = () => {
    setRoomId(null);
    setIsRoomIdCreated(false);
    setMode(mode === "create" ? "join" : "create");
  };

  return (
    <div className="bg-gradient-to-tr from-white to-blue-700 h-screen w-full flex justify-center items-center">
      <div className="w-[400px] h-[500px] p-8 bg-white rounded-md shadow-xl">
        <div className="">
          <h2 className="text-[2rem] font-bold tracking-wide text-blue-600">
            Welcome
          </h2>
        </div>
        <form className="mt-20" onSubmit={formSubmit}>
          <div className="tracking-wide">
            <label className="text-xl font-semibold text-blue-600">
              {mode === "join" ? "Enter Room ID" : "Generate Room ID"}
            </label>

            <input
              value={roomId || ""}
              className="w-full block border-2 border-blue-600 rounded-md 
              mt-4 px-2 py-3 focus:outline-blue-500 text-blue-700
              font-semibold tracking-wide disabled:bg-gray-200 focus:ring-2 focus:ring-offset-2
              focus:ring-blue-600
              "
              onChange={(e) => {
                setRoomId(e.target.value);
              }}
              disabled={mode === "create" || isLoading}
            />
            <button
              type="submit"
              className="w-full rounded-md h-[40px] bg-blue-700 hover:bg-blue-600 text-white font-semibold tracking-wider my-4 px-5 disabled:bg-blue-400"
              disabled={isLoading}
            >
              {mode === "join" || isRoomIdCreated ? "Join" : "Generate new"}
            </button>
            <p
              className="text-blue-600 hover:text-blue-500 font-semibold text-sm cursor-pointer"
              onClick={switchMode}
            >
              {mode === "join"
                ? "Don't have a room ID? Create new one."
                : "Already have a room ID?"}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

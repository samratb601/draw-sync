import Board from "../components/Board";
import Toolbar from "../components/Toolbar";
import { Navigate, useParams } from "react-router-dom";
import { BoardContextProvider } from "../context/BoardContext";

export default function BoardPage() {
  const { roomId } = useParams();
  if (!roomId) {
    return <Navigate to="/" />;
  }

  return (
    <BoardContextProvider>
      <div className="w-full h-screen flex justify-center items-center p-20 bg-gradient-to-tr from-blue-600 to-slate-300">
        <div className="sm:w-[95vw] md:w-[80vw] lg:w-[60vw] flex gap-x-4">
          <div className="w-[250px] bg-white rounded-md shadow-xl">
            <Toolbar />
          </div>
          <div className="rounded-md overflow-hidden shadow-xl">
            <Board roomId={roomId} />
          </div>
        </div>
      </div>
    </BoardContextProvider>
  );
}

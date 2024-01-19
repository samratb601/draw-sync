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
      <div className="w-full">
        <Toolbar />
        <Board roomId={roomId} />
      </div>
    </BoardContextProvider>
  );
}

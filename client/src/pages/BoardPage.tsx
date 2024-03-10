import Board from "../components/Board";
import Toolbar from "../components/Toolbar";
import { Navigate, useParams } from "react-router-dom";
import Draggable, { DraggableEvent, DraggableEventHandler } from "react-draggable";
import { BoardContextProvider } from "../context/BoardContext";
import { MouseEvent } from "react";

export default function BoardPage() {
  const { roomId } = useParams();
  if (!roomId) {
    return <Navigate to="/" />;
  }

 

  return (
    <BoardContextProvider>
      <main className="w-full h-screen flex justify-center items-center p-20 bg-gradient-to-tr from-blue-600 to-slate-300">
       
          <div className="absolute right-14 w-[250px] bg-white rounded-md shadow-xl" draggable>
            <Toolbar />
          </div>
        
        <div className="w-[95vw] md:w-[90vw] lg:w-[60vw]">
          <div className="rounded-md overflow-hidden shadow-xl">
            <Board roomId={roomId} />
          </div>
        </div>
      </main>
    </BoardContextProvider>
  );
}

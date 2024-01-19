import { useState } from "react";
import Board from "../components/Board";
import Toolbar from "../components/Toolbar";
import { Navigate, useParams } from "react-router-dom";

export default function BoardPage() {
  const {roomId} = useParams();
  if(!roomId){
    return <Navigate to="/"/>
  }
  const [brushColor, setBrushColor] = useState("black");
  const [brushSize, setBrushSize] = useState<number>(5);

  return (
    <div className="w-full">
      <Toolbar {...{ brushColor, setBrushColor, brushSize, setBrushSize }} />
      <Board roomId={roomId} brushColor={brushColor} brushSize={brushSize} />
    </div>
  );
}





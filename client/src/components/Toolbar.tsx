import Draggable from "react-draggable";
import { FaRedoAlt, FaUndoAlt } from "react-icons/fa";
import { IoMove } from "react-icons/io5";
import { useBoardContext } from "../context/BoardContext";


export default function Toolbar() {
  const { setBrushColor , undo , redo} = useBoardContext();

  return (
    <Draggable handle=".drag-handle" defaultPosition={{ x: 0, y: 0 }}>
      <div className="absolute top-[10vh]">
        <div className="drag-handle absolute -top-4 left-4">
          <button className="bg-blue-600 text-white p-1 rounded-md hover:bg-blue-600/90 text-center">
            <IoMove />
          </button>
        </div>

        <div className="bg-[#fff] py-2 px-1 border-2 rounded-md shadow">
          <div
            title={"brush color"}
            className={`relative group px-2 py-2 my-1 rounded cursor-pointer`}
            onClick={() => {}}
          >
            <input
              className="w-[30px] h-[30px] rounded-full overflow-hidden cursor-pointer"
              type="color"
              onChange={(e) => {
                setBrushColor(e.target.value);
              }}
            />
          </div>
        </div>

        <div className="bg-[#fff] py-4 px-1 border-2 rounded-md shadow flex flex-col items-center gap-2">
          
          <div
            className="p-1 cursor-pointer hover:bg-sky-500 hover:text-white rounded"
            onClick={undo}
          >
            <FaUndoAlt />
          </div>
          <div
            className="p-1 cursor-pointer hover:bg-sky-500 hover:text-white rounded"
            onClick={redo}
          >
            <FaRedoAlt />
          </div>
        </div>
      </div>
    </Draggable>
  );
}

import Draggable, { DraggableEvent } from "react-draggable";
import { FaRedoAlt, FaUndoAlt } from "react-icons/fa";
import { useBoardContext } from "../context/BoardContext";
import { IoIosColorPalette, IoMdExit } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export default function Toolbar() {
  const navigate = useNavigate();
  const { brushColor, setBrushColor, undo, redo } = useBoardContext();

  const defaultPos = JSON.parse(
    localStorage.getItem("toolbar_position") ||
      `${JSON.stringify({ x: window.innerWidth - 100, y: 50 })}`
  );


  function onDrag(e: DraggableEvent) {
    const el: HTMLDivElement | null = e.target as HTMLDivElement;
    if (!el) return;
    const { x, y } = el.getBoundingClientRect();
    localStorage.setItem("toolbar_position", JSON.stringify({ x, y }));
  }

  return (
    <Draggable
      handle=".drag-handle"
      defaultPosition={defaultPos}
      onDrag={onDrag}
    >
      <div className="absolute top-[10vh] drag-handle">
        <div className="bg-[#fff] py-2 px-1 border-2 rounded-md shadow">
          <label>
            <div
              title={"brush color"}
              className={`relative group px-2 py-2 my-1 rounded cursor-pointer`}
              onClick={() => {}}
            >
              <input
                className="w-[30px] h-[30px] rounded-full overflow-hidden cursor-pointer"
                type="color"
                hidden
                onChange={(e) => {
                  setBrushColor(e.target.value);
                }}
              />
              <IoIosColorPalette style={{ color: brushColor }} size={30} />
            </div>
          </label>
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
        <div className="bg-[#fff] py-4 px-1 border-2 rounded-md shadow flex flex-col items-center gap-2">
          <div
            className="p-1 cursor-pointer hover:bg-blue-500 hover:text-white rounded"
            onClick={() => {
              navigate("/");
            }}
          >
            <IoMdExit />
          </div>
        </div>
      </div>
    </Draggable>
  );
}

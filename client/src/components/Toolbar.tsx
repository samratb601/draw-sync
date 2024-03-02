import { ReactNode } from "react";
import { FaRegCircle } from "react-icons/fa";
import { GrRedo, GrUndo } from "react-icons/gr";
import { IoIosColorPalette } from "react-icons/io";
import { IoExitOutline, IoTriangleOutline } from "react-icons/io5";
import { LuBrush, LuEraser, LuRectangleHorizontal } from "react-icons/lu";
import { MdClear, MdOutlineStraight } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ToolType, useBoardContext } from "../context/BoardContext";

export default function Toolbar() {
  const navigate = useNavigate();
  const {
    toolType,
    setToolType,
    brushColor,
    setBrushColor,
    brushSize,
    setBrushSize,
    clearCanvas,

    undo,
    redo,
    history,
    historyIndex,
  } = useBoardContext();

  const shapes: { label: ToolType; icon: ReactNode }[] = [
    {
      label: "triangle",
      icon: <IoTriangleOutline size={20} className="inline" />,
    },
    {
      label: "rectangle",
      icon: <LuRectangleHorizontal size={20} className="inline" />,
    },
    { label: "circle", icon: <FaRegCircle size={20} className="inline" /> },
    { label: "brush", icon: <LuBrush size={20} className="inline" /> },
    { label: "line", icon: <MdOutlineStraight size={20} className="inline" /> },
    { label: "eraser", icon: <LuEraser size={20} className="inline" /> },
  ];

  const onClickExit = () => {
    navigate("/");
  };

  return (
    <div className="h-full px-4 py-3 text-[0.9rem] tracking-wide flex flex-col justify-between">
      <div>
        {/* Shapes  */}
        <div className="">
          <h3 className="text-gray-600 text-[1rem] font-semibold">Shapes</h3>
          {shapes.map((item) => {
            const isActive = item.label === toolType;
            return (
              <div
                className={`my-3 hover:text-blue-600 cursor-pointer ${
                  isActive ? "text-blue-600 font-semibold" : "text-gray-600"
                }`}
                onClick={() => {
                  setToolType(item.label);
                }}
              >
                {item.icon}&nbsp;&nbsp;
                {item.label.charAt(0).toUpperCase() +
                  item.label.slice(1, item.label.length)}
              </div>
            );
          })}
        </div>
        {/* //Options  */}
        <div className="border-t pt-3">
          <h3 className="text-gray-600 text-[1rem] font-semibold">Options</h3>
          <div
            title={"Choose color"}
            className={`relative group py-2 my-1 rounded cursor-pointer`}
          >
            <label>
              <input
                className=""
                type="color"
                hidden
                onChange={(e) => {
                  setBrushColor(e.target.value);
                }}
              />
              <IoIosColorPalette
                style={{ color: brushColor }}
                size={23}
                className="inline mr-1"
              />
              <span>Choose color</span>
            </label>
          </div>
          <div
            title={"Choose size"}
            className={`relative group py-2 my-1 rounded cursor-pointer`}
          >
            <label>
              <span className="">Choose stroke size</span>
              <input
                className="w-full mt-1"
                type="range"
                value={brushSize}
                onChange={(e) => {
                  setBrushSize(Number(e.target.value));
                }}
              />
            </label>
          </div>
        </div>
      </div>

      <div>
        <div
          title={"Choose color"}
          className={` py-2 my-1 flex flex-col gap-2`}
        >
          {/* // REDO UNDO  */}
          {/* <div className="w-full flex justify-between gap-x-4">
            <button
              title="Undo"
              className="border-2 border-blue-600 text-blue-600 disabled:opacity-60 rounded-md px-3 py-1 w-full"
              onClick={undo}
              disabled={history.length === 0}
            >
              <GrUndo className="inline mr-1" size={20} />
            </button>
            <button
              title="Redo"
              className="border-2 border-blue-600 text-blue-600  disabled:opacity-60 rounded-md px-3 py-1 w-full"
              onClick={redo}
              // disabled={historyIndex===history.length || historyIndex!=1}
            >
              <GrRedo className="inline mr-1" size={20} />
            </button>
          </div> */}

          <button
            className="w-full h-[40px] border-2 text-blue-600  border-blue-600 hover:bg-blue-600 hover:text-white tracking-wide rounded-md"
            onClick={clearCanvas}
          >
            <MdClear className="inline mr-1" size={20} />
            Clear
          </button>
          <button
            className="w-full h-[40px] border-2 text-red-600  border-red-600 hover:bg-red-600 hover:text-white tracking-wide rounded-md"
            onClick={onClickExit}
          >
            <IoExitOutline className="inline mr-1" size={20} />
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}

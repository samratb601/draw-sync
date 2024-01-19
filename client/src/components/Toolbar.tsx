import Draggable from "react-draggable";
import { IoMove } from "react-icons/io5";

interface ToolbarProps {
  brushColor: string;
  setBrushColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
}

export default function Toolbar(props: ToolbarProps) {
  const { setBrushColor } = props;

  return (
    <Draggable
      handle=".drag-handle"
      defaultPosition={{ x: 0, y: 0 }}
    >
      <div className="absolute left-0 top-[30%] bg-[#fff] py-4 px-1 border-2 rounded-md shadow">
        <div className="drag-handle absolute -top-4 left-2">
          <button className="bg-blue-600 text-white p-1 rounded-md hover:bg-blue-600/90 text-center">
            <IoMove />
          </button>
        </div>
        <div className="flex-1 gap-2">
          <div
            title={"brush color"}
            className={`relative group px-2 "bg-blue-500 text-white" hover:bg-blue-500/90 hover:text-white py-2 my-1 rounded cursor-pointer`}
            onClick={() => {}}
          >
            <input
              type="color"
              onChange={(e) => {
                setBrushColor(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
    </Draggable>
  );
}

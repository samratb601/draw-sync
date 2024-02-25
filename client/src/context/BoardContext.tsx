import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type BoardContextType = {
  canvasEl: HTMLCanvasElement | null | undefined;
  setCanvasEl: Dispatch<SetStateAction<HTMLCanvasElement | null | undefined>>;
  toolType: ToolType;
  setToolType: Dispatch<SetStateAction<ToolType>>;
  brushColor: string;
  setBrushColor: Dispatch<SetStateAction<string>>;
  brushSize: number;
  setBrushSize: Dispatch<SetStateAction<number>>;
  saveCanvasHistory: () => void;
  history: string[];
  historyIndex: number;
  undo: () => void;
  redo: () => void;
  clearCanvas: () => void;
};

const BoardContext = createContext<BoardContextType>({
  canvasEl: null,
  setCanvasEl: () => {},
  toolType: "brush",
  setToolType: () => {},
  brushColor: "black",
  setBrushColor: () => {},
  brushSize: 0,
  setBrushSize: () => {},
  saveCanvasHistory: () => {},
  history: [],
  historyIndex: -1,
  undo: () => {},
  redo: () => {},
  clearCanvas: () => {},
});

export const useBoardContext = () => {
  return useContext(BoardContext);
};

export type ToolType =
  | "brush"
  | "line"
  | "triangle"
  | "rectangle"
  | "circle"
  | "eraser";

export const BoardContextProvider = ({ children }: any) => {
  const [canvasEl, setCanvasEl] = useState<
    HTMLCanvasElement | null | undefined
  >();
  const [toolType, setToolType] = useState<ToolType>("brush");
  const [brushColor, setBrushColor] = useState("black");
  const [brushSize, setBrushSize] = useState<number>(5);

  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const saveCanvasHistory = () => {
    if (!canvasEl) return;
    const state = canvasEl.toDataURL();
    setHistory((history) => [...history, state]);
    setHistoryIndex(history.length);
  };

  const redo = () => {
    if (!canvasEl) return;
    const ctx = canvasEl.getContext("2d");
    if (historyIndex < history.length - 1 && ctx) {
      setHistoryIndex(historyIndex + 1);
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = history[historyIndex + 1];
    }
  };
  const undo = () => {
    if (!canvasEl) return;
    const ctx = canvasEl.getContext("2d");
    if (historyIndex >= 0 && ctx) {
      setHistoryIndex(historyIndex - 1);
      if (historyIndex == 0) {
        clearCanvas();
        return;
      }
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = history[historyIndex - 1];
    }
  };

  const clearCanvas = () => {
    if (!canvasEl) return;
    const ctx = canvasEl.getContext("2d");
    ctx?.clearRect(0, 0, canvasEl.width, canvasEl.height); // clearing whole canvas
    setHistory([]);
    setHistoryIndex(-1);
  };

  const value = {
    canvasEl,
    setCanvasEl,
    toolType,
    setToolType,
    brushColor,
    setBrushColor,
    brushSize,
    setBrushSize,
    saveCanvasHistory,
    history,
    historyIndex,
    redo,
    undo,
    clearCanvas,
  };
  return (
    <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
  );
};

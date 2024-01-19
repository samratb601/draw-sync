import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

type BoardContextType = {
  brushColor: string;
  setBrushColor: Dispatch<SetStateAction<string>>;
  brushSize: number ;
  setBrushSize: Dispatch<SetStateAction<number>>;
  undo: () => void;
  redo: () => void;
};

const BoardContext = createContext<BoardContextType>({
  brushColor: "black",
  setBrushColor: () => {},
  brushSize: 0,
  setBrushSize: () => {},
  undo: () => {},
  redo: () => {},
});

export const useBoardContext = () => {
  return useContext(BoardContext);
};

export const BoardContextProvider = ({ children }: any) => {
  const [brushColor, setBrushColor] = useState("black");
  const [brushSize, setBrushSize] = useState<number>(5);

  const redo = () => {};
  const undo = () => {};

  const value = {
    brushColor,
    setBrushColor,
    brushSize,
    setBrushSize,
    redo,
    undo,
  };
  return (
    <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
  );
};

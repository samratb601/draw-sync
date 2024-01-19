import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import BoardPage from "./pages/BoardPage";
import CreateRoom from "./pages/CreateRoom";
import { Toaster } from "react-hot-toast";

const router = createBrowserRouter([
  {
    path: "/",
    element: <CreateRoom />,
  },
  {
    path: "/:roomId",
    element: <BoardPage />,
  },
]);

export default function App() {
  return (
    <div>
      <RouterProvider router={router} />
      <Toaster />
    </div>
  );
}

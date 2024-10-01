import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import Root from "./routes/root";
import ErrorPage from "./error-page";
import QuranExplorer from "./routes/quranexplorer";
import HomeworkCard from "./components/HomeworkCard";
import ClassPlacement from "./components/ClassPlacement";
import Table from "./components/Table";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: "/quran-explorer",
        element: <QuranExplorer/>,
      },
      {
        path: "/quran-explorer/:studentId/:courseId",
        element: <QuranExplorer/>,
      },
      {
        path: "/class-list",
        element: <Table/>,
      },
      {
        path: "/homework",
        element: <HomeworkCard/>,
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
);
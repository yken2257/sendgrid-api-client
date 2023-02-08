import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider, Navigate } from "react-router-dom";
import "@cloudscape-design/global-styles/index.css";
import { apiDetailArray } from "./parseOpenApi"
import Root from './Root';
import Home from './Home';
import SendGridApiClient from './components/SendGridApiClient';
import CustomApiClient from './components/CustomApiClient';
import { ApiKeyProvider } from "./components/ApiKeyProvider";
import JsonFormatter from "./components/JsonFormatter";

export const fetchApiArray = async () => {
  return apiDetailArray;
};

const apiArrayLoader = async () => {
  return await fetchApiArray();
};

const apiDetailLoader = async ({ params }) => {
  const api = apiDetailArray.find((api) => api.docPath === params.docPath);
  if (!api) {
    throw new Response("Not found", { status: 404 });
  }
  return api;
};


const router = createHashRouter([
  {
    path: "/",
    element: <Root/>,
    children: [
      {
        path: "index",
        element: <Home/>,
      },
      {
        path: "/api/v3/",
        element: <Navigate to="/api/v3/GET_legacy-activity"/>
      },
      {
        path: "/api/v3/:docPath",
        element: <SendGridApiClient/>,
        loader: apiDetailLoader
      },
      {
        path: "/api/custom",
        element: <CustomApiClient/>,
      },
      {
        path: "/json",
        element: <JsonFormatter/>,
      },
    ],
  },
]);

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
<StrictMode>
  <ApiKeyProvider>
    <RouterProvider router={router} />
  </ApiKeyProvider>
</StrictMode>
);
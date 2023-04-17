import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider, Navigate } from "react-router-dom";
import "@cloudscape-design/global-styles/index.css";
import '@aws-amplify/ui-react/styles.css'
import { Authenticator } from '@aws-amplify/ui-react';
import { authComponents, setVocabularies } from "./components/auth-config";

import { ApiKeyProvider, AuthContext } from "./components/Contexts";
import { apiDetailArray, mailSendSampleArray } from "./generate-metadata"
import SendGridApiClient from './components/SendGridApiClient';
import CustomApiClient from './components/CustomApiClient';
import Home from "./components/Home";
import CommonNavBar from "./components/CommonNavBar";
import ErrorPage from "./components/ErrorPage";
import JsonFormatter from "./components/JsonFomatter";
import StatsViewer from "./components/StatsViewer";
import ActivityViewer from "./components/ActivityViewer";
import EmailDecoder from "./components/EmailDecoder";
import MailSendHelper from "./components/MailSendHelper";

const apiDetailLoader = async ({ params }) => {
  const api = apiDetailArray.find((api) => api.docPath === params.docPath);
  if (!api) {
    throw new Response("Not found", { status: 404 });
  }
  return api;
};

const mailSendSampleLoader = async ({ params }) => {
  const sample = mailSendSampleArray.find((sample) => sample.id === params.id);
  if (!sample) {
    throw new Response("Not found", { status: 404 });
  }
  return sample;
};

const router = createHashRouter([
  {
    path: "/",
    element: <CommonNavBar/>,
    errorElement: <ErrorPage/>,
    children: [
      {
        path: "/index",
        element: <Home/>,
      },
      {
        path: "/api/custom",
        element: <CustomApiClient/>,
      },
      {
        path: "/api/v3/",
        element: <Navigate to="/api/v3/GET_legacy-activity"/>
      },
      {
        path: "/api/v3/:docPath",
        element: <SendGridApiClient/>,
        loader: apiDetailLoader,
      },
      {
        path: "/json",
        element: <JsonFormatter/>,
      },
      {
        path: "/stats",
        element: <StatsViewer/>,
      },
      {
        path: "/activity",
        element: <ActivityViewer/>,
      },
      {
        path: "/email-decode",
        element: <EmailDecoder/>,
      },
      {
        path: "/mailsend/",
        element: <Navigate to="/mailsend/simple-plain"/>
      },
      {
        path: "/mailsend/:id",
        element: <MailSendHelper/>,
        loader: mailSendSampleLoader,
      },
    ]
  },
]);

setVocabularies();
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
<StrictMode>
  <Authenticator hideSignUp={true} loginMechanisms={['email']} components={authComponents}>
    {({ signOut, user }) => (
      <AuthContext.Provider value={{ signOut, user }}>
        <ApiKeyProvider>
          <RouterProvider router={router} />
        </ApiKeyProvider>
      </AuthContext.Provider>
    )}
  </Authenticator>
</StrictMode>
);
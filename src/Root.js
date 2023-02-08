import React, { useState, useContext } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";

import ApiKeyMordal from "./components/ApiKeyModal";
import NavigationBar from "./components/NavigationBar";
import { ApiKeyContext } from "./components/ApiKeyProvider";

export default function Root() {
  const location = useLocation();

  const { apiKey, setApiKey } = useContext(ApiKeyContext);
  const [viewApIkeyModal, setViewApIkeyModal] = useState(false);

  const handleViewApiKeyMordal = () => {
    setViewApIkeyModal(true);
  }

  if (location.pathname === '/') return <Navigate replace to="/index"/>;

  return (
    <>
      <NavigationBar
        onViewApiKeyMordal={handleViewApiKeyMordal}
      />
      <ApiKeyMordal
        visible={viewApIkeyModal}
        apiKey={apiKey}
        onChangeApiKey={(value) => setApiKey(value)}
        onDismissApiKeyMordal={() => setViewApIkeyModal(false)}  
      />
      <div id="menu">
        <Outlet/>
      </div>
    </>
  );
}
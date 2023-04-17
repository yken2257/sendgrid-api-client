import React, { useState, useContext } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";

import ApiKeyMordal from "./ApiKeyModal";
import NavigationBar from "./NavigationBar";
import { AuthContext } from "./Contexts";

export default function Root() {
  const location = useLocation();

  const { user, signOut } = useContext(AuthContext);
  const [viewApIkeyModal, setViewApIkeyModal] = useState(false);

  const handleViewApiKeyMordal = () => {
    setViewApIkeyModal(true);
  }

  if (location.pathname === '/') return <Navigate replace to="/index"/>;

  return (
    <>
      <NavigationBar
        onViewApiKeyMordal={handleViewApiKeyMordal}
        user={user}
        signOut={signOut}
      />
      <ApiKeyMordal
        visible={viewApIkeyModal}
        user={user}
        onDismissApiKeyMordal={() => setViewApIkeyModal(false)}  
      />
      <div id="menu">
        <Outlet/>
      </div>
    </>
  );
}
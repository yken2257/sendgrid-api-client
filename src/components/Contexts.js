import { createContext, useState } from "react";

export const ApiKeyContext = createContext({});
export const AuthContext = createContext({});

export const ApiKeyProvider = (props) => {
  const { children } = props;
  const [apiKey, setApiKey] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey, selectedKey, setSelectedKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

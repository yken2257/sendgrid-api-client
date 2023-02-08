import { createContext, useState } from "react";

export const ApiKeyContext = createContext({});

export const ApiKeyProvider = (props) => {
  const { children } = props;
  const [apiKey, setApiKey] = useState("API_KEY");

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

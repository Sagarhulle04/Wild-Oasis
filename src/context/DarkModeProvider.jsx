import React, { createContext, useContext, useState } from "react";

const DarkModeContext = createContext();

const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  function toggleDarkMode() {
    setIsDarkMode((toggle) => !toggle);
  }

  return (
    <DarkModeContext.Provider value={{ toggleDarkMode, isDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

function useDarkMode() {
  const context = useContext(DarkModeContext);

  if (context === undefined) {
    throw new Error(
      "Dark Mode context was used outside the Dark mode provider",
    );
  }
  return context;
}

export { DarkModeProvider, useDarkMode };

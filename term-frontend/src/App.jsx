import { useState, useRef } from "react";
import "./App.css";
import Terminal from "./components/Terminal";
import SunIcon from "../assets/sun.svg?react";
import MoonIcon from "../assets/moon.svg?react";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const rootRef = useRef(null);

  const handleTheme = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      rootRef.current.style.setProperty("--term-bg-color", "#f5f5f5");
      rootRef.current.style.setProperty("--term-text-color", "#333333");
    } else {
      rootRef.current.style.setProperty("--term-bg-color", "black");
      rootRef.current.style.setProperty("--term-text-color", "white");
    }
  };

  return (
    <div ref={rootRef} className="App">
      <div onClick={handleTheme} className="switch">
        {darkMode ? <MoonIcon /> : <SunIcon />}
      </div>
      <Terminal />
    </div>
  );
}

export default App;

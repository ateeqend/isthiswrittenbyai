import React from "react";
import DetectionForm from "./DetectionForm";
import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div className="App">
      <nav>
        <img src={logo} alt="logo" />
        <ul></ul>
      </nav>
      <main>
        <h1>Is this Written by GPT?</h1>
        <DetectionForm />
      </main>
    </div>
  );
}

export default App;

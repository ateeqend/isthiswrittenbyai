import React from "react";
import ContactForm from "./ContactForm";
import logo from "./logo.svg";
import "./App.css";

function App() {
  return (
    <div className="App">
      <nav>
        <img src={logo} alt="logo" />
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
        </ul>
      </nav>
      <main>
        <h1>Contact Form</h1>
        <ContactForm />
      </main>
    </div>
  );
}

export default App;

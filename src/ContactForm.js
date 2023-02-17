import React, { useState } from "react";

export default function ContactForm() {
  const [responseData, setResponseData] = useState(null);
  const [state, setState] = useState({ submitting: false });

  const onSubmit = async (event) => {
    event.preventDefault();

    setState({ submitting: true });

    const response = await fetch("https://gpt-detector.ateeqend.workers.dev/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: event.target.message.value }),
      mode: "cors",
    });

    const result = await response.json();
    setResponseData(result);
    setState({ submitting: false });
  };

  if (responseData) {
    return <p>{JSON.stringify(responseData)}</p>;
  }

  return (
    <form onSubmit={onSubmit}>
      <label htmlFor="message">Message</label>
      <textarea id="message" name="message" required></textarea>
      <button type="submit" disabled={state.submitting}>
        Submit
      </button>
    </form>
  );
}

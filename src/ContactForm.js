import React, { useState } from "react";

export default function ContactForm() {
  const [responseData, setResponseData] = useState(null);
  const [state, setState] = useState({ submitting: false });

  const rHeaders = new Headers({
    Authorization: `Bearer ${process.env.HF_API_TOKEN}`,
    "Content-Type": "text/plain",
  });
  const onSubmit = async (event) => {
    event.preventDefault();

    setState({ submitting: true });
    const requestOptions = {
      method: "POST",
      headers: rHeaders,
      body: event.target.message.value,
      redirect: "follow",
    };
    const url =
      "https://api-inference.huggingface.co/models/roberta-base-openai-detector";

    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));

    // const result = await response.json();
    // setResponseData(result);
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

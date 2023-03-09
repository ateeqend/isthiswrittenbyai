import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

function DetectionForm() {
  const [text, setText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [chunks, setChunks] = useState([]);
  const [isCheckedAcknowledge, setIsCheckedAcknowledge] = useState(false);
  const [isCheckedTerms, setIsCheckedTerms] = useState(false);
  const [isCheckedAutoselect, setIsCheckedAutoselect] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(["autoSelectCookie"]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsCheckedAcknowledge(cookies.autoSelectCookie === "true");
    setIsCheckedTerms(cookies.autoSelectCookie === "true");
    setIsCheckedAutoselect(cookies.autoSelectCookie === "true");
  }, [cookies]);

  const handleAutoSelectChange = (event) => {
    const isCheckedAutoSelect = event.target.checked;
    setIsCheckedAutoselect(isCheckedAutoSelect);
    setCookie("autoSelectCookie", isCheckedAutoSelect.toString(), {
      path: "/",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("https://model.gptwritten.com/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        setErrorMsg(response.error);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setChunks(data);
      setErrorMsg("");
    } catch (error) {
      console.error(error);
      setChunks([]);
      setErrorMsg(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderChunk = (chunk, index) => {
    const probability = JSON.parse(chunk.p)[0];
    let style = {
      backgroundColor: "inherit",
    };
    if (probability >= 0.8) style = { backgroundColor: "red", color: "white" };
    else if (probability >= 0.6) style = { backgroundColor: "yellow" };

    return (
      <ul class="resultChunk">
        <li key={chunk.s} style={style}>
          {text.substring(chunk.s, chunk.e + index)}
        </li>
        <li key={probability}>{Math.round(probability * 100)}%</li>
      </ul>
    );
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <textarea
            id="text"
            placeholder="Identify standard output from GPT AI tool. Minimum 120 characters are required."
            value={text}
            onChange={(event) => setText(event.target.value)}
          />
        </div>
        <div>
          <ul>
            <li>
              <input
                type="checkbox"
                id="acknowledge"
                name="acknowledge"
                checked={isCheckedAcknowledge}
                onChange={(event) =>
                  setIsCheckedAcknowledge(event.target.checked)
                }
              />
              <label htmlFor="acknowledge">
                I acknowledge that sometimes a human-written text can be
                mistakenly classified as AI text.
              </label>
            </li>
            <li>
              <input
                type="checkbox"
                id="termscheckbox"
                name="termscheckbox"
                checked={isCheckedTerms}
                onChange={(event) => setIsCheckedTerms(event.target.checked)}
              />
              <label htmlFor="termscheckbox">
                I agree to the terms and conditions
              </label>
            </li>
            <li>
              <input
                type="checkbox"
                id="autoselect"
                name="autoselect"
                checked={isCheckedAutoselect}
                onChange={handleAutoSelectChange}
              />
              <label htmlFor="autoselect">
                Auto-select the above on my next visit.
              </label>
            </li>
          </ul>
        </div>
        <button
          type="submit"
          disabled={
            !isCheckedAcknowledge || !isCheckedTerms || text.length < 120
          }
          title={
            !isCheckedAcknowledge
              ? "Please acknowledge that sometimes a human-written text can be mistakenly classified as AI text."
              : !isCheckedTerms
              ? "Please agree to the terms and conditions."
              : text.length < 120
              ? "Please enter at least 120 characters."
              : ""
          }
        >
          Check Results
        </button>

        {isLoading && <div className="loader"></div>}
        <div>
          <ul class="resultChunk resultHeader">
            <li key="chunkTitle">Text Portion</li>
            <li key="probability">Likelyhood of being AI Written</li>
          </ul>
          <ul>{chunks.map((chunk, index) => renderChunk(chunk, index))}</ul>
        </div>
      </form>
      {errorMsg && <div className="error">{errorMsg}</div>}
    </div>
  );
}

export default DetectionForm;

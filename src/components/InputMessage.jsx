import { useState } from 'react';


function InputMessage({ onSend }) {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      onSend(inputValue);
      setInputValue(""); 
    }
  };

  const handleClick = () => {
    if (inputValue.trim() !== "") {
      onSend(inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="inputMessage">
      <input 
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        type="text"
        placeholder='Type a message...' 
      />
      <button onClick={handleClick}>Send</button>
    </div>
  );
}

export default InputMessage;

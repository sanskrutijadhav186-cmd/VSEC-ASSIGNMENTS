
import { useNavigate } from "react-router-dom";

import "./App.css";

function Input({ setName, setCity }) {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Enter Details</h2>

      <input
        type="text"
        placeholder="Enter Name"
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <input
        type="text"
        placeholder="Enter City"
        onChange={(e) => setCity(e.target.value)}
      />

      <br /><br />

      <button onClick={() => navigate("/display")}>
        Next
      </button>
    </div>
  );
}

export default Input;

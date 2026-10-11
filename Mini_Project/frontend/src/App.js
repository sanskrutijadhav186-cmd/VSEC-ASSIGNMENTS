

import { useState, useEffect } from "react";
import "./App.css";

const API = "http://localhost:5000/items";

function App() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState("");
  const [itemType, setItemType] = useState("Lost");
  const [location, setLocation] = useState("");
  const [search, setSearch] = useState("");

  async function getItems() {
    try {
      const response = await fetch(
        API + "?search=" + encodeURIComponent(search)
      );
      const data = await response.json();
      setItems(data);
    } catch (err) {
      alert("Cannot connect to backend");
    }
  }

  useEffect(() => {
    getItems();
  }, [search]);

  async function addItem() {
    if (!itemName.trim() || !location.trim()) {
      alert("Please enter all details");
      return;
    }

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: itemName,
          type: itemType,
          location: location
        })
      });

      if (!response.ok) {
        alert("Could not add item");
        return;
      }

      setItemName("");
      setLocation("");
      getItems();
    } catch (err) {
      alert("Cannot connect to backend");
    }
  }

  async function updateStatus(id, status) {
    await fetch(API + "/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: status })
    });

    getItems();
  }

  async function deleteItem(id) {
    await fetch(API + "/" + id, {
      method: "DELETE"
    });

    getItems();
  }

  return (
    <div className="container">
      <h1>Campus Lost & Found</h1>
      <p>Lost something on campus? Find it here!</p>

      <div className="form">
        <input
          type="text"
          placeholder="Enter item name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />

        <select
          value={itemType}
          onChange={(e) => setItemType(e.target.value)}
        >
          <option value="Lost">Lost Item</option>
          <option value="Found">Found Item</option>
        </select>

        <input
          type="text"
          placeholder="Where was it lost/found?"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <button onClick={addItem}>Add Item</button>
      </div>

      <h2>Search Items</h2>

      <input
        type="text"
        placeholder="Search by item name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <h2>Reported Items ({items.length})</h2>

      {items.length === 0 && <p>No items found.</p>}

      {items.map((item) => (
        <div className="item" key={item._id}>
          <h3>{item.name}</h3>
          <p>Type: {item.type}</p>
          <p>Location: {item.location}</p>
          <p>Status: {item.status}</p>

          <button
            onClick={() =>
              updateStatus(
                item._id,
                item.status === "Available" ? "Claimed" : "Available"
              )
            }
          >
            {item.status === "Available"
              ? "Mark as Claimed"
              : "Mark as Available"}
          </button>

          <button onClick={() => deleteItem(item._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;

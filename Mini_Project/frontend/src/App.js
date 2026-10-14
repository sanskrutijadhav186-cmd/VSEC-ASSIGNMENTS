import { useState, useEffect } from "react";
import "./App.css";

const API = "http://localhost:5000";

function App() {
  const [login, setLogin] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [page, setPage] = useState("add");

  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  // Login or register
  async function handleAuth() {
    try {
      const response = await fetch(
        API + (login ? "/login" : "/register"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      if (login) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.name);
        setToken(data.token);
        setName(data.name);
        setPage("add");
        setMessage("");
      } else {
        setMessage("Registration successful. Please login.");
        setLogin(true);
      }
    } catch (err) {
      setMessage("Cannot connect to backend");
    }
  }

  // Load expenses
  async function loadExpenses() {
    try {
      const response = await fetch(
        API + "/expenses?search=" + encodeURIComponent(search),
        {
          headers: { Authorization: "Bearer " + token }
        }
      );

      const data = await response.json();

      if (response.ok) {
        setExpenses(data);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Could not load expenses");
    }
  }

  useEffect(() => {
    if (token) {
      loadExpenses();
    }
  }, [token, search]);

  // Clear expense form
  function clearForm() {
    setAmount("");
    setCategory("Food");
    setDate("");
    setDescription("");
    setEditId(null);
  }

  // Add or update expense
  async function saveExpense() {
    if (!amount || Number(amount) <= 0 || !date || !description.trim()) {
      setMessage("Please fill all expense fields correctly");
      return;
    }

    try {
      const response = await fetch(
        API + (editId ? "/expenses/" + editId : "/expenses"),
        {
          method: editId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          },
          body: JSON.stringify({
            amount: Number(amount),
            category,
            date,
            description: description.trim()
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(editId ? "Expense updated" : "Expense added");
        clearForm();

        await loadExpenses();
        setPage("expenses");
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Could not save expense");
    }
  }

  // Edit expense
  function editExpense(expense) {
    setEditId(expense._id);
    setAmount(String(expense.amount));
    setCategory(expense.category);
    setDate(expense.date);
    setDescription(expense.description);
    setMessage("");
    setPage("add");
  }

  // Delete expense
  async function deleteExpense(id) {
    if (!window.confirm("Delete this expense?")) {
      return;
    }

    try {
      const response = await fetch(API + "/expenses/" + id, {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token }
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Expense deleted");

        if (editId === id) {
          clearForm();
        }

        await loadExpenses();
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Could not connect to backend");
    }
  }

  // Logout
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("name");

    setToken(null);
    setName("");
    setExpenses([]);
    setSearch("");
    clearForm();
    setMessage("");
    setPage("add");
  }

  // Page 1: Login or Register
  if (!token) {
    return (
      <div className="container">
        <h1>SpendSmart</h1>
        <p>Manage your student expenses easily.</p>

        <div className="form">
          <h2>{login ? "Login" : "Register"}</h2>

          {!login && (
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleAuth}>
            {login ? "Login" : "Register"}
          </button>

          <p>{message}</p>

          <button
            className="link-button"
            onClick={() => {
              setLogin(!login);
              setMessage("");
            }}
          >
            {login ? "Create an account" : "Back to Login"}
          </button>
        </div>
      </div>
    );
  }

  // Total of currently displayed expenses
  const total = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return (
    <div className="main-container">
      <div className="header">
        <div>
          <h1>SpendSmart</h1>
          <p>Welcome, {name}!</p>
        </div>

        <button onClick={logout}>Logout</button>
      </div>

      <div className="expense-section">
        <button onClick={() => setPage("add")}>
          Add Expense
        </button>

        <button onClick={() => {
          setMessage("");
          loadExpenses();
          setPage("expenses");
        }}>
          My Expenses
        </button>
      </div>

      {/* Page 2: Add or Edit Expense */}
      {page === "add" && (
        <div className="expense-section">
          <h2>{editId ? "Edit Expense" : "Add Expense"}</h2>

          <div className="expense-form">
            <input
              type="number"
              placeholder="Amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>Food</option>
              <option>Travel</option>
              <option>Shopping</option>
              <option>Education</option>
              <option>Other</option>
            </select>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <button onClick={saveExpense}>
              {editId ? "Update Expense" : "Add Expense"}
            </button>

            {editId && (
              <button onClick={clearForm}>
                Cancel Edit
              </button>
            )}
          </div>

          <p>{message}</p>
        </div>
      )}

      {/* Page 3: Display, Edit and Delete Expenses */}
      {page === "expenses" && (
        <div className="expense-section">
          <h2>My Expenses</h2>

          <h3>Total: ₹{total}</h3>

          <input
            className="search-input"
            placeholder="Search by description"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <p>{message}</p>

          {expenses.length === 0 && (
            <p>No expenses found.</p>
          )}

          {expenses.map((expense) => (
            <div className="expense-item" key={expense._id}>
              <div>
                <h3>{expense.description}</h3>
                <p>{expense.category} • {expense.date}</p>
                <h3>₹{expense.amount}</h3>
              </div>

              <div className="expense-actions">
                <button onClick={() => editExpense(expense)}>
                  Edit
                </button>

                <button onClick={() => deleteExpense(expense._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
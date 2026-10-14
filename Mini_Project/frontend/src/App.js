
import { useState, useEffect } from "react";
import "./App.css";

const API = "http://localhost:5000";

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const [page, setPage] = useState(
    localStorage.getItem("user") ? "add" : "login"
  );

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState("");

  // Login or Register
  async function login() {
    try {
      const url = isRegister ? "/register" : "/login";

      const body = isRegister
        ? { name, email, password }
        : { email, password };

      const res = await fetch(API + url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message);
        return;
      }

      if (isRegister) {
        setIsRegister(false);
        setPassword("");
        setMessage("Registered! Please login.");
      } else {
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        setPage("add");
        setMessage("");
      }
    } catch {
      setMessage("Cannot connect to backend");
    }
  }

  // READ - Load expenses
  async function loadExpenses() {
    try {
      const res = await fetch(
        API + "/expenses/" + user.id +
        "?search=" + encodeURIComponent(search)
      );

      const data = await res.json();

      if (res.ok) {
        setExpenses(data);
      } else {
        setMessage(data.message);
      }
    } catch {
      setMessage("Could not load expenses");
    }
  }

  useEffect(() => {
    if (user && page === "expenses") {
      loadExpenses();
    }
  }, [user, page, search]);

  // Clear form
  function clearForm() {
    setAmount("");
    setCategory("Food");
    setDate("");
    setDescription("");
    setEditId("");
  }

  // CREATE or UPDATE
  async function saveExpense() {
    if (!amount || Number(amount) <= 0 || !date || !description.trim()) {
      setMessage("Please fill all fields correctly");
      return;
    }

    const expense = {
      userId: user.id,
      amount: Number(amount),
      category,
      date,
      description: description.trim()
    };

    try {
      const res = await fetch(
        API + (editId ? "/expenses/" + editId : "/expenses"),
        {
          method: editId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(expense)
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage(editId ? "Expense updated" : "Expense added");
        clearForm();
        setPage("expenses");
      } else {
        setMessage(data.message || "Could not save expense");
      }
    } catch {
      setMessage("Cannot connect to backend");
    }
  }

  // Edit expense
  function editExpense(expense) {
    setAmount(String(expense.amount));
    setCategory(expense.category);
    setDate(expense.date);
    setDescription(expense.description);
    setEditId(expense._id);
    setMessage("");
    setPage("add");
  }

  // DELETE - Remove expense
  async function deleteExpense(id) {
    if (!window.confirm("Delete this expense?")) return;

    try {
      const res = await fetch(
        API + "/expenses/" + id + "?userId=" + user.id,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage("Expense deleted");
        loadExpenses();
      } else {
        setMessage(data.message);
      }
    } catch {
      setMessage("Could not delete expense");
    }
  }

  // Logout
  function logout() {
    localStorage.removeItem("user");
    setUser(null);
    setExpenses([]);
    clearForm();
    setSearch("");
    setPage("login");
    setMessage("");
  }

  // PAGE 1 - Login
  if (!user) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h1>SpendSmart</h1>
          <p>Track your expenses. Manage your money.</p>

          <h2>{isRegister ? "Register" : "Login"}</h2>

          {isRegister && (
            <input
              placeholder="Enter your name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button onClick={login}>
            {isRegister ? "Register" : "Login"}
          </button>

          <p className="message">{message}</p>

          <p className="register-link">
            {isRegister
              ? "Already have an account? "
              : "Don't have an account? "}

            <span onClick={() => {
              setIsRegister(!isRegister);
              setMessage("");
            }}>
              {isRegister ? "Login" : "Register"}
            </span>
          </p>
        </div>
      </div>
    );
  }

  // PAGE 2 - Add or Edit Expense
  if (page === "add") {
    return (
      <div className="dashboard">
        <header>
          <div>
            <h1>SpendSmart</h1>
            <p>Welcome, {user.name}!</p>
          </div>
          <button className="small-button" onClick={logout}>
            Logout
          </button>
        </header>

        <nav>
          <button onClick={() => setPage("add")}>
            Add Expense
          </button>
          <button onClick={() => {
            setMessage("");
            setPage("expenses");
          }}>
            My Expenses
          </button>
        </nav>

        <section className="expense-section">
          <h2>{editId ? "Edit Expense" : "Add Expense"}</h2>

          <div className="expense-form">
            <input
              type="number"
              placeholder="Amount (₹)"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />

            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
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
              onChange={e => setDate(e.target.value)}
            />

            <input
              placeholder="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />

            <button onClick={saveExpense}>
              {editId ? "Update Expense" : "Add Expense"}
            </button>

            {editId && (
              <button onClick={() => {
                clearForm();
                setMessage("");
              }}>
                Cancel Edit
              </button>
            )}
          </div>

          <p className="message">{message}</p>
        </section>
      </div>
    );
  }

  // PAGE 3 - My Expenses
  const total = expenses.reduce(
    (sum, expense) => sum + expense.amount, 0
  );

  return (
    <div className="dashboard">
      <header>
        <div>
          <h1>SpendSmart</h1>
          <p>Welcome, {user.name}!</p>
        </div>
        <button className="small-button" onClick={logout}>
          Logout
        </button>
      </header>

      <nav>
        <button onClick={() => {
          clearForm();
          setMessage("");
          setPage("add");
        }}>
          Add Expense
        </button>
        <button onClick={() => setPage("expenses")}>
          My Expenses
        </button>
      </nav>

      <section className="expense-section">
        <h2>My Expenses</h2>
        <h3>Total: ₹{total}</h3>

        <input
          className="search-input"
          placeholder="Search by description"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <p className="message">{message}</p>

        {expenses.length === 0 && <p>No expenses found.</p>}

        {expenses.map(expense => (
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
      </section>
    </div>
  );
}

export default App;

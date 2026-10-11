
import { useState, useEffect } from "react";
import "./App.css";

const API = "http://localhost:5000";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));

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
  const [budget, setBudget] = useState(5000);
  const [newBudget, setNewBudget] = useState("5000");

  async function handleSubmit() {
    if (!email.trim() || !password.trim()) {
      setMessage("Please enter email and password");
      return;
    }

    if (!isLogin && !name.trim()) {
      setMessage("Please enter your name");
      return;
    }

    try {
      const url = isLogin ? "/login" : "/register";

      const response = await fetch(API + url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();
      setMessage(data.message);

      if (isLogin && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.name);
        setLoggedIn(true);
      }
    } catch (err) {
      setMessage("Cannot connect to backend");
    }
  }

  async function getExpenses() {
    try {
      const response = await fetch(
        API + "/expenses?search=" + encodeURIComponent(search),
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        setExpenses(data);
      } else {
        setMessage(data.message || "Error fetching expenses");
      }
    } catch (err) {
      setMessage("Cannot connect to backend");
    }
  }

  async function addExpense() {
    if (!amount || Number(amount) <= 0 || !date || !description.trim()) {
      alert("Please enter all expense details");
      return;
    }

    try {
      const response = await fetch(API + "/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({
          amount: Number(amount),
          category,
          date,
          description
        })
      });

      if (response.ok) {
        setAmount("");
        setDate("");
        setDescription("");
        getExpenses();
      } else {
        alert("Could not add expense");
      }
    } catch (err) {
      alert("Cannot connect to backend");
    }
  }

  async function deleteExpense(id) {
    try {
      const response = await fetch(API + "/expenses/" + id, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });

      if (response.ok) {
        getExpenses();
      }
    } catch (err) {
      alert("Cannot connect to backend");
    }
  }

  async function getBudget() {
    try {
      const response = await fetch(API + "/budget", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      });

      const data = await response.json();

      if (response.ok) {
        setBudget(data.budget);
        setNewBudget(String(data.budget));
      }
    } catch (err) {
      setMessage("Cannot fetch budget");
    }
  }

  async function saveBudget() {
    if (newBudget === "" || Number(newBudget) < 0) {
      alert("Enter a valid budget");
      return;
    }

    try {
      const response = await fetch(API + "/budget", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({ budget: Number(newBudget) })
      });

      const data = await response.json();

      if (response.ok) {
        setBudget(data.budget);
        alert("Budget saved successfully");
      }
    } catch (err) {
      alert("Cannot connect to backend");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    setLoggedIn(false);
    setExpenses([]);
    setMessage("");
    setPassword("");
  }

  useEffect(() => {
    if (loggedIn) {
      getExpenses();
      getBudget();
    }
  }, [loggedIn]);

  useEffect(() => {
    if (loggedIn) {
      getExpenses();
    }
  }, [search]);

  const currentMonth = new Date().toISOString().slice(0, 7);

  const monthlyTotal = expenses
    .filter((expense) => expense.date.startsWith(currentMonth))
    .reduce((total, expense) => total + expense.amount, 0);

  if (!loggedIn) {
    return (
      <div className="container">
        <h1>SpendSmart</h1>
        <p>Track your expenses. Manage your money.</p>

        <div className="form">
          <h2>{isLogin ? "Login" : "Create Account"}</h2>

          {!isLogin && (
            <input
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleSubmit}>
            {isLogin ? "Login" : "Register"}
          </button>

          <p>{message}</p>

          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              className="link-button"
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage("");
              }}
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="header">
        <div>
          <h1>SpendSmart</h1>
          <p>Welcome, {localStorage.getItem("name")}!</p>
        </div>

        <button onClick={logout}>Logout</button>
      </div>

      <div className="budget-section">
        <h2>Monthly Budget</h2>

        <div className="budget-details">
          <div>
            <p>Total Budget</p>
            <h3>₹{budget}</h3>
          </div>

          <div>
            <p>Total Spent</p>
            <h3>₹{monthlyTotal}</h3>
          </div>

          <div>
            <p>Remaining</p>
            <h3>₹{budget - monthlyTotal}</h3>
          </div>
        </div>

        <div className="budget-form">
          <input
            type="number"
            placeholder="Enter monthly budget"
            value={newBudget}
            onChange={(e) => setNewBudget(e.target.value)}
          />
          <button onClick={saveBudget}>Save Budget</button>
        </div>
      </div>

      <div className="expense-section">
        <h2>Add New Expense</h2>

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

          <button onClick={addExpense}>Add Expense</button>
        </div>
      </div>

      <div className="expense-section">
        <h2>My Expenses ({expenses.length})</h2>

        <input
          className="search-input"
          placeholder="Search by description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {expenses.length === 0 && <p>No expenses found.</p>}

        {expenses.map((expense) => (
          <div className="expense-item" key={expense._id}>
            <div>
              <h3>{expense.description}</h3>
              <p>{expense.category} • {expense.date}</p>
            </div>

            <div className="expense-actions">
              <h3>₹{expense.amount}</h3>
              <button onClick={() => deleteExpense(expense._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

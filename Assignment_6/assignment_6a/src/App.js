
import { useState } from 'react';
import './App.css';
import Form from './Form';

function ComponentOne() {
  return (
    <div>
      <h2>This is Component One</h2>
    </div>
  );
}

function App() {
  const [count, setCount] = useState(0);

  function increase() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Hello React</h1>

      <ComponentOne />
      <Form />

      <h2>Count: {count}</h2>
      <button onClick={increase}>Increase</button>
    </div>
  );
}

export default App;

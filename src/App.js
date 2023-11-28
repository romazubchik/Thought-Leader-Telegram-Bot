import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/uservotes"); // Зверніть увагу на адресу сервера
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
          console.log(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const intervalId = setInterval(fetchData, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  let usersCount = users.length;
  let step = 1.7 / usersCount;
  console.log(step);
  let trueUsers = 0;

  users.map((user) => {
    if (user.subscribed === true) {
      trueUsers++;
    }
  });

  return (
    <div className="App">
      <header className="App-header">
        <p>
          <b>{(trueUsers * step).toFixed(2)}</b>
        </p>
      </header>
    </div>
  );
}

export default App;

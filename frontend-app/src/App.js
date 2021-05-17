import './App.css';
import React from 'react';
import { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState(null);
  const [text, setText] = useState("");
  var controller = new AbortController();
  var signal = controller.signal;

  useEffect(() => {
    fetch('http://edwardramirez.pythonanywhere.com/', {
      signal
    })
      .then(response => {
        console.log(response);
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("HTTP ERROR: " + response.status);
        }
      })
      .then(data => {
        setTasks(data);
        console.log(data);
      })
      .catch(err => {
        if (err.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.log(err);
        }
      });
    
    return () => {
      controller.abort();
    }
  }, []);

  const submitTask = (e) => {
    e.preventDefault();
    const newTask = { text }
    console.log(newTask);
    setText("");
    fetch('http://edwardramirez.pythonanywhere.com/', {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(newTask)
    })
      .then(response => {
        console.log(response);
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("HTTP ERROR: " + response.status);
        }
      })
      .then(data => {
        console.log(data);
        tasks.push(data);
        setTasks([...tasks])
      })
      .catch(err => {
        if (err.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.log(err);
        }
      });
  }

  return (
    <div className="container">
      <div id="task-container">
        <div id="form-wrapper">
          <form id="form" onSubmit={submitTask}>
            <div className="flex-wrapper">
              <div style={{ flex: 6 }} >
                <input type="text" className="form-control" id="text" placeholder="Add a task" value={text} onChange={(e) => setText(e.target.value)}/>
              </div>
              <div style={{flex: 1 }}>
                <input type="submit" id="submit" className="btn btn-warning" value="Submit"/>
              </div>
            </div>
          </form>
        </div>
        <div id="list-wrapper">
          {tasks && tasks.map((task) => (
            <div className="task-wrapper flex-wrapper" key={task.id}>
              <div style={{flex: 7}}>
                <span>{task.text }</span>
              </div>
              <div style={{flex: 1}}>
                <button className="btn btn-sm btn-outline-info">Edit</button>
              </div>
              <div style={{flex: 1}}>
                <button className="btn btn-sm btn-outline-dark delete">-</button>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

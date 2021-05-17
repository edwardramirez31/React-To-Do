import './App.css';
import React from 'react';
import { useState, useEffect } from 'react';

function App() {
  const [tasks, setTasks] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [editing, setEditing] = useState(false);
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
    setText("");

    if (editing) {
      fetch(`http://edwardramirez.pythonanywhere.com/task/${activeItem.id}/`, {
        method: 'PUT',
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
          setTasks(tasks.map((task) => task === activeItem ? data : task));
        })
        .catch(err => console.log(err));
      setEditing(false);
    } else {
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
            console.log(err);
        });
    };
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter(task => task.id !== id));

    fetch(`http://edwardramirez.pythonanywhere.com/task/${id}/`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}
      })
        .then(response => response.ok ? response.text() : console.log('error:' + response.status))
        .then(data => {
          console.log(data);
        })
        .catch(err => console.log(err));
  };
  
  const handleEdit = (task) => {
    setText(task.text);
    setEditing(true);
    setActiveItem(task)
  };

  const handleComplete = (task) => {
    task.completed = !task.completed;
    console.log({completed: task.completed})
    setTasks(tasks.map(item => item.id === task.id ? task : item));
     fetch(`http://edwardramirez.pythonanywhere.com/task/${task.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({"completed": task.completed, "text": task.text})
      })
        .then(response => {
          console.log(response);
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("HTTP ERROR: " + response.status);
          }
        })
        .then(data => console.log(data))
        .catch(err => console.log(err));
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
        <div id="list-wrapper" className="d-flex flex-column-reverse">
          {tasks && tasks.map((task) => (
            <div className="task-wrapper flex-wrapper" key={task.id} >
              <div style={{ flex: 7, textDecorationLine: task.completed ?'line-through': 'none' }} onClick={() => handleComplete(task)}>
                <span>{task.text }</span>
              </div>
              <div style={{flex: 1}}>
                <button className="btn btn-sm btn-outline-info" onClick={() => handleEdit(task)}>Edit</button>
              </div>
              <div style={{flex: 1}}>
                <button className="btn btn-sm btn-outline-dark delete" onClick={() => handleDelete(task.id)}>-</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    const getData = async () => {
      const res = await fetch("http://localhost:3001/test");
      const data = await res.json();
      setTodos(data);
    };
    getData();
  }, []);

  function addTodos(obj) {
    setTodos([...todos, obj]);
  }

  return (
    <>
      <h1>This is the react mvp</h1>
      <ShowTodos todos={todos} addTodos={addTodos} />
      <CreateNewTodo addTodos={addTodos} />
    </>
  );
}

function ShowTodos(props) {
  return props.todos.map((element) => {
    return (
      <DisplayTodoItem
        key={element.id}
        element={element}
        addTodos={props.addTodos}
      />
    );
  });
}
function DisplayTodoItem({ element, addTodos }) {
  const [edit, setEdit] = useState(false);
  const handleGetOne = async (e) => {
    const response = await fetch(`http://localhost:3001/test/${e.target.id}`);
    const data = await response.json();
    console.log(`I want to edit id: ${e.target.id}`);
    console.log(data[0]);
    setEdit(!edit);
  };
  const handleEditOne = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:3001/test/${e.target.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        name: `${e.target[0].value}`,
        description: `${e.target[1].value}`,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    addTodos(data);
    setEdit(!edit);
  };
  const handleDelete = async (e) => {
    const response = await fetch(`http://localhost:3001/test/${e.target.id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    console.log(`I am deleting id: ${e.target.id}`);
    console.log(data[0]);
  };
  if (!edit) {
    return (
      <div>
        <h2>
          {element.id} {element.name}
        </h2>
        <p>{element.description}</p>
        <button id={element.id} onClick={handleGetOne}>
          Edit
        </button>
        <button id={element.id} onClick={handleDelete}>
          Delete
        </button>
      </div>
    );
  } else {
    return (
      <form id={element.id} onSubmit={handleEditOne}>
        <input
          type="text"
          placeholder={element.name}
          defaultValue={element.name}
        ></input>
        <input
          type="text"
          placeholder={element.description}
          defaultValue={element.description}
        ></input>
        <button id={element.id}>Submit</button>
        <button id={element.id} onClick={handleDelete}>
          Delete
        </button>
      </form>
    );
  }
}
function CreateNewTodo(props) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const obj = {
      name: e.target[0].value,
      description: e.target[1].value,
    };
    const sendTodosToAPI = async () => {
      const response = await fetch("http://localhost:3001/test", {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      //sends first and only row from sql query to setTodo state
      props.addTodos(data[0]);
    };

    sendTodosToAPI();
  };
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder={"Put new todo"} />
      <textarea placeholder="Description" />
      <input type="date" />
      <button type="submit">Create</button>
    </form>
  );
}

export default App;

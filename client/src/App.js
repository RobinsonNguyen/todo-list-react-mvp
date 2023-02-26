import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [todos, setTodos] = useState({});
  useEffect(() => {
    const getData = async () => {
      const res = await fetch("http://localhost:3001/test");
      const data = await res.json();
      data.map((element) => {
        const obj = {};
        obj[element.id] = {
          name: element.name,
          description: element.description,
        };
        addTodos(obj);
      });
    };
    getData();
  }, []);

  function addTodos(obj) {
    setTodos((prevState) => {
      return { ...prevState, ...obj };
    });
  }

  function removeTodos(id) {
    const temp = { ...todos };
    delete temp[id];
    setTodos(temp);
  }

  return (
    <>
      <h1>This is the react mvp</h1>
      <ShowTodos todos={todos} addTodos={addTodos} removeTodos={removeTodos} />
      <CreateNewTodo addTodos={addTodos} />
    </>
  );
}

function ShowTodos(props) {
  return Object.keys(props.todos).map((key, index) => {
    return (
      <DisplayTodoItem
        key={key}
        id={key}
        element={props.todos[key]}
        addTodos={props.addTodos}
        removeTodos={props.removeTodos}
      />
    );
  });
}
function DisplayTodoItem({ id, element, addTodos, removeTodos }) {
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
    console.log(`updating on id: ${e.target.id}`);
    const temp = {};
    temp[e.target.id] = {
      name: data[0].name,
      description: data[0].description,
    };
    addTodos(temp);
    setEdit(!edit);
  };
  const handleDelete = async (e) => {
    const response = await fetch(`http://localhost:3001/test/${e.target.id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    console.log(`I am deleting id: ${e.target.id}`);
    console.log(data[0]);
    removeTodos(e.target.id);
  };
  if (!edit) {
    return (
      <div>
        <h2>
          {id} {element.name}
        </h2>
        <p>{element.description}</p>
        <button id={id} onClick={handleGetOne}>
          Edit
        </button>
        <button id={id} onClick={handleDelete}>
          Delete
        </button>
      </div>
    );
  } else {
    return (
      <form id={id} onSubmit={handleEditOne}>
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
        <button id={id}>Submit</button>
        <button id={id} onClick={handleDelete}>
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
      const temp = {};
      temp[data[0].id] = {
        name: data[0].name,
        description: data[0].description,
      };
      props.addTodos(temp);
    };
    e.target.reset();
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

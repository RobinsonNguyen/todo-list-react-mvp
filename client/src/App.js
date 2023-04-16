import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

function App() {
  const [todos, setTodos] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  async function getData() {
    const res = await fetch("https://todo-list-react-mvp.onrender.com/test");
    // const res = await fetch("http://localhost:3001/test");
    const data = await res.json();
    setTodos(data);
  }
  useEffect(() => {
    getData();
  }, []);

  function addTodos(obj) {
    setTodos(obj);
  }

  function removeTodos(id) {
    getData();
  }

  const handleDateClick = (arg) => {};

  const handleDateSelect = (selectInfo) => {
    setCurrentDate(selectInfo.startStr);
  };
  return (
    <>
      <div id="background"></div>
      <div id="display">
        <div id="todo-list">
          <CreateNewTodo addTodos={addTodos} />
          <h1>Todo List! {currentDate}</h1>
          <ShowTodos
            todos={todos}
            addTodos={addTodos}
            removeTodos={removeTodos}
            currentDate={currentDate}
          />
        </div>
        <div id="calendar">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView={"dayGridMonth"}
            headerToolbar={{
              left: "prev,next",
              center: "title",
              right: "dayGridMonth,dayGridWeek,dayGridDay",
            }}
            events={todos}
            dateClick={handleDateClick}
            select={handleDateSelect}
            selectable={true}
          />
        </div>
      </div>
    </>
  );
}

//--------------------
// Iterate through todo State
//--------------------
function ShowTodos(props) {
  return props.todos.map((element) => {
    if (element.start.startsWith(props.currentDate)) {
      return (
        <DisplayTodoItem
          key={element.id}
          id={element.id}
          element={element}
          addTodos={props.addTodos}
          removeTodos={props.removeTodos}
          currentDate={props.currentDate}
        />
      );
    }
  });
}

//--------------------
// Each Todo Component
//--------------------
function DisplayTodoItem({ id, element, addTodos, removeTodos, currentDate }) {
  const [edit, setEdit] = useState(false);

  async function getData() {
    // const res = await fetch("https://todo-list-react-mvp.onrender.com/test");
    const res = await fetch("http://localhost:3001/test");
    const data = await res.json();
    addTodos(data);
  }
  const handleGetOne = async (e) => {
    // const response = await fetch(
    //   `https://todo-list-react-mvp.onrender.com/test/${e.target.id}`
    // );
    const response = await fetch(`http://localhost:3001/test/${e.target.id}`);
    const data = await response.json();
    console.log(`I want to edit id: ${e.target.id}`);
    console.log(data[0]);
    setEdit(!edit);
  };
  const handleEditOne = async (e) => {
    e.preventDefault();
    console.log(e.target[3].value);
    const date = e.target[3].value
      ? `${e.target[2].value}T${e.target[3].value}:00`
      : e.target[2].value;

    const response = await fetch(
      // `https://todo-list-react-mvp.onrender.com/test/${e.target.id}`,
      `http://localhost:3001/test/${e.target.id}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          name: `${e.target[0].value}`,
          title: `${e.target[1].value}`,
          start: date,
          modified: new Date(),
        }),
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await response.json();
    console.log(`updating on id: ${e.target.id}`);
    getData();
    setEdit(!edit);
  };
  const handleDelete = async (e) => {
    const response = await fetch(
      // `https://todo-list-react-mvp.onrender.com/test/${e.target.id}`,
      `http://localhost:3001/test/${e.target.id}`,
      {
        method: "DELETE",
      }
    );
    const data = await response.json();
    console.log(`I am deleting id: ${e.target.id}`);
    console.log(data[0]);
    removeTodos(e.target.id);
  };
  if (!edit) {
    return (
      <div>
        <h2>
          {element.name} {element.start.substring(0, 10)}
        </h2>
        <span id="event-title">
          {element.start[11] === "0"
            ? element.start.substring(12, 16)
            : element.start.substring(11, 16)}{" "}
          {element.title}
        </span>
        <button id={id} onClick={handleGetOne}>
          Modify
        </button>
        {/* <button id={id} onClick={handleGetOne}>
          Edit
        </button>
        <button id={id} onClick={handleDelete}>
          Delete
        </button> */}
      </div>
    );
  } else {
    return (
      <form className="edit-form" id={id} onSubmit={handleEditOne}>
        <h2>Edit Event</h2>
        <input
          type="text"
          placeholder={element.name}
          defaultValue={element.name}
        ></input>
        <input
          type="text"
          placeholder={element.title}
          defaultValue={element.title}
        ></input>
        <div>
          <input
            type="date"
            defaultValue={element.start.substring(0, 10)}
          ></input>
          <input
            type="time"
            defaultValue={element.start.substring(11, 16)}
          ></input>
        </div>
        <div>
          <button id={id}>Confirm</button>
          <button id={id} onClick={handleDelete}>
            Delete
          </button>
        </div>
      </form>
    );
  }
}

//--------------------
// Create One
//--------------------
function CreateNewTodo(props) {
  const [edit, setEdit] = useState(false);
  const now = new Date();
  var y = now.getFullYear();
  var m = now.getMonth() + 1;
  var d = now.getDate();
  m = m < 10 ? "0" + m : m;
  d = d < 10 ? "0" + d : d;
  const [date, setDate] = useState(`${y}-${m}-${d}`);

  async function getData() {
    // const res = await fetch("https://todo-list-react-mvp.onrender.com/test");
    const res = await fetch("http://localhost:3001/test");
    const data = await res.json();
    props.addTodos(data);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const obj = {
      name: e.target[0].value,
      title: e.target[1].value,
      start: `${e.target[2].value}T${e.target[3].value}:00`,
      modified: new Date(),
    };
    const sendTodosToAPI = async () => {
      const response = await fetch(
        // "https://todo-list-react-mvp.onrender.com/test",
        "http://localhost:3001/test",
        {
          method: "POST",
          body: JSON.stringify(obj),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      getData(data);
    };
    e.target.reset();
    sendTodosToAPI();
  };

  const changeDateState = (e) => {
    console.log(e.target.value);
    setDate(e.target.value);
  };

  const handleNewEventClick = (e) => {
    setEdit(!edit);
  };
  if (edit) {
    return (
      <form id="create-todo-form" onSubmit={handleSubmit}>
        <h2>Create New Event</h2>
        <label>Subject</label>
        <div>
          <input type="text" placeholder={"Put new todo"} />
        </div>
        <label>Event</label>
        <div>
          <textarea placeholder="Description" />
        </div>
        <div>
          <label>Start Date</label>
          <input
            type="date"
            required={true}
            onChange={changeDateState}
            defaultValue={date}
          />
          <label>Start Time</label>
          <input type="time" required={true} defaultValue="00:00" />
        </div>
        {/* <div>
          <label>End Date</label>
          <input type="date" onChange={changeDateState} defaultValue={date} />
          <label>End Time</label>
          <input type="time" defaultValue="00:00" />
        </div> */}
        <button type="submit">Create</button>
        <button onClick={handleNewEventClick}>Close</button>
      </form>
    );
  } else {
    return (
      <form id="create-todo-form">
        <div>
          <button id="new-event-button" onClick={handleNewEventClick}>
            Create New Event
          </button>
        </div>
      </form>
    );
  }
}

export default App;

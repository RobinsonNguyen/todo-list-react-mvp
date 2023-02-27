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
    const data = await res.json();
    setTodos(data);
    // data.map((element) => {
    //   const obj = {};
    //   obj[element.id] = {
    //     name: element.name,
    //     title: element.title,
    //   };
    //   addTodos(obj);
    // });
  }
  useEffect(() => {
    getData();
    console.log(todos);
  }, []);

  function addTodos(obj) {
    // setTodos((prevState) => {
    //   return { ...prevState, ...obj };
    // });
    setTodos(obj);
  }

  function removeTodos(id) {
    // const temp = { ...todos };
    // delete temp[id];
    // setTodos(temp);
    getData();
  }

  const handleDateClick = (arg) => {
    console.log(arg);
  };

  const handleDateSelect = (selectInfo) => {
    console.log(selectInfo.startStr);
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
            events={
              todos
              // [
              //   {
              //     title: "test1",
              //     start: "2023-02-26T05:00:00",
              //     end: "2023-02-27T16:30:00",
              //     editable: true,
              //   },
              //   { title: "test2", date: "2023-02-27" },
              // ]
            }
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
  // return Object.keys(props.todos).map((key, index) => {
  //   return (
  //     <DisplayTodoItem
  //       key={key}
  //       id={key}
  //       element={props.todos[key]}
  //       addTodos={props.addTodos}
  //       removeTodos={props.removeTodos}
  //     />
  //   );
  // });
}

//--------------------
// Each Todo Component
//--------------------
function DisplayTodoItem({ id, element, addTodos, removeTodos, currentDate }) {
  const [edit, setEdit] = useState(false);

  async function getData() {
    const res = await fetch("https://todo-list-react-mvp.onrender.com/test");
    const data = await res.json();
    addTodos(data);
  }
  const handleGetOne = async (e) => {
    const response = await fetch(
      `https://todo-list-react-mvp.onrender.com/test/${e.target.id}`
    );
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
      `https://todo-list-react-mvp.onrender.com/test/${e.target.id}`,
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
    // const temp = {};
    // temp[e.target.id] = {
    //   name: data[0].name,
    //   title: data[0].title,
    // };
    // addTodos(temp);
    getData();
    setEdit(!edit);
  };
  const handleDelete = async (e) => {
    const response = await fetch(
      `https://todo-list-react-mvp.onrender.com/test/${e.target.id}`,
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
    const res = await fetch("https://todo-list-react-mvp.onrender.com/test");
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
        "https://todo-list-react-mvp.onrender.com/test",
        {
          method: "POST",
          body: JSON.stringify(obj),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      //sends first and only row from sql query to setTodo state
      // const temp = {};
      // temp[data[0].id] = {
      //   name: data[0].name,
      //   title: data[0].title,
      // };
      // props.addTodos(temp);
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
        <div>
          <label>End Date</label>
          <input type="date" onChange={changeDateState} defaultValue={date} />
          <label>End Time</label>
          <input type="time" defaultValue="00:00" />
        </div>
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

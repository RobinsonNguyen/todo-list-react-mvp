import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

function App() {
  const [todos, setTodos] = useState([]);
  async function getData() {
    const res = await fetch("http://localhost:3001/test");
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

  const handleDateClick = (arg) => {};

  // calendarRef = React.createRef();
  const handleDateSelect = (selectInfo) => {
    console.log("in here");
    console.log(selectInfo);
  };
  return (
    <>
      <div id="display">
        <div id="todo-list">
          <h1>Todo List!</h1>
          <ShowTodos
            todos={todos}
            addTodos={addTodos}
            removeTodos={removeTodos}
          />
          <CreateNewTodo addTodos={addTodos} />
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
    return (
      <DisplayTodoItem
        key={element.id}
        id={element.id}
        element={element}
        addTodos={props.addTodos}
        removeTodos={props.removeTodos}
      />
    );
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
function DisplayTodoItem({ id, element, addTodos, removeTodos }) {
  const [edit, setEdit] = useState(false);

  async function getData() {
    const res = await fetch("http://localhost:3001/test");
    const data = await res.json();
    addTodos(data);
  }
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
        title: `${e.target[1].value}`,
        start: `${e.target[2].value}T${e.target[3].value}:00`,
      }),
      headers: { "Content-Type": "application/json" },
    });
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
          {id} {element.name} {element.start.substring(0, 10)}
        </h2>
        <p>
          {element.title} {element.start.substring(11, 16)}
        </p>
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
          placeholder={element.title}
          defaultValue={element.title}
        ></input>
        <input
          type="date"
          defaultValue={element.start.substring(0, 10)}
        ></input>
        <input
          type="time"
          defaultValue={element.start.substring(11, 16)}
        ></input>
        <button id={id}>Submit</button>
        <button id={id} onClick={handleDelete}>
          Delete
        </button>
      </form>
    );
  }
}

//--------------------
// Create One
//--------------------
function CreateNewTodo(props) {
  const now = new Date();
  var y = now.getFullYear();
  var m = now.getMonth() + 1;
  var d = now.getDate();
  m = m < 10 ? "0" + m : m;
  d = d < 10 ? "0" + d : d;
  const [date, setDate] = useState(`${y}-${m}-${d}`);

  async function getData() {
    const res = await fetch("http://localhost:3001/test");
    const data = await res.json();
    props.addTodos(data);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e.target[3].value);
    const obj = {
      name: e.target[0].value,
      title: e.target[1].value,
      start: `${e.target[2].value}T${e.target[3].value}:00`,
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
  return (
    <form id="create-todo-form" onSubmit={handleSubmit}>
      <input type="text" placeholder={"Put new todo"} />
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
    </form>
  );
}

export default App;

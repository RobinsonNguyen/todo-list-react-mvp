import logo from "./logo.svg";
import "./App.css";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const getData = async () => {
      const res = await fetch("http://localhost:3001/test");
      const data = await res.json();
      console.log(data);
    };
    getData();
  }, []);
  return <h1>This is the react mvp</h1>;
}

export default App;

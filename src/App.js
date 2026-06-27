import './App.css';
import Navbar from './components/Navbar';
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import Todo from "./pages/Todo";
import Auth from "./Auth";

function App() {
  return (
    <div className="App">
        <Navbar/>

        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/todo" element={<Todo />} />
        </Routes>


    </div>
  );
}

export default App;

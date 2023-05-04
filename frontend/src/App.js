import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './Pages/HomePage';
import Chatpage from './Pages/Chatpage';
import axios from 'axios';

// axios.defaults.baseURL = "";
// axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:5000/";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' Component={HomePage} />
        <Route path='/chats' Component={Chatpage} />
      </Routes>
    </div>
  );
}

export default App;

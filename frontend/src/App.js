import { Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './Pages/HomePage';
import Chatpage from './Pages/Chatpage';
import axios from 'axios';

axios.defaults.baseURL = "https://talktome-server.vercel.app/";
// axios.defaults.withCredentials = true;

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

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {useContext, React, useState} from 'react';
// import React from 'react';
import NavBar from './components/NavBar';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import MyEventsPage from './pages/myEvents';
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <>
      <Router>
        <div>
          <NavBar setLoggedIn={setLoggedIn}/>
        </div>
        <Routes>
          <Route exact path={`/`} element={<div>Home Page</div>}></Route>
          <Route exact path={`/login`} element={<LoginPage setLoggedIn={setLoggedIn}/>}></Route>
          <Route exact path={`/register`} element={<RegisterPage/>}></Route>
          <Route exact path={`/myEvents`} element={<MyEventsPage/>}></Route>
        </Routes>
      </Router>
    </>
  )
}
export default App;
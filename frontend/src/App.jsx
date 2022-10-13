import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {useContext, React, useState} from 'react';
// import React from 'react';
import NavBar from './components/NavBar';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import HostEventsPage from './pages/hostEvents';
import CreateEventsForm from './components/createEventsForm'
import PublicLanding from './pages/publicLanding';
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <>
      <Router>
        <div>
          <NavBar setLoggedIn={setLoggedIn}/>
        </div>
        <Routes>
          <Route exact path={`/`} element={<PublicLanding/>}></Route>
          <Route exact path={`/login`} element={<LoginPage setLoggedIn={setLoggedIn}/>}></Route>
          <Route exact path={`/register`} element={<RegisterPage/>}></Route>
          <Route exact path={`/events/host`} element={<HostEventsPage/>}></Route>
          <Route exact path={`/event/create`} element={<CreateEventsForm/>}></Route>
        </Routes>
      </Router>
    </>
  )
}
export default App;
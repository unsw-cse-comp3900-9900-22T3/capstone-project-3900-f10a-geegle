import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {useContext, React, useState} from 'react';
// import React from 'react';
import NavBar from './components/NavBar';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import HostEventsPage from './pages/hostEvents';
import CreateEventsForm from './components/createEventsForm'
import MyAccount from './pages/myAccount';
import PublicLanding from './pages/publicLanding';
import ViewEvent from './pages/viewEvent';
import MyEvents from './pages/myEvents';
import HostProfile from './components/hostProfile'
import UserViewPurchasedTix from './components/UserViewPurchasedTix';
import EventCalendar from './components/eventCalendar';
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
          <Route exact path={`/event/view/:eventId`} element={<ViewEvent/>}></Route>
          <Route exact path={`/events/myEvent`} element={<MyEvents/>}></Route>
          <Route exact path={`/user/profile`} element={<MyAccount/>}></Route>
          <Route exact path={`/host/:hostId/profile`} element={<HostProfile/>}></Route>
          <Route exact path={`/events/user/tickets/:eventId`} element={<UserViewPurchasedTix/>}></Route>
          <Route exact path={`/events/calendar`} element={<EventCalendar/>}></Route>
        </Routes>
      </Router>
    </>
  )
}
export default App;
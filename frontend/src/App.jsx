import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {useContext, React} from 'react';
import NavBar from './components/NavBar';
function App() {
  return (
    <>
      <Router>
        <div>
          <NavBar />
        </div>
        <Routes>
          <Route exact path={`/`} element={<div>Home Page</div>}></Route>
          <Route exact path={`/login`} element={<div>Login Page</div>}></Route>
          <Route exact path={`/register`} element={<div>Register Page</div>}></Route>
        </Routes>
      </Router>
    </>
  )
}
export default App;
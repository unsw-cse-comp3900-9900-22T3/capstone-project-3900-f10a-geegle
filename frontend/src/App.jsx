import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {useContext, React} from 'react';
import NavBar from './components/NavBar';
function App() {
  return (
    <>
      <div>
        <NavBar />
      </div>
    </>
  )
}
export default App;
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import SignIn from './components/Login';
import SignUp from './components/Signup';
import Temp from './components/tempComponent';

function App() {
  return (
    <Router>
      <Route path="/" exact component={SignIn} />
      <Route path="/dang-ki" component={SignUp} />
      <Route path="/temp" component={Temp}/>
    </Router>
  );
}

export default App;

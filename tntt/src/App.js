import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import SignIn from './Login';
import SignUp from './Signup';

function App() {
  return (
    <Router>
      <Route path="/" exact component={SignIn} />
      <Route path="/dang-ki" component={SignUp} />
    </Router>
  );
}

export default App;

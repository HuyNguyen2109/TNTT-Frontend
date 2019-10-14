import './App.css';
import { Router, Route } from "react-router-dom";
import React, { Component } from 'react';

import { createBrowserHistory } from 'history';
import { ThemeProvider } from '@material-ui/styles';
import theme from './components/Dashboard/theme';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './components/Dashboard/assets/scss/index.scss';
import Routes from './components/Dashboard/Routes';

import SignIn from './components/Login';
import SignUp from './components/Signup';

const browserHistory = createBrowserHistory();

export default class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Router history={browserHistory}>
          <Route path="/" exact component={SignIn} />
          <Route path="/dang-ki" component={SignUp} />
          <Routes />
        </Router>
      </ThemeProvider>
    );
  }
}

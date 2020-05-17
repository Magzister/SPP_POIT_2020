import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Switch } from 'react-router-dom';
import {Helmet} from 'react-helmet';
import Home from './components/Home/Home';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import Navbar from './components/Global/Navbar/Navbar';
import { AuthContext } from './context';
import './App.css';
import openSocket from 'socket.io-client';

export const socket = openSocket('ws://localhost:8080', {transports: ['websocket']});

class App extends Component {


  constructor(props) {
    super(props);

    const jwt = localStorage.getItem('jwt');


    this.state = {
      isAuthorised: !!jwt,
      jwt
    };
  }

  componentWillUnmount(){
    socket.close();
  }

  setAuthorised = (isAuthorised, jwt) => {
    this.setState({
      isAuthorised,
      jwt
    });
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Helmet>
            <style>{'body { background-color: #dfe6e9; }'}</style>
          </Helmet>
          <AuthContext.Provider value={{ jwt: this.state.jwt, isAuthorised: this.state.isAuthorised, setAuthorised: this.setAuthorised, setJWT:  this.setJwt}}>
            <Navbar></Navbar>
            <Switch>
              <Route exact path="/" render={props => <Home {...props}></Home>} />
              <Route path="/sign-in" render={props => <SignIn {...props}></SignIn>} />
              <Route path="/sign-up" render={props => <SignUp {...props}></SignUp>} />
            </Switch>
          </AuthContext.Provider>
        </div>
      </Router>
    );
  }
}

export default App;

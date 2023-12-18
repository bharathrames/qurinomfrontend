
import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import "./App.css"



const App = () => {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/" exact component={Register} />
          <Route path="/login" exact component={Login} />
          <Route path="/dashboard"  exact component={Dashboard} /> 
        </Switch>
      </div>
    </Router>
  );
};

export default App;

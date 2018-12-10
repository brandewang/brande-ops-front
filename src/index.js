import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Dashboard from './Dashboard'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'


ReactDOM.render(
    <Router>
        <Switch>
            <Route exact path='/login' render={() => (<div>Home</div>)}/>
            <Route path='/' component={Dashboard}/>
        </Switch>
    </Router>
, document.getElementById('root'));


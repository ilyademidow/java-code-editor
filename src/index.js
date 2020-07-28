import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Terms from './Terms';
import Notfound from './Notfound';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from "react-router-dom";
import * as serviceWorker from './serviceWorker';

const routing = (
    <Router>
        <Switch>
            <Route exact path="/" component={App} />
            <Route exact path="/terms_and_conditions" component={Terms} />
            <Route component={Notfound} />
        </Switch>
    </Router>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

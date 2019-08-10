import React from 'react';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Link, Redirect} from "react-router-dom";
import {ListComponent} from "./pages/list/list";
import {DetailComponent} from "./pages/details/details";

const App: React.FC = () => {
    return (
        <div className="App">
            <Router>
                <Route path="/" exact={true} render={props => (<Redirect to="/items"/>)}/>
                <Route path="/items" exact={true} component={ListComponent}/>
                <Route path="/items/:id" exact={true} component={DetailComponent}/>
            </Router>
        </div>
    );
}

export default App;

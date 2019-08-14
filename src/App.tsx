import React from 'react';
import './../node_modules/purecss/build/pure.css';
import './../node_modules/purecss/build/grids-responsive.css';
import './App.css';
import {BrowserRouter as Router, Route, Redirect} from "react-router-dom";
import {ListComponent} from "./pages/list/list";
import {DetailComponent} from "./pages/detail/detail";

const App: React.FC = () => {
    return (
        <div className="App">
            <Router>
                <Route path="/" exact={true} render={props => (<Redirect to="/items"/>)}/>
                <Route path="/items" exact={true} render={routeProps =>
                    (
                        <ListComponent {...routeProps}/>
                    )
                }/>
                <Route path="/items/:id" exact={true} render={routeProps =>
                    (
                        <DetailComponent {...routeProps}/>
                    )
                }/>
            </Router>
        </div>
    );
};

export default App;

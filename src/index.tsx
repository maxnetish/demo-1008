import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {applyMiddleware, combineReducers, createStore} from "redux";
import {listReduser} from "./pages/list/list-reducer";
import {default as thunkMiddleware} from 'redux-thunk'
import {Provider} from "react-redux";
import {taskReduser} from "./pages/detail/detail-reducer";

const reducer = combineReducers({
    taskList: listReduser,
    task: taskReduser,
});

const store = createStore(reducer, applyMiddleware(thunkMiddleware));

ReactDOM.render((
    <Provider store={store}>
        <App/>
    </Provider>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

import React from 'react';
import { NavLink as Link, Route, Switch } from 'react-router-dom'
import Todo from './Todo'
import Post from './Post'

export default function App() {
    return (
        <div className='ui-app'>
            <header>
                <Link to={"/todo"}>Todo</Link>
                <Link to={"/post"}>Post</Link>
            </header>
            <Switch>
                <Route
                    path="/todo"
                    exact
                    component={Todo}
                />
                <Route
                    path="/post"
                    exact
                    component={Post}
                />
            </Switch>
        </div>
    );
}
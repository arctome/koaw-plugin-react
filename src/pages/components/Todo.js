import React from 'react';

export async function fetchDataOnEdge(url) {
    let response = await fetch('https://jsonplaceholder.typicode.com/posts/1')
    response = await response.json();
    return response;
}

export default function Todo(props) {
    return (
        <div className="todo">{JSON.stringify(props.serverProps)}</div>
    )
}
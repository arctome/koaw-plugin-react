import React from 'react';

export async function fetchDataOnEdge(url) {
    let response = await fetch('https://jsonplaceholder.typicode.com/todos/1')
    response = await response.json();
    return {
        props: response
    };
}

export default function Todo() {
    return (
        <div className="todo">A todo</div>
    )
}
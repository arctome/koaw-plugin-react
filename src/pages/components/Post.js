import React, { useEffect } from 'react';

export async function fetchDataOnEdge(url) {
    let response = await fetch('https://jsonplaceholder.typicode.com/todos/1')
    response = await response.json();
    return response;
}

export default function Post({ serverProps }) {
    return (
        <div className="post">{serverProps.title}</div>
    )
}
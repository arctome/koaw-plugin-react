import React, { useState } from 'react';

export async function fetchDataOnEdge(url) {
    let response = await fetch('https://jsonplaceholder.typicode.com/posts/1')
    response = await response.json();
    return response;
}

export default function Post(props) {
    let data = {}
    if (props.staticContext) {
        data = {
            isLoading: false,
            title: props.staticContext.title,
            description: props.staticContext.body,
        }
    } else if (window.__INITIAL_DATA__ ) {
        data = {
            isLoading: false,
            title: window.__INITIAL_DATA__ .title,
            description: window.__INITIAL_DATA__ .body,
        }
    } else {
        data = {
            isLoading: true,
            title: '',
            description: '',
        }
    }
    return (
        <div className="post">{data.title}</div>
    )
}
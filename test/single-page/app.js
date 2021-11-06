import React, { useState } from 'react';

export async function fetchDataOnEdge() {
  let response = await fetch('https://jsonplaceholder.typicode.com/posts/1')
  response = await response.json();
  return response;
}

export default function App(props) {
  const [loading, setLoading] = useState(false);
  return (
    <div className='ui-app'>
      <h1>{props.serverProps.title}</h1>
      <p style={{backgroundColor: loading ? "#000" : "#fff"}} onClick={() => {
        setLoading(true)
        setTimeout(() => {
          setLoading(false)
        }, 1000)
      }}>{props.serverProps.body}</p>
    </div>
  );
}
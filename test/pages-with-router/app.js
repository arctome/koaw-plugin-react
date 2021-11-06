import React from 'react';
import { NavLink as Link, Route, Routes } from 'react-router-dom'
import routes from './routes';

export default function App({ serverProps }) {
  const data = __isBrowser__ ? window.__INITIAL_DATA__ : serverProps
  
  return (
    <div className='ui-app'>
      <h1>{data.title}</h1>
      <header>
        <Link to={"/todo"}>Todo</Link>
        <Link to={"/post"}>Post</Link>
      </header>
      <Routes>
        {
          routes.forEach(r => {
            let C = r.component.default;
            return (<Route
              path={r.path}
              key={r.path}
              element={<C serverProps={data} />}
            />)
          })
        }
      </Routes>
    </div>
  );
}
import { Routes, Route } from 'react-router-dom'
import routes from './routes'

function App(props) {
  return (
    <Routes>
      {
        routes.map(route => {
          const Element = route.component.default;
          return (
            <Route path={route.path} element={<Element edgeData={props.rootProps} />} />
          )
        })
      }
    </Routes>
  )
}

export default App

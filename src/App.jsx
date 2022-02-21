import { Routes, Route } from 'react-router-dom'
import routes from './routes'
import { StoreProvider } from '../preset/globalProvider.jsx'

function App(props) {
  return (
    <StoreProvider>
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
    </StoreProvider>
  )
}

export default App

import { StaticRouter } from 'react-router-dom/server'
import { StoreProvider } from './globalProvider.jsx'

export default function RenderToStringWrapper(props) {
    const App = props.app;
    return (
        <StoreProvider store={props.store}>
            <StaticRouter location={props.location}>
                <App />
            </StaticRouter>
        </StoreProvider>
    )
}
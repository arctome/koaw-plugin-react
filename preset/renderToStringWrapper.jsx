import React from "react"
import { StaticRouter } from 'react-router-dom/server'
import { StoreProvider } from './globalProvider.jsx'
import App from '../src/App.jsx'

export default function RenderToStringWrapper(props) {
    return (
        <StoreProvider store={props.store}>
            <StaticRouter location={props.location}>
                <App />
            </StaticRouter>
        </StoreProvider>
    )
}
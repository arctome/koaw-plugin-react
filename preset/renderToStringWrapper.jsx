import { StaticRouter } from 'react-router-dom/server'

export default function RenderToStringWrapper(props) {
    const App = props.app;
    return (
        <StaticRouter location={props.location}>
            <App rootProps={props.root} />
        </StaticRouter>
    )
}
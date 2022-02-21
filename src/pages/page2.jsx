import { useEffect } from "react";
import { useStore } from "../../preset/globalProvider.jsx"

export async function getDataOnEdge(url) {
    let json = await fetch('http://jsonplaceholder.typicode.com/todos/2').then(response => response.json())
    return JSON.stringify(json);
}

export default function Page2(props) {
    const [state, dispatch] = useStore();
    useEffect(() => {
        console.log(state)
    }, [])

    return (
        <div>
            <h3>This is page 2</h3>
            <p>Page props below:</p>
            <pre>
                {JSON.stringify(props, null, 2)}
            </pre>
        </div>
    )
}
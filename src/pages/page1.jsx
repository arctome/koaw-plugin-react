export async function getDataOnEdge(url) {
    let json = await fetch('http://jsonplaceholder.typicode.com/todos/1').then(response => response.json())
    return JSON.stringify(json);
}

export default function Page1(props) {
    return (
        <div>
            <h3>This is page 1</h3>
            <p>Page props below:</p>
            <pre>
                { JSON.stringify(props, null, 2) }
            </pre>
        </div>
    )
}
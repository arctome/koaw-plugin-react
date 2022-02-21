import { createContext, useReducer, useContext } from 'react'

const globalState = {
    edgeData: null
}

function reducer(state, action) { }

const Context = createContext();

function useStore() {
    return useContext(Context)
}

function StoreProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, globalState);

    return (
        <Context.Provider value={[state, dispatch]}>
            {children}
        </Context.Provider>
    )
}

export { useStore, StoreProvider }
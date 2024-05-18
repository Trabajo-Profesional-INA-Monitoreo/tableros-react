import React, { useState } from 'react'

const Context = React.createContext({})

export function UserContext({ children }) {

    const [userInfo, setUserInfo] = useState({
        token: null,
        idToken: null,
        refreshToken: null,
        userName: null,
        roles: null,
        isLoaded: false
    })

    return <Context.Provider value={{
        userInfo,
        setUserInfo
    }}>
        {children}
    </Context.Provider>
}
export default Context
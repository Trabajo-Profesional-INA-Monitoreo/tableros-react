import Context from './userContext'
import { useContext } from 'react'

export default function useUser() {
    const { userInfo, setUserInfo } = useContext(Context)

    return { userInfo, setUserInfo }
}
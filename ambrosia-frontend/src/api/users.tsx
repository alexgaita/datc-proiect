import axios from "./axios"
import { AxiosResponse } from "axios"

const responseBody = (response: AxiosResponse) => response.data

const getUsers = (): Promise<User[]> => {
    return axios
        .get(`/users`)
        .then(responseBody).catch((error) => {
            console.log(error)
            return []
        })
}

export type User = {
    id: string,
    name: string
    isAdmin: boolean
}


const useUsersQuery = () =>{

    const handleGetUsers = async () => {

        const response = await getUsers()

        

        return response.map((user) => {
            return {
                ...user,
                name: user.id,
            }
        })
    }
    return {
        handleGetUsers,
    }
}

export default useUsersQuery;
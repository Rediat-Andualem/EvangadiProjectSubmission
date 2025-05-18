import axios from 'axios'

let axiosInstance = axios.create({
    baseURL:"http://localhost:6388/api"
    
})
export {axiosInstance}
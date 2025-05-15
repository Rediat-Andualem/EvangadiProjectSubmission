import axios from 'axios'

let axiosInstance = axios.create({
    baseURL:"http://localhost:6387/api"
    
})
export {axiosInstance}
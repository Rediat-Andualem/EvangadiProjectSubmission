import axios from 'axios'

let axiosInstance = axios.create({
    baseURL:"http://localhost:6388/api"
    // baseURL:"https://projectsubmission.be.evangadisc.com/api"
    
})
export {axiosInstance}
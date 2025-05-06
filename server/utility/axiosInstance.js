const axios = require('axios');

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: `http://localhost:${process.env.PORT}/api`,
});

module.exports = {axiosInstance}

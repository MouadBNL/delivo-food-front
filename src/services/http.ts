import axios from 'axios'



const http = axios.create({
    baseURL: "https://localhost:7219/api"
})

http.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt-token')

    if(token) {
        config.headers['Authorization'] = `Bearer ${token}`
        console.log("HTTP: loaded jwt token")
    }

    return config;
})

export default http;
import axios from 'axios'


const axiosApiInstance=axios.create({
    baseURL:"https://email-system-w3fe.onrender.com/api/v1"
})

export default axiosApiInstance;
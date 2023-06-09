import axios from 'axios'


const axiosApiInstance=axios.create({
    baseURL:'http://localhost:8900/api/v1'
})

export default axiosApiInstance;
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;


const axiosInstance = axios.create({
    baseURL: apiUrl,
    withCredentials: true
});

export default axiosInstance;
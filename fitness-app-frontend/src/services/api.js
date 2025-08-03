import axios from "axios"

const API_URL = "http://localhost:8080/api"
const api = axios.create({
    baseURL:API_URL
})

api.interceptors.request.use((config) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    console.log('User ID:', userId);
    console.log('Token:', token ? 'Present' : 'Missing');
    
    if(userId){
        config.headers['X-User-ID'] = userId;
    }
    if(token){
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config
})

api.interceptors.response.use(
    (response) => {
        console.log('API Response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('API Error:', error.response?.status, error.config?.url, error.response?.data);
        return Promise.reject(error);
    }
)

export const getActivities = () => api.get("/activities")
export const addActivity = (activity) => api.post("/activities", activity)
export const getActivityDetail = (id) => api.get(`/activities/${id}`)
export const getActivityRecommendation = (id) => api.get(`/recommendations/activity/${id}`)
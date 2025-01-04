import axiosInstance from "./url.service";



export const registerUser = async (userData) => {
    try {
        
        const response = await axiosInstance.post("auth/register", userData);
        return response.data;

    } catch (error) {
        
        console.error(error.message);
        
        
    }
};


export const loginUser = async (userData) => {
    try {
        
        const response = await axiosInstance.post("auth/login", userData);

        return response.data;
        

    } catch (error) {
        
        console.error(error.message);
        
        
    }
}

export const logoutUser = async () => {
    try {
        
        const response = await axiosInstance.get("auth/logout");
        return response.data;
        

    } catch (error) {
        
        console.error(error.message);
        
        
    }
}


export const checkUserAuth = async () => {
    try {
        
        const response = await axiosInstance.get("users/check-auth");

        if (response?.data?.status === "success") {
            return { isAuthenticated: true, user: response?.data?.data };
        }else if(response.status === "error") {
            return { isAuthenticated: false };
        }

    } catch (error) {
        console.error(error.message);
        
    }
};
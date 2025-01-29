

import axios from "axios";
import {GlobalConstants} from "../Common/GlobalConstants.js";


const axiosHttp = axios.create({
    baseURL: GlobalConstants.baseUrl,
});


axiosHttp.interceptors.request.use(
    (config) => {
        const token =  GlobalConstants.token
        return {
            ...config,
            headers: {
                ...(token !== null && { Authorization: `Bearer ${token}` }),
                ...config.headers,
            },
        };
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosHttp.interceptors.response.use(
    (response) => {
        //const url = response.config.url;

        //setLocalStorageToken(token);
        return response;
    },
    (error) => {
        if (error.response.status === 401) {
            //(`unauthorized :)`);
            //localStorage.removeItem("persist:root");
            //removeLocalStorageToken
            //window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default axiosHttp;
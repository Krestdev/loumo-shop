// lib/axios.ts
import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Add Authorization token if available
api.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    toast.error("Request setup error.");
    return Promise.reject(error);
  }
);

// Response Interceptor: Global error handling
// api.interceptors.response.use((response: AxiosResponse) => {
//   const { method, url } = response.config;
//   // const successMessageFromBackend = (response.data as any)?.message;

//   // const isMutation = ["POST", "PUT", "PATCH", "DELETE"].includes(
//   //   method?.toUpperCase() || ""
//   // );

//   // if (isMutation && url) {
//   //   const match = url.match(/\/api\/([^\/\?]+)/);
//   //   let entity = match?.[1] || "Entity";

//   //   // Capitalize and singularize
//   //   entity = entity.charAt(0).toUpperCase() + entity.slice(1).replace(/s$/, "");
//   // }
//   return response;
// });

export default api;

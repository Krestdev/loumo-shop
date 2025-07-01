import api from "@/providers/axios";
import { User } from "@/types/types";
import { toast } from "react-toastify";

export default class UserQuery {
  route = "/users";
  login = async (data: {
    email: string;
    password: string;
  }): Promise<{ user: User; token: string }> => {
    return api.post(`${this.route}/login`, data).then((response) => {
      toast.success(`Welcome back ${response.data.user.name}`);
      return response.data;
    });
  };
  verifyPassword = async (data: {
    email: string;
    password: string;
  }): Promise<{ user: User; token: string }> => {
    return api.post(`${this.route}/verifypass`, data).then((response) => {
      toast.success(`Welcome back ${response.data.user.name}`);
      return response.data;
    });
  };
  getAll = async (): Promise<User[]> => {
    return api
      .get(`${this.route}/?roleD=true&addressD=true&logD=true&notifD=true`)
      .then((response) => {
        return response.data;
      });
  };
  getOne = async (id: number): Promise<User> => {
    return api.get(`${this.route}/${id}`).then((response) => response.data);
  };
  addProductsToFavorite = async (
    id: number,
    productIds: number[]
  ): Promise<User> => {
    return api
      .patch(`${this.route}/${id}`, { productIds })
      .then((response) => response.data);
  };
  register = async (
    data: Omit<User, "id"> & {
      addressList?: number[];
    }
  ): Promise<User> => {
    return api.post(`${this.route}`, data).then((response) => response.data);
  };

  update = async (
    id: number,
    data: Partial<{ email: string; password: string; name: string }>
  ): Promise<User> => {
    return api
      .put(`${this.route}/${id}`, data)
      .then((response) => response.data);
  };

  verify = async (
    data: Partial<{ email: string; otp: string }>
  ): Promise<User> => {
    return api
      .post(`${this.route}/verify`, data)
      .then((response) => response.data);
  };

  request = async (
    data: Partial<{ email: string; otp: string }>
  ): Promise<User> => {
    return api
      .post(`${this.route}/request`, data)
      .then((response) => response.data);
  };

  verifyReset = async (
    data: Partial<{ email: string; otp: string }>
  ): Promise<User> => {
    return api
      .post(`${this.route}/verifyReset`, data)
      .then((response) => response.data);
  };

  reset = async (
    data: Partial<{ email: string; otp: string; newPassword: string }>
  ): Promise<User> => {
    return api
      .post(`${this.route}/reset`, data)
      .then((response) => response.data);
  };

  delete = async (id: number) => {
    return api.delete(`${this.route}/${id}`).then((response) => response);
  };
}

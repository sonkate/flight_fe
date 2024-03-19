import axiosClient from "./axiosClient";

const ticketApi = {
  getTrendTickets: () => {
    const url = "/api/tickets";
    return axiosClient.get(url);
  },
};

export default ticketApi;

import axios from "axios";

export const http = axios.create({
  // baseURL: "https://hotel-booking-backend-splu.onrender.com/api",
  baseURL: "http://hotelbooking.render.com.marketmajesty.net/api",
  // baseURL: "http://localhost:4001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const uploadPath =
  "http://hotelbooking.render.com.marketmajesty.net/uploads/";
// export const uploadPath = "http://localhost:4001/uploads/";

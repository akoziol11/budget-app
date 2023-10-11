// Future work: add more options and the ability to allocate
// a certain amount of the budget to each expense

import axios from "axios";
const url =
  "https://my-json-server.typicode.com/kellybuchanan/WebDev-Spring2021";
export const createOption = (label, value) => {
  return axios
    .post(`${url}/options`, {
      label,
      value
    })
    .then((response) => {
      console.log("POST response: ", response);
    })
    .catch((err) => {
      console.log("POST error: ", err);
    });
};

export const getAllOptions = () => {
  return axios
    .get(`../Services/options.json`)
    .then((response) => {
      if (Array.isArray(response.data)) {
        return response.data; // If it's already an array, return it
      } else if (typeof response.data === "object") {
        return Object.values(response.data); // Convert object values to an array
      } else {
        return []; // Return an empty array if data is neither an array nor object
      }
    })
    .catch((err) => {
      console.log("GET Error: ", err);
    });
};

// Future work: add more options and the ability to allocate
// a certain amount of the budget to each expense
import axios from "axios";
import optionsData from "./options.json"
const url =
  "https://my-json-server.typicode.com/kellybuchanan/WebDev-Spring2021";
export const createOption = async (label, value) => {
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
  if (Array.isArray(optionsData)) {
    return Promise.resolve(optionsData);
  } else if (typeof optionsData === "object") {
    return Promise.resolve(Object.values(optionsData));
  } else {
    return Promise.resolve([]);
  }
};

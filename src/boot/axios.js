import { boot } from "quasar/wrappers";
import { LocalStorage } from "quasar";
import axios from "axios";

let axiosConfig = {
  baseURL: "https://pyforecast.tunnelmole.net",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${LocalStorage.getItem("token") || ""}`,
    // "Access-Control-Allow-Origin": "*",
    // "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, PATCH, OPTIONS",
    // "Access-Control-Allow-Headers": "Content-Type, Authorization",
    // "Access-Control-Allow-Credentials": "true",
  },
  // xsrfCookieName: "access_token",
  data: {},
};

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("HTTP Error:", error);
    return Promise.reject(error);
  }
);

let ChainCallback = (promises, callback) => {
  promises
    .then((response) => {
      if (callback && typeof callback.success === "function") {
        callback.success(response);
      }
    })
    .catch((error) => {
      if (error.response && error.response.status !== 200) {
        // alert("Error: " + error.response.status);
        console.log(error.response);
      }
      if (callback && typeof callback.catch === "function") {
        callback.catch(error);
      }
    });
};

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create(axiosConfig);

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

const httpGet = (resource, callback, payload = {}) => {
  let newConfig = Object.assign({}, axiosConfig);
  newConfig.params = payload;
  // ALWAYS REBIND AUTHORIZATION HEADER TO REQUEST!
  newConfig.headers.Authorization = `Bearer ${
    LocalStorage.getItem("token") || ""
  }`;
  ChainCallback(axios.get(resource, newConfig), callback);
};

const httpPost = (resource, payload, callback) => {
  // ALWAYS REBIND AUTHORIZATION HEADER TO REQUEST!
  axiosConfig.headers.Authorization = `Bearer ${
    LocalStorage.getItem("token") || ""
  }`;
  ChainCallback(axios.post(resource, payload, axiosConfig), callback);
};

const httpPut = (resource, payload, callback) => {
  // ALWAYS REBIND AUTHORIZATION HEADER TO REQUEST!
  axiosConfig.headers.Authorization = `Bearer ${
    LocalStorage.getItem("token") || ""
  }`;
  ChainCallback(axios.put(resource, payload, axiosConfig), callback);
};

const httpDel = (resource, payload, callback) => {
  let newConfig = Object.assign({}, axiosConfig);
  newConfig.data = payload;
  // ALWAYS REBIND AUTHORIZATION HEADER TO REQUEST!
  newConfig.headers.Authorization = `Bearer ${
    LocalStorage.getItem("token") || ""
  }`;
  ChainCallback(axios.delete(resource, newConfig), callback);
};

// const httpFileUpload = (resource, payload, callback) => {
//   /** action =  Store Action what will be invoked */
//   /** payload = The file you want to upload */
//   /** callback = what happen next */
//   let fileConfig = {
//     // withCredentials: true,
//     baseURL: axiosConfig.baseURL,
//     // xsrfCookieName: "access_token",
//     // headers: {
//     //   "Content-Type": "multipart/form-data",
//     //   Authorization: `Bearer ${LocalStorage.getItem("Bearer") || ""}`,
//     // },
//   };

//   ChainCallback(axios.post(resource, payload, fileConfig), callback);
// };

// const httpFileDownload = (resource, payload, callback) => {
//   let fileConfig = {
//     // withCredentials: true,
//     baseURL: axiosConfig.baseURL,
//     // xsrfCookieName: "access_token",
//     // headers: {
//     //   Authorization: `Bearer ${LocalStorage.getItem("Bearer") || ""}`,
//     // },
//     responseType: "arraybuffer",
//   };

//   let newConfig = Object.assign({}, fileConfig);
//   newConfig.params = payload;

//   ChainCallback(axios.get(resource, newConfig), callback);
// };

export {
  api,
  httpGet,
  httpPost,
  httpPut,
  httpDel,
  // httpFileUpload,
  // httpFileDownload,
};

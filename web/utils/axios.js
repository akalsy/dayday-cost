import axios from "axios";
import { Toast } from "zarm";

const MODE = import.meta.MODE;

// axios.defaults.baseURL =
//   MODE == "development" ? "http://127.0.0.1:7001" : "http://127.0.0.1:7001";

axios.defaults.withCredentials = true;
axios.defaults.headers["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.headers["Authorization"] = `${
  localStorage.getItem("token") || null
}`;
axios.defaults.headers.post["Content-Type"] = "application/json";

axios.interceptors.request.use(
  (config) => {
    console.log(config);
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use((res) => {
  console.log(res.data.msg)
  if (res.data.code !== 200) {
    if (res.data.msg) Toast.show(res.data.msg);

    if (res.data.code == 401) {
      window.location.href = "/login";
    }
    return Promise.reject(res.data);
  }

  return res.data;
});

export default axios;

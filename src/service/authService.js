import axios from "axios";

const url = "https://matching-dorm-tu-server.herokuapp.com/";

class AuthService {
  loginmember(username, password) {
    return axios
      .post(url+"api/user/loginmember", {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  loginowner(username, password) {
    return axios
      .post(url+"api/user/loginowner", {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username,password,type) {
    return axios.post(url+"api/user/register", {
      username,
      password,
      type
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));;
  }
}

export default new AuthService();
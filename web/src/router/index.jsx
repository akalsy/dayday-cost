import Home from "@/container/Home";
import User from "@/container/User";
import Data from "@/container/Data";
import Login from "@/container/Login";
import Detail from "@/container/Detail";
import UserInfo from "@/container/UserInfo";
import Account from "@/container/Account";
import About from "@/container/About";

const routes = [
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/user",
    component: User,
  },
  {
    path: "/data",
    component: Data,
  },
  {
    path: "/detail",
    component: Detail,
  },
  {
    path: "/userinfo",
    component: UserInfo,
  },
  {
    path: "/account",
    component: Account,
  },
  {
    path: "/about",
    component: About,
  },
  {
    path: "/",
    component: Home,
  },
];

export default routes;

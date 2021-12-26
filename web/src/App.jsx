import React, { useState, useEffect } from "react";
import { Switch, useLocation, Route } from "react-router-dom";

import routes from "./router";

import { ConfigProvider } from "zarm";
import zhCN from "zarm/lib/config-provider/locale/zh_CN";
import "zarm/dist/zarm.css";

import Navbar from "@/components/Navbar";

function App() {
  const location = useLocation();
  const { pathname } = location;
  const needNav = ["/", "/data", "/user"];
  const [showNav, setNav] = useState(true);

  useEffect(() => {
    setNav(needNav.includes(pathname));
  }, [pathname]);
  return (
    <>
      <ConfigProvider primaryColor={"#007fff"} locale={zhCN}>
        <Switch>
          {routes.map((route) => (
            <Route key={route.path} path={route.path}>
              <route.component></route.component>
            </Route>
          ))}
        </Switch>
      </ConfigProvider>
      <Navbar showNav={showNav}></Navbar>
    </>
  );
}

export default App;

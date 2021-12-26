import React, { useState, useRef, useCallback } from "react";

import s from "./style.module.less";
import { Cell, Checkbox, Input, Button, Toast } from "zarm";
import CustomIcon from "../../components/CustomIcon";
import Captcha from "react-captcha-code";

import { post } from "utils";
import { useHistory } from "react-router";

const Login = () => {
  const captchaRef = useRef();
  const [type, setType] = useState("login"); // 登录注册类型
  const [username, setUsername] = useState(""); //账号
  const [password, setPassword] = useState(""); //密码
  const [verify, setVerify] = useState(""); //验证码
  const [captcha, setCaptcha] = useState("");
  const handleCaptChange = useCallback(setCaptcha, []);
  const history = useHistory();

  const onSubmit = async () => {
    if (!username) {
      Toast.show("请输入账号");
      return;
    }
    if (!password) {
      Toast.show("请输入密码");
      return;
    }
    try {
      if (type == "login") {
        const { data, code, msg } = await post("/api/user/login", {
          username,
          password,
        });
        console.log("data", data);
        if (code == 200) {
          await localStorage.setItem("token", data.token);
          history.push("/");
        } else {
          Toast.show(msg);
        }
      } else {
        if (!verify) {
          Toast.show("请输入验证码");
          return;
        }
        if (verify != captcha) {
          Toast.show("验证码错误");
          return;
        }
        const { data } = await post("/api/user/register", {
          username,
          password,
        });
        Toast.show("注册成功");
        setType("login");
      }
    } catch (error) {
      // Toast.show("系统错误");
    }
  };
  return (
    <div className={s.auth}>
      <div className={s.header}></div>
      <div className={s.tab}>
        <span
          className={`${type == "login" ? s.active : ""}`}
          onClick={() => {
            setType("login");
          }}
        >
          登陆
        </span>
        <span
          className={`${type == "register" ? s.active : ""}`}
          onClick={() => {
            setType("register");
          }}
        >
          注册
        </span>
      </div>
      <div className={s.form}>
        <Cell icon={<CustomIcon type="icon-zhanghaoguanli"></CustomIcon>}>
          <Input
            clearable
            type="text"
            placeholder="请输入账号"
            onChange={(value) => {
              setUsername(value);
            }}
          ></Input>
        </Cell>
        <Cell icon={<CustomIcon type="icon-guanbi"></CustomIcon>}>
          <Input
            clearable
            type="text"
            placeholder="请输入密码"
            onChange={(value) => {
              setPassword(value);
            }}
          ></Input>
        </Cell>
        {type == "register" && (
          <Cell icon={<CustomIcon type="icon-yanzhengma"></CustomIcon>}>
            <Input
              clearable
              type="text"
              placeholder="请输入验证码"
              onChange={(value) => {
                setVerify(value);
              }}
            ></Input>
            <Captcha
              ref={captchaRef}
              charNum={4}
              onChange={handleCaptChange}
            ></Captcha>
          </Cell>
        )}
      </div>
      <div className={s.operation}>
        {type == "register" && (
          <div className={s.agree}>
            <Checkbox></Checkbox>
            <label className="text-line">
              阅读并同意<a href="#">呆呆手帐条款</a>
            </label>
          </div>
        )}
        <Button onClick={onSubmit} block theme="primary">
          {type == "login" ? "登录" : "注册"}
        </Button>
      </div>
    </div>
  );
};

export default Login;

import React from "react";
import Header from "../../components/Header";
import s from "./style.module.less";

const About = () => {
  return (
    <div className={s.about}>
      <Header title="关于我们"></Header>
      <div className={s.content}>
        <span>
          项目源码: <a href="">https://github.com/akalsy/dayday-cost</a>
        </span>
      </div>
    </div>
  );
};

export default About;

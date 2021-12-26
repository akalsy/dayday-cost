import React, { useState } from "react";
import PropTypes from "prop-types";
import { NavBar, TabBar } from "zarm";
import { useHistory } from "react-router";
import CustomIcon from "../CustomIcon";
import s from "./style.module.less";

const Navbar = ({ showNav }) => {
  const [activeKey, setActiveKey] = useState("/");
  const history = useHistory();

  const changeTable = (path) => {
    setActiveKey(path);
    history.push(path);
  };

  return (
    <TabBar
      visible={showNav}
      className={s.tab}
      activeKey={activeKey}
      onChange={changeTable}
    >
      <TabBar.Item
        itemKey="/"
        title="账单"
        icon={<CustomIcon type="icon-shouye"></CustomIcon>}
      />
      <TabBar.Item
        itemKey="/data"
        title="统计"
        icon={<CustomIcon type="icon-shuju"></CustomIcon>}
      />
      <TabBar.Item
        itemKey="/user"
        title="我的"
        icon={<CustomIcon type="icon-yonghutianchong"></CustomIcon>}
      />
    </TabBar>
  );
};

NavBar.PropTypes = {
  showNav: PropTypes.bool,
};

export default Navbar;

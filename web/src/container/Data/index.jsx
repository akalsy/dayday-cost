import React, { useRef, useState, useEffect } from "react";
import s from "./style.module.less";
import dayjs from "dayjs";
import { Icon, Progress } from "zarm";
import PopupDate from "../../components/PopupDate";
import { get, typeMap } from "utils";
import cx from "classnames";
import CustomIcon from "../../components/CustomIcon";
let proportionChart = null;
export default function Date() {
  const monthRef = useRef();
  const [currentMonth, setCurrentMonth] = useState(dayjs().format("YYYY-MM"));
  const [totalType, setTotalType] = useState("expense"); //类型
  const [totalExpense, setTotalExpense] = useState(0); //总支出
  const [totalIncome, setTotalIncome] = useState(0); //总收入
  const [expenseData, setExpenseData] = useState([]);
  const [incomeData, setIncomeData] = useState([]);
  const [pieType, setPieType] = useState("expense"); // 饼图的「收入」和「支出」控制

  useEffect(() => {
    getData();
    return () => {
      proportionChart.dispose();
    };
  }, [currentMonth]);

  // 绘制饼图方法
  const setPieChart = (data) => {
    if (echarts) {
      // 初始化饼图，返回实例。
      proportionChart = echarts.init(document.getElementById("proportion"));
      proportionChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        // 图例
        legend: {
          data: data.map((item) => item.type_name),
        },
        series: [
          {
            name: "支出",
            type: "pie",
            radius: "55%",
            data: data.map((item) => {
              return {
                value: item.number,
                name: item.type_name,
              };
            }),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });
    }
  };

  const getData = async () => {
    const { data } = await get(`/api/bill/statistics?date=${currentMonth}`);
    setTotalIncome(data.total_income);
    setTotalExpense(data.total_expense);
    const income_data = data.billList
      .filter((item) => item.pay_type == 2)
      .sort((a, b) => b.number - a.number);
    const expense_data = data.billList
      .filter((item) => item.pay_type == 1)
      .sort((a, b) => b.number - a.number);
    setExpenseData(expense_data);
    setIncomeData(income_data);
    // 绘制饼图
    setPieChart(pieType == "expense" ? expense_data : income_data);
  };

  const changePieType = (type) => {
    setPieType(type);
    // 重绘饼图
    setPieChart(type == "expense" ? expenseData : incomeData);
  };

  const monthShow = () => {
    monthRef.current && monthRef.current.show();
  };
  const selectMonth = (item) => {
    setCurrentMonth(item);
  };
  return (
    <div className={s.data}>
      <div className={s.total}>
        <div className={s.time} onClick={monthShow}>
          <span>{currentMonth}</span>
          <Icon className={s.date} type="date"></Icon>
        </div>
        <div className={s.title}>共支出</div>
        <div className={s.expense}>¥{totalExpense}</div>
        <div className={s.income}>共收入¥{totalIncome}</div>
      </div>
      <div className={s.structure}>
        <div className={s.head}>
          <span className={s.title}>收支构成</span>
          <div className={s.tab}>
            <span
              onClick={() => setTotalType("expense")}
              className={cx({
                [s.income]: true,
                [s.active]: totalType == "expense",
              })}
            >
              支出
            </span>
            <span
              onClick={() => setTotalType("income")}
              className={cx({
                [s.expense]: true,
                [s.active]: totalType == "income",
              })}
            >
              收入
            </span>
          </div>
        </div>
        <div className={s.content}>
          {(totalType == "expense" ? expenseData : incomeData).map((item) => {
            return (
              <div className={s.item} key={item.type_id}>
                <div className={s.left}>
                  <div className={s.type}>
                    <span
                      className={cx({
                        [s.expense]: totalType == "expense",
                        [s.income]: totalType == "income",
                      })}
                    >
                      <CustomIcon
                        type={item.type_id ? typeMap[item.type_id].icon : 1}
                      ></CustomIcon>
                    </span>
                    <span className={s.name}>{item.type_name}</span>
                  </div>

                  <div className={s.progress}>
                    ¥{Number(item.number).toFixed(2) || 0}
                  </div>
                </div>

                <div className={s.right}>
                  <div className={s.percent}>
                    <Progress
                      shape="line"
                      percent={Number(
                        (item.number /
                          Number(
                            totalType == "expense" ? totalExpense : totalIncome
                          )) *
                          100
                      ).toFixed(2)}
                      type="primary"
                    ></Progress>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className={s.proportion}>
          <div className={s.head}>
            <span className={s.title}>收支构成</span>
            <div className={s.tab}>
              <span
                onClick={() => changePieType("expense")}
                className={cx({
                  [s.expense]: true,
                  [s.active]: pieType == "expense",
                })}
              >
                支出
              </span>
              <span
                onClick={() => changePieType("income")}
                className={cx({
                  [s.income]: true,
                  [s.active]: pieType == "income",
                })}
              >
                收入
              </span>
            </div>
          </div>
          {/* 这是用于放置饼图的 DOM 节点 */}
          <div id="proportion"></div>
        </div>
      </div>
      <PopupDate ref={monthRef} mode="month" onSelect={selectMonth}></PopupDate>
    </div>
  );
}

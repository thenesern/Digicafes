// Packages and Dependencies
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
// Components
import SideBar from "../../../components/Admin/Dashboard/SideBar/SideBar";
import Widget from "../../../components/Admin/Dashboard/Widget/Widget";
// Utils
import Order from "../../../models/OrderModel";
import Product from "../../../models/ProductModel";
import User from "../../../models/UserModel";
import db from "../../../utils/db";
// Styles
import styles from "./panel.module.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: false,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Yeni Kayıt Sayısı (7 Günlük)",
    },
  },
};

const Panel = ({ users, orders, products, userList }) => {
  const date7 = new Date().toLocaleDateString("tr-TR", { weekday: "long" });
  const date6 = new Date(
    new Date().setDate(new Date().getDate() - 1)
  ).toLocaleDateString("tr-TR", { weekday: "long" });
  const date5 = new Date(
    new Date().setDate(new Date().getDate() - 2)
  ).toLocaleDateString("tr-TR", { weekday: "long" });
  const date4 = new Date(
    new Date().setDate(new Date().getDate() - 3)
  ).toLocaleDateString("tr-TR", { weekday: "long" });
  const date3 = new Date(
    new Date().setDate(new Date().getDate() - 4)
  ).toLocaleDateString("tr-TR", { weekday: "long" });
  const date2 = new Date(
    new Date().setDate(new Date().getDate() - 5)
  ).toLocaleDateString("tr-TR", { weekday: "long" });
  const date1 = new Date(
    new Date().setDate(new Date().getDate() - 6)
  ).toLocaleDateString("tr-TR", { weekday: "long" });
  const labels = [date1, date2, date3, date4, date5, date6, date7];

  const time7 = new Date().toLocaleString().split(" ")[0];
  const time6 = new Date(new Date().setDate(new Date().getDate() - 1))
    .toLocaleDateString("tr-TR")
    .split(" ")[0];
  const time5 = new Date(new Date().setDate(new Date().getDate() - 2))
    .toLocaleDateString("tr-TR")
    .split(" ")[0];
  const time4 = new Date(new Date().setDate(new Date().getDate() - 3))
    .toLocaleDateString("tr-TR")
    .split(" ")[0];
  const time3 = new Date(new Date().setDate(new Date().getDate() - 4))
    .toLocaleDateString("tr-TR")
    .split(" ")[0];
  const time2 = new Date(new Date().setDate(new Date().getDate() - 5))
    .toLocaleDateString("tr-TR")
    .split(" ")[0];
  const time1 = new Date(new Date().setDate(new Date().getDate() - 6))
    .toLocaleDateString("tr-TR")
    .split(" ")[0];

  const time7List = userList.filter(
    (user) => new Date(user.createdAt).toLocaleDateString() === time7
  );
  const time6List = userList.filter(
    (user) => new Date(user.createdAt).toLocaleDateString() === time6
  );
  const time5List = userList.filter(
    (user) => new Date(user.createdAt).toLocaleDateString() === time5
  );
  const time4List = userList.filter(
    (user) => new Date(user.createdAt).toLocaleDateString() === time4
  );
  const time3List = userList.filter(
    (user) => new Date(user.createdAt).toLocaleDateString() === time3
  );
  const time2List = userList.filter(
    (user) => new Date(user.createdAt).toLocaleDateString() === time2
  );
  const time1List = userList.filter(
    (user) => new Date(user.createdAt).toLocaleDateString() === time1
  );
  const data = {
    labels,
    datasets: [
      {
        label: "Kullanıcılar",
        data: [
          time1List.length,
          time2List.length,
          time3List.length,
          time4List.length,
          time5List.length,
          time6List.length,
          time7List.length,
        ],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  return (
    <div className={styles.container}>
      <SideBar />
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          gap: "2rem",
          flexDirection: "column",
        }}
      >
        <div className={styles.widgets}>
          <Widget type="users" users={users} />
          <Widget type="orders" orders={orders} />
          <Widget type="products" products={products} />
        </div>
        <div className={styles.chart}>
          <Line options={options} data={data} width="1000" height="500" />
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  await db.connect();
  const [users, orders, products] = await Promise.all([
    await User.find(),
    await Order.find(),
    await Product.find(),
  ]);
  await db.disconnect();

  const signedUser = JSON.parse(context.req.cookies["userInfo"]) || null;
  if (!signedUser.isAdmin) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
  return {
    props: {
      users: JSON.parse(
        JSON.stringify(users.filter((user) => user.isAdmin === false).length)
      ),
      orders: JSON.parse(JSON.stringify(orders.length)),
      products: JSON.parse(JSON.stringify(products.length)),
      userList: JSON.parse(JSON.stringify(users)),
    },
  };
}

export default Panel;

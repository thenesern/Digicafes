import React, { useState } from "react";
import UserProfile from "../../components/User/User";
import Nav from "../../components/Nav/Nav";
import { useEffect } from "react";
import axios from "axios";

const Hesap = ({ userId, userToken }) => {
  const [userOrder, setUserOrder] = useState(null);

  useEffect(() => {
    const getUserOrder = async () => {
      try {
        console.log(userId);
        console.log(userToken);
        const userOrder = await axios.post(
          "/api/order/user",
          {
            user: userId,
          },
          { headers: { authorization: `Bearer ${userToken}` } }
        );
        console.log(userOrder);
        setUserOrder(userOrder?.data?.order);
      } catch (err) {
        console.log(err);
      }
    };
    getUserOrder();
  }, []);

  return (
    <>
      <Nav />
      <div>
        <UserProfile orders={userOrder} />
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  const { userId } = context.query;
  const signedUserId = JSON.parse(context.req.cookies["userInfo"])?.id || null;
  const userToken = JSON.parse(context.req.cookies["userInfo"]).token;
  if (signedUserId !== userId) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  return {
    props: {
      userId,
      userToken,
    },
  };
}

export default Hesap;

import React, { useState } from "react";
import UserProfile from "../../components/User/User";
import Nav from "../../components/Nav/Nav";
import { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

const Hesap = () => {
  const [userToken, setUserToken] = useState(null);
  const [userOrder, setUserOrder] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const router = useRouter();
  const userId = router.query.userId;

  useEffect(() => {
    if (Cookies.get("userInfo")) {
      const user = JSON.parse(Cookies.get("userInfo"));
      setUserToken(user?.token);
    }
  }, []);

  useEffect(() => {
    const getUserOrder = async () => {
      setIsFetching(true);
      try {
        const userOrder = await axios.post(
          "/api/order/user",
          {
            user: userId,
          },
          { headers: { authorization: `Bearer ${userToken}` } }
        );
        console.log(userOrder);
        console.log(userToken);
        setUserOrder(userOrder?.data?.order);
        setIsFetching(false);
      } catch (err) {
        setIsFetching(false);
        console.log(err);
      }
    };
    getUserOrder();
  }, [userId, userToken]);

  return (
    <>
      <Nav />
      <div>
        <UserProfile orders={userOrder} isFetching={isFetching} />
      </div>
    </>
  );
};

/* export async function getServerSideProps(context) {
  const { userId } = context.query;
  const signedUserId = JSON.parse(context.req.cookies["userInfo"])?.id || null;
  const userToken = JSON.parse(context.req.cookies["userInfo"])?.toke || null;
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
} */

export default Hesap;

// Packages and Dependencies
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
// Components
import UserProfile from "../../components/User/User";
import Nav2 from "../../components/Nav2/Nav";
// Cookies
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
    <div>
      <Nav2 />
      <div>
        <UserProfile orders={userOrder} isFetching={isFetching} />
      </div>
    </div>
  );
};

export default Hesap;

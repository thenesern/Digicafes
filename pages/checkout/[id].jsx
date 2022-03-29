import { Button } from "@mui/material";
import axios from "axios";
import { HmacSHA256 } from "crypto-js";
import Cookies from "js-cookie";
import React from "react";
import Nav from "../../components/Nav/Nav";
import Product from "../../models/ProductModel";
import db from "../../utils/db";
import styles from "./checkout.module.css";

const checkout = ({ product }) => {
  let user;
  if (Cookies.get("userInfo")) {
    user = JSON.parse(Cookies.get("userInfo"));
  }
  const paymentHandler = async () => {
    try {
      await axios.post(
        "/api/order",
        { product: product._id, user: user._id },
        {
          headers: { authorization: `Bearer ${user.token}` },
        }
      );
      /*  await axios.post("/api/payments", { hello: "hi" }); */
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <Nav />
      <div className={styles.container}>
        <div className={styles.left}>
          <h1 className={styles.title}>Sepet Bilgisi</h1>
          <div className={styles.informations}>
            <div>
              <h5 className={styles.title}>Ürün Adı</h5>
              <p>{product.name}</p>
            </div>
            <div>
              <h5 className={styles.title}>Adet / Süre</h5>
              <p>{product.period}lık Hizmet</p>
            </div>
            <div>
              <h5 className={styles.title}>Fiyat</h5>
              <p>{product.price}₺</p>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.summary}>
            <h1 className={styles.title}>Özet</h1>
            <div>
              <p>Toplam Tutar: {product.price}₺</p>
            </div>
          </div>
          {user ? (
            <div className={styles.footer}>
              <Button
                className={styles.button}
                variant="contained"
                type="submit"
                onClick={paymentHandler}
                fullWidth
                style={{ backgroundColor: "#264653" }}
              >
                Siparişi Tamamla
              </Button>
            </div>
          ) : (
            <h6>Siparişi tamamlamak için lütfen giriş yapınız.</h6>
          )}
        </div>
      </div>
    </div>
  );
};

export async function getStaticPaths() {
  await db.connect();
  const products = await Product.find();
  await db.disconnect();
  return {
    paths: products.map((product) => {
      return {
        params: { id: JSON.parse(JSON.stringify(product._id)) },
      };
    }),
    fallback: false, // false or 'blocking'
  };
}
export async function getStaticProps({ params }) {
  await db.connect();
  const product = await Product.findById(params.id).lean();
  await db.disconnect();
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
    },
  };
}

export default checkout;

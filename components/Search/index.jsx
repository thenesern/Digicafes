import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./Search.module.css";
import Image from "next/image";
import Link from "next/link";
import Pagination from "@mui/material/Pagination";

const Search = ({ filter }) => {
  const [stores, setStores] = useState([]);
  const [limit, setLimit] = useState(0);
  const [page, setPage] = useState(1);
  const handleChange = () => {
    setPage(value);
  };

  useEffect(() => {
    const getStores = async () => {
      try {
        const result = await axios.get("/api/booking");
        setStores(
          result?.data?.bookings?.filter(
            (store) =>
              store?.address?.state
                ?.toLowerCase()
                .includes(filter?.toLowerCase()) ||
              store?.address?.city
                ?.toLowerCase()
                .includes(filter?.toLowerCase()) ||
              store?.address?.address
                ?.toLowerCase()
                .includes(filter?.toLowerCase()) ||
              store?.storeName?.toLowerCase().includes(filter?.toLowerCase())
          )
        );
      } catch (err) {
        console.log(err);
      }
    };
    getStores();
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.left}>a</div>
      <div className={styles.right}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            gap: "1rem",
            flexDirection: "column",
            width: "100%",
          }}
        >
          {stores?.slice(limit, limit + 10).map((store) => (
            <Link
              href={`/booking/${store?.storeLinkName}`}
              passHref
              key={store?._id}
            >
              <div className={styles.store}>
                <div
                  style={{
                    width: "16rem",
                    height: "100%",
                    position: "relative",
                  }}
                >
                  <Image
                    src={
                      store?.gallery?.galleryImage ||
                      "https://res.cloudinary.com/dlyjd3mnb/image/upload/v1657981097/uguss8i7czvs44iflxqp.png"
                    }
                    layout="fill"
                    objectFit="cover"
                    alt={store?.storeName}
                    className={styles.image}
                  />
                </div>
                <div>
                  <h1 className={styles.header}>{store?.storeName}</h1>
                  <p>{store?.address?.state}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className={styles.footer}>
          <Pagination
            count={stores.length / 10}
            color="error"
            size="large"
            page={page}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Search;

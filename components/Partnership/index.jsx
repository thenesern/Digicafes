import React from "react";
import Image from "next/image";
import PartnershipImage from "../../assets/image/partnership.png";
import styles from "./Partnership.module.css";
import Link from "next/link";

const Partnership = () => {
  return (
    <div className={styles.container}>
      <Image
        src={PartnershipImage}
        alt="partnership"
        width="300"
        height="300"
        className={styles.image}
      />
      <div>
        <h2 className={styles.header}>İşletmeler için</h2>
        <div>
          <h4 className={styles.subTitle}>
            Bizimle birlikte işinizi büyütmeye hazır mısınız?
          </h4>
          <p classnName={styles.desc}>
            <em style={{ color: "#003049", fontWeight: "500" }}>
              Daha fazla müşteriye ulaşmanıza{" "}
            </em>
            ve{" "}
            <em style={{ color: "#003049", fontWeight: "500" }}>
              rezervasyonları yönetmenize yardımcı olan
            </em>{" "}
            rezervasyon uygulamamızla tanışın.
          </p>
          <p classnName={styles.desc}>
            Hemen aramıza katılabilir ve muhteşem avantajlara sahip iş
            ortaklarımızdan biri olabilirsiniz.
          </p>
          <div className={styles.bottom}>
            <Link href="/products">
              <a target="_blank" href="/products" className={styles.startNow}>
                Hemen Başlayın
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partnership;

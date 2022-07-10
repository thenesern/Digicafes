import React from "react";
import Button from "@mui/material/Button";
import Image from "next/image";
import PartnershipImage from "../../assets/image/partnership.png";
import styles from "./Partnership.module.css";

const Partnership = () => {
  return (
    <div className={styles.container}>
      <Image
        src={PartnershipImage}
        alt="partnership"
        width="300"
        height="300"
      />
      <div>
        <h2 className={styles.header}>İşletmeler için</h2>
        <div>
          <h4 className={styles.subTitle}>
            Bizimle birlikte işinizi büyütmeye hazır mısınız?
          </h4>
          <p>
            <em style={{ color: "#003049", fontWeight: "500" }}>
              Daha fazla müşteriye ulaşmanıza{" "}
            </em>
            ve{" "}
            <em style={{ color: "#003049", fontWeight: "500" }}>
              rezervasyonları yönetmenize yardımcı olan
            </em>{" "}
            rezervasyon uygulamamızla tanışın.
          </p>
          <p>
            Hemen aramıza katılabilir ve muhteşem avantajlara sahip iş
            ortaklarımızdan biri olabilirsiniz.
          </p>
          <Button variant="outlined">Hemen Başlayın</Button>
        </div>
      </div>
    </div>
  );
};

export default Partnership;

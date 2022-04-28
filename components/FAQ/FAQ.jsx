// Packages and Dependencies
import React from "react";
import { Collapse, Text } from "@nextui-org/react";
// Styles
import styles from "./FAQ.module.css";

const FAQ = () => {
  return (
    <div className={styles.container}>
      <Collapse.Group bordered>
        <Collapse title="Dijital Menü Nedir?">
          <Text>
            Dijital Menü, geleneksel baskı menü yerine menünün internet
            üzerinden QR Kod kullanılarak müşteriye sunulmasıdır.
          </Text>
        </Collapse>
        <Collapse title="Dijital Menü Nasıl Çalışır?">
          <Text>
            Menünüz Yönetim Paneli üzerinden oluşturulur. Ardından menünüz
            sistemimiz tarafından kayıt altına alınır ve QR Kod oluşturur. QR
            kod&apos;u okutarak menüye ulaşılır.
          </Text>
        </Collapse>
        <Collapse title="Dijital Menü V1 ile V2 farkı nedir?">
          <Text>
            Dijital Menü V1 ile menünüzü oluşturabilir, QR Kod kullanarak menüye
            ulaşabilirsiniz. Bu versiyonda amaç müşterinin menüyü sadece
            görüntülemesi üzerinedir. Dijital Menü V2 ise aynı menü üzerinden
            sipariş verebilme özelliğini size sunar.
          </Text>
        </Collapse>
      </Collapse.Group>
    </div>
  );
};

export default FAQ;

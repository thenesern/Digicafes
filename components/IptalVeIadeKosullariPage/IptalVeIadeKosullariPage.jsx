import React from "react";
import styles from "./IptalVeIadeKosullariPage.module.css";

const IptalVeIadeKosullariPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>İptal ve İade Koşulları</h1>
      <section className={styles.articles}>
        <article>
          <h1>GENEL</h1>
          <p>
            Kullanmakta olduğunuz web sitesi üzerinden elektronik ortamda
            sipariş verdiğiniz takdirde, size sunulan ön bilgilendirme formunu
            ve mesafeli satış sözleşmesini kabul etmiş sayılırsınız.
          </p>
          <p>
            Alıcılar, satın aldıkları hizmetin satışı ile ilgili olarak 6502
            sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler
            Yönetmeliği (RG27.11.2014/29188) hükümleri ile yürürlükteki diğer
            yasalara tabidir.
          </p>
          <p>
            Satın alınan hizmet en geç 30 gün içerisinde alıcı tarafından
            kullanıma açılır. Kullanıma açılmaz ise alıcı sözleşmeyi iptal
            edebilir.
          </p>
          <p>
            Satın alınan hizmet alıcı tarafına eksiksiz ve problemsiz çalışır
            şekilde teslim edilir.
          </p>
          <p>
            Satın alınan hizmetin satılmasının imkansızlaşması durumunda, satıcı
            bu durumu öğrendiğinden itibaren 3 gün içinde yazılı olarak alıcıya
            bu durumu bildirmek zorundadır. 30 gün içinde de toplam bedel
            Alıcı’ya iade edilmek zorundadır.
          </p>
        </article>
        <article>
          <h1>SATIN ALINAN ÜRÜN BEDELİ ÖDENMEZ İSE</h1>
          <p>
            Alıcı, satın aldığı hizmet bedelini ödemez veya banka kayıtlarında
            iptal ederse, Satıcının hizmeti teslim yükümlülüğü sona erer.
          </p>
        </article>
        <article>
          <h1>KREDİ KARTININ YETKİSİZ KULLANIMI İLE YAPILAN ALIŞVERİŞLER</h1>
          <p>
            Hizmet teslim edildikten sonra, alıcının ödeme yaptığı kredi
            kartının yetkisiz kişiler tarafından haksız olarak kullanıldığı
            tespit edilir ise satıcı (Aes Software) sorumluluk kabul
            etmemektedir ve hizmet bedelini iade etmek zorunda değildir.
          </p>
        </article>
        <article>
          <h1>İADE KOŞULLARI</h1>
          <p>
            Rezervasyon alan işletme sahibinin digicafes.com’dan almış olduğu
            hizmeti iade etme hakkı yoktur. Rezervasyon yapan işletme müşterisi
            eğer rezervasyon yaparken ödeme yaptı ise firma sahibinin
            rezervasyon işlemini iptal etmesi durumunda 15 iş günü içerisinde
            ödediği miktarı aynen iade edilir.
          </p>
        </article>
        <article>
          <h1>TEMERRÜT HALİ VE HUKUKİ SONUÇLARI</h1>
          <p>
            ALICI, ödeme işlemlerini kredi kartı ile yaptığı durumda temerrüde
            düştüğü takdirde, kart sahibi banka ile arasındaki kredi kartı
            sözleşmesi çerçevesinde faiz ödeyeceğini ve bankaya karşı sorumlu
            olacağını kabul, beyan ve taahhüt eder. Bu durumda ilgili banka
            hukuki yollara başvurabilir; doğacak masrafları ve vekâlet ücretini
            ALICI’dan talep edebilir ve her koşulda ALICI’nın borcundan dolayı
            temerrüde düşmesi halinde, ALICI, borcun gecikmeli ifasından dolayı
            SATICI’nın uğradığı zarar ve ziyanını ödeyeceğini kabul eder.
          </p>
        </article>
        <article>
          <h1>ÖDEME VE TESLİMAT</h1>
          <p>
            Sitemiz üzerinden kredi kartlarınız ile, Her türlü kredi kartınıza
            online tek ödeme ya da online taksit imkânlarından
            yararlanabilirsiniz. Online ödemelerinizde siparişiniz sonunda kredi
            kartınızdan tutar çekim işlemi gerçekleşecektir.
          </p>
        </article>
      </section>
    </div>
  );
};

export default IptalVeIadeKosullariPage;

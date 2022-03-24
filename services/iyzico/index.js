const {
  createUserCard,
  getUserCard,
  deleteUserCard,
} = require("./methods/cards.js");
const Iyzipay = require("iyzipay");
const nanoid = require("../../utils/nanoid.js");
const Logs = require("../../utils/logs.js");

const createUserAndCards = () => {
  createUserCard({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    email: "email@email.com",
    externalId: nanoid(),
    card: {
      cardAlias: "Kartım",
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
    },
  })
    .then((result) => {
      console.log(result);
      Logs("1-cards-kullanıcı-ve-kart-oluştur", result);
    })
    .catch((err) => {
      console.log(err);
      Logs("1-cards-kullanıcı-ve-kart-oluştur-hata", err);
    });
};

// createUserAndCards();

const createCardForUser = () => {
  createUserCard({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    email: "email@email.com",
    externalId: nanoid(),
    cardUserKey: "7bWydpRYhxYPFFxFJo3qkviEJ4Y=",
    card: {
      cardAlias: "Kartım",
      cardHolderName: "John Doe",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
    },
  })
    .then((result) => {
      console.log(result);
      Logs("2-cards-bir-kullanıcıya-kart-ekle", result);
    })
    .catch((err) => {
      console.log(err);
      Logs("2-cards-bir-kullanıcıya-kart-ekle -hata", err);
    });
};
// createCardForUser();

const readCardsOfUser = () => {
  getUserCard({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    cardUserKey: "7bWydpRYhxYPFFxFJo3qkviEJ4Y=",
  })
    .then((result) => {
      console.log(result);
      Logs("3-cards-kullanıcının-kartlarını-oku", result);
    })
    .catch((err) => {
      console.log(err);
      Logs("3-cards-kullanıcının-kartlarını-oku-hata", err);
    });
};

// readCardsOfUser();

const deleteCardsOfUser = () => {
  deleteUserCard({
    locale: Iyzipay.LOCALE.TR,
    conversationId: nanoid(),
    cardUserKey: "7bWydpRYhxYPFFxFJo3qkviEJ4Y=",
    cardToken: "B2cSfQs0pEsN26OndAC+bq2WjCk=",
  })
    .then((result) => {
      console.log(result);
      Logs("4-cards-kullanıcının-kartlarını-sil", result);
    })
    .catch((err) => {
      console.log(err);
      Logs("4-cards-kullanıcının-kartlarını-sil-hata", err);
    });
};

deleteCardsOfUser();

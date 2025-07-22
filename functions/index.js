/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
admin.initializeApp();

// API anahtarlarını buraya ekle
const IYZIPAY_API_KEY = "SENIN_API_KEYIN";
const IYZIPAY_SECRET = "SENIN_SECRET_KEYIN";
const IYZIPAY_BASE_URL = "https://api.iyzipay.com"; // sandbox için: https://sandbox-api.iyzipay.com

// 1. Ödeme başlatma fonksiyonu
exports.startSubscription = functions.https.onCall(async (data, context) => {
  const { email, name, userId } = data;

  const requestBody = {
    locale: "tr",
    conversationId: userId,
    price: "78.99",
    paidPrice: "78.99",
    currency: "TRY",
    basketId: "SUBSCRIPTION_1",
    paymentGroup: "SUBSCRIPTION",
    callbackUrl: "https://seninsiten.com/api/iyzico-callback", // kendi domainine göre değiştir
    buyer: {
      id: userId,
      name: name,
      surname: "Kullanıcı",
      gsmNumber: "+905555555555",
      email: email,
      identityNumber: "11111111110",
      registrationAddress: "Adres",
      city: "İstanbul",
      country: "Turkey",
      zipCode: "34000"
    },
    shippingAddress: {
      contactName: name,
      city: "İstanbul",
      country: "Turkey",
      address: "Adres",
      zipCode: "34000"
    },
    billingAddress: {
      contactName: name,
      city: "İstanbul",
      country: "Turkey",
      address: "Adres",
      zipCode: "34000"
    },
    basketItems: [
      {
        id: "SUBSCRIPTION_1",
        name: "Aylık Üyelik",
        category1: "Abonelik",
        itemType: "VIRTUAL",
        price: "78.99"
      }
    ]
  };

  try {
    const iyzicoRes = await axios.post(
      `${IYZIPAY_BASE_URL}/payment/iyzipos/checkoutform/initialize/auth/ecom`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${Buffer.from(`${IYZIPAY_API_KEY}:${IYZIPAY_SECRET}`).toString("base64")}`
        }
      }
    );
    return { checkoutFormContent: iyzicoRes.data.checkoutFormContent, paymentPageUrl: iyzicoRes.data.paymentPageUrl };
  } catch (err) {
    throw new functions.https.HttpsError("internal", "Ödeme başlatılamadı", err.message);
  }
});

// 2. iyzico callback (webhook) fonksiyonu
exports.iyzicoCallback = functions.https.onRequest(async (req, res) => {
  // iyzico'dan gelen veriyi burada işleyip, kullanıcının aboneliğini aktif yapacaksın
  // Örneğin: Firestore'da kullanıcıya premium alanı ekle
  const { conversationId, status } = req.body;
  if (status === "success") {
    // conversationId = userId
    const premiumUntil = new Date();
    premiumUntil.setMonth(premiumUntil.getMonth() + 1); // 1 ay sonrası
    await admin.firestore().collection("userProfiles").doc(conversationId).set({
      isPremium: true,
      premiumUntil: premiumUntil.toISOString(),
    }, { merge: true });
  }
  res.status(200).send("OK");
});

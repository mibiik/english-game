import React from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getAuth } from "firebase/auth";

function SubscribeButton() {
  const user = getAuth().currentUser;

  const handleSubscribe = async () => {
    if (!user) {
      alert("Lütfen giriş yapın.");
      return;
    }
    const functions = getFunctions();
    const startSubscription = httpsCallable(functions, "startSubscription");
    const res = await startSubscription({
      email: user.email,
      name: user.displayName || "Kullanıcı",
      userId: user.uid
    });
    const data = res.data as any;
    window.open(data.paymentPageUrl, "_blank");
  };

  return (
    <button onClick={handleSubscribe} className="bg-red-600 text-white px-4 py-2 rounded">
      Abone Ol (78,99 TL/ay)
    </button>
  );
}

export default SubscribeButton; 
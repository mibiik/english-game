import React from "react";

const SHOPIER_LINK = "https://www.shopier.com/1234567/"; // Kendi Shopier linkini buraya ekle

const ShopierSubscribeButton: React.FC = () => (
  <a
    href={SHOPIER_LINK}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg transition-all duration-200"
  >
    Shopier ile Abone Ol (78,99 TL/ay)
  </a>
);

export default ShopierSubscribeButton; 
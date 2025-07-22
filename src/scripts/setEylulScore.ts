import { userService } from '../services/userService';

async function setEylulScore() {
  const userId = 'OvNqDPNVV8OSyt28j3RPcR1Tb192';
  try {
    await userService.updateUser(userId, { totalScore: 4000 });
    console.log('Eylül\'ün puanı başarıyla 4000 olarak güncellendi!');
  } catch (error) {
    console.error('Puan güncellenirken hata:', error);
  }
}

setEylulScore(); 
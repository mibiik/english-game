// WelcomePage için statik veriler - her render'da yeniden oluşturulmaması için dışarı taşındı

export const originalCategories = [
  {
    label: 'Seviyeler',
    title: 'Dört farklı seviye ile ilerleyin',
    desc: 'Foundation\'dan Upper-Intermediate\'e kadar kademeli öğrenme.',
    items: [
      { name: 'Foundation'},
      { name: 'Pre-Intermediate'},
      { name: 'Intermediate'},
      { name: 'Upper-Intermediate'}
    ]
  },
  {
    label: 'Oyun Modları',
    title: '12 farklı öğrenme yöntemi',
    desc: 'Her öğrenme stiline uygun çeşitli oyun modları.',
    items: [
      { name: 'Öğretici Mod', desc: 'Temel kelime öğrenme ve pekiştirme' },
      { name: 'Çoktan Seçmeli', desc: 'Hızlı testlerle kelime pekiştirme' },
      { name: 'Eşleştirme', desc: 'Anlam ve kelime eşleştirmeleri' },
      { name: 'Boşluk Doldurma', desc: 'Cümle içinde doğru kullanım' },
      { name: 'Kelime Formları', desc: 'Kelime türevleri ve çekimleri' },
      { name: 'Tanımdan Kelime', desc: 'Açıklamadan kelimeyi bulma' },
      { name: 'Paraphrase', desc: 'Anlamı koruyarak dönüştürme' },
      { name: 'Essay Yazma', desc: 'Yazılı anlatım ve kompozisyon' },
      { name: 'Preposition', desc: 'Edat kullanımı ve kalıplar' },
      { name: 'Kelime Kartları', desc: 'Spaced repetition ile hafıza' },
      { name: 'Kelime Yarışı', desc: 'Zamanlı kelime bilgisi yarışması' },
      { name: 'Konuşma', desc: 'Telaffuz ve akıcılık pratikleri' }
    ]
  },
  {
    label: 'Öğrenci Deneyimi',
    title: 'Odaklı pratik, ölçülebilir gelişim',
    desc: 'Günlük 10 dakikalık oturumlarla kişisel zayıf noktalarınıza odaklanın.',
    items: [
      { name: 'Adaptif Zorluk', desc: 'Seviyenize göre otomatik ayarlama' },
      { name: 'Hızlı Tekrar', desc: 'Spaced repetition algoritması' },
      { name: 'Anlık Geri Bildirim', desc: 'Her yanıttan sonra açıklama' },
      { name: 'İlerleme Takibi', desc: 'Detaylı performans raporları' }
    ]
  }
];

export const stats = [
  { number: '12+', label: 'Oyun Modu' },
  { number: '2000+', label: 'Kelime' },
  { number: '4', label: 'Seviye' },
  { number: '∞', label: 'Pratik' }
];

export const rotatingTextProps = {
  texts: ["Kelimelerde", "Cümlelerde", "Essay'lerde", "Kalıplarda"],
  mainClassName: "inline-flex items-baseline px-1 text-white/90 overflow-hidden py-0",
  staggerFrom: "last" as const,
  initial: { y: "100%" },
  animate: { y: 0 },
  exit: { y: "-120%" },
  staggerDuration: 0.025,
  splitLevelClassName: "overflow-hidden pb-0",
  transition: { type: "spring" as const, damping: 24, stiffness: 350 },
  rotationInterval: 2500
};

export const fadeUpAnimation = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } }
};

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, LayoutGroup } from 'framer-motion';
import { 
	Trophy,
	Play,
  ArrowRight, 
	ShieldCheck,
	Lock,
	BadgeCheck,
	Star,
	X
} from 'lucide-react';
import logo from './ico.png';
import LazyAuth from '../components/LazyAuth';
import DarkVeil from '../components/DarkVeil';
import RotatingText from '../components/RotatingText';
import { originalCategories, stats, rotatingTextProps, fadeUpAnimation } from '../data/welcomePageData';

const WelcomePage: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
	const [activeTab, setActiveTab] = useState(0);
	const [isFirstTabChange, setIsFirstTabChange] = useState(true);

	// Optimized tab change handler
	const handleTabChange = useCallback((newTabIndex: number) => {
		if (isFirstTabChange) {
			setIsFirstTabChange(false);
		}
		setActiveTab(newTabIndex);
	}, [isFirstTabChange]);



	// Original Professional Theme
	return (
		<div className="min-h-screen bg-neutral-950 text-neutral-200 relative">
			{/* DarkVeil Background */}
			<div style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
				<DarkVeil hueShift={0} noiseIntensity={0.02} scanlineIntensity={0.04} scanlineFrequency={5.0} warpAmount={0.02} resolutionScale={1} />
			</div>

			

			{/* Header */}
			<motion.header 
				className="sticky top-0 z-40 border-b border-white/10 backdrop-blur supports-[backdrop-filter]:bg-black/30"
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				transition={{ type: 'spring', stiffness: 300, damping: 30 }}
			>
				<div className="max-w-6xl mx-auto px-6 py-3">
					<div className="flex items-center justify-between">
        <motion.div
							className="flex items-center gap-3"
							whileHover={{ scale: 1.02 }}
						>
							<motion.img 
								src={logo} 
								alt="Wordplay" 
								className="w-14 h-14 logo-mono" 
							/>
						</motion.div>
						<div className="flex items-center gap-2">
							<motion.button
								aria-label="Giriş Yap"
								onClick={() => { setAuthMode('login'); setShowAuth(true); }}
								className="rounded-full px-4 py-2 text-sm font-medium text-neutral-200 hover:text-white hover:bg-white/5 border border-white/10 transition-colors focus-white"
								whileHover={{ scale: 1.05, y: -1 }}
								whileTap={{ scale: 0.95 }}
							>
								Giriş Yap
							</motion.button>
							<motion.button
								aria-label="Kayıt Ol"
								onClick={() => { setAuthMode('register'); setShowAuth(true); }}
								className="btn-shine rounded-full px-4 py-2 text-sm font-medium bg-white text-neutral-950 hover:bg-neutral-200 transition-colors focus-white"
								whileHover={{ scale: 1.05, y: -1 }}
								whileTap={{ scale: 0.95 }}
							>
								Kayıt Ol
							</motion.button>
                </div>
                </div>
              </div>
			</motion.header>

			{/* Hero */}
			<section className="relative px-6">
				<div className="max-w-5xl mx-auto text-center py-12 relative z-10">
					<motion.h2 variants={fadeUpAnimation} initial="hidden" animate="show" className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-5">
						<span className="flex flex-col items-center gap-1 md:inline-flex md:flex-row md:items-baseline md:gap-2">
							<span>Seviyenizdeki</span>
							<RotatingText {...rotatingTextProps} />
						</span>
						<br className="hidden md:block" />
						<span className="text-white/80"> Ustalaşın</span>
					</motion.h2>
					<motion.p variants={fadeUpAnimation} initial="hidden" animate="show" transition={{ delay: 0.06 }} className="text-base md:text-lg text-neutral-400 leading-relaxed max-w-2xl mx-auto mb-6">
						Koç Üniversitesi hazırlık listeleriyle uyumlu, oyunlarla öğrenin ve kelime haznenizi geliştirin. Hazırlığı geçmenin en eğlenceli yolu!
					</motion.p>
					
					{/* Sezon Çok Yakında Duyurusu */}
					<motion.div 
						variants={fadeUpAnimation} 
						initial="hidden" 
						animate="show" 
						transition={{ delay: 0.09 }} 
						className="mb-8"
					>
						<div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 rounded-full text-orange-300 text-sm font-medium">
							<Trophy className="w-4 h-4 text-yellow-400" />
							<span>26. Sezon Çok Yakında!</span>
						</div>
					</motion.div>
					<motion.div variants={fadeUpAnimation} initial="hidden" animate="show" transition={{ delay: 0.12 }} className="flex flex-col sm:flex-row gap-3 justify-center">
						<button onClick={() => { setAuthMode('register'); setShowAuth(true); }} className="btn-shine inline-flex items-center gap-2 rounded-2xl px-6 py-3 bg-white text-neutral-950 font-medium hover:bg-neutral-200 transition-colors focus-white">
							Ücretsiz Başla
							<ArrowRight className="w-4 h-4" />
						</button>
						<button onClick={() => { setAuthMode('login'); setShowAuth(true); }} className="inline-flex items-center gap-2 rounded-2xl px-6 py-3 border border-white/10 text-neutral-200 hover:bg-white/5 transition-colors focus-white">
							<Play className="w-4 h-4" />
							Giriş Yap
						</button>
            </motion.div>

					{/* Trust badges */}
					<div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-[13px] text-neutral-400">
						<span className="inline-flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-neutral-300" /> KVKK Uyumlu</span>
						<span className="inline-flex items-center gap-1"><Lock className="w-4 h-4 text-neutral-300" /> Güvenli Oturum</span>
						<span className="inline-flex items-center gap-1"><BadgeCheck className="w-4 h-4 text-neutral-300" /> Reklamsız</span>
					</div>
				</div>
			</section>

			{/* Stats */}
			<section className="relative bg-black/40 border-t border-b border-white/10">
				<div className="max-w-6xl mx-auto px-6 py-14 relative z-10">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
						{stats.map((s, index) => (
							<motion.div 
								key={s.label} 
								initial={{ opacity: 0, scale: 0.5 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true, amount: 0.4 }}
								transition={{ 
									delay: index * 0.1,
									type: 'spring',
									stiffness: 300,
									damping: 20
								}}
								className="text-center group"
							>
								<motion.div 
									className="text-3xl md:text-4xl font-semibold text-white mb-1"
									animate={{ 
										textShadow: [
											'0 0 0px rgba(255,255,255,0)',
											'0 0 10px rgba(255,255,255,0.3)',
											'0 0 0px rgba(255,255,255,0)'
										]
									}}
									transition={{ 
										duration: 3,
										repeat: Infinity,
										delay: index * 0.5
									}}
								>
									{s.number}
								</motion.div>
								<motion.div 
									className="text-sm text-neutral-400 tracking-wide"
								>
									{s.label}
								</motion.div>
							</motion.div>
              ))}
            </div>
          </div>
			</section>

			{/* Main Categories */}
			<section className="relative px-6">
				<div className="max-w-6xl mx-auto py-20 relative z-10">
					<motion.h3 
						className="text-3xl md:text-4xl font-bold text-white mb-12 text-center tracking-tight"
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
					>
						Platform Özellikleri
					</motion.h3>
					
					<div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
						<div className="md:col-span-4">
							<LayoutGroup>
								<nav className="flex flex-wrap md:flex-col gap-2 md:gap-3" role="tablist" aria-label="Ana kategoriler">
									{originalCategories.map((cat, i) => (
										<button
											key={cat.label}
											onClick={() => handleTabChange(i)}
											className={`${i === activeTab ? 'bg-white/15 text-white border-white/30' : 'text-neutral-300 hover:text-white hover:bg-white/8 border-white/10'} relative rounded-xl px-4 md:px-6 py-3 md:py-4 text-left border transition-all duration-200 focus-white group text-sm md:text-base flex-1 md:flex-none`}
											role="tab"
											aria-selected={i === activeTab}
										>
											<div className="text-center md:text-left">
												{cat.label}
											</div>
											{i === activeTab && (
												<motion.div 
													layoutId="tab-highlight" 
													className="absolute left-0 top-0 bottom-0 w-1 bg-white/80 rounded-r hidden md:block" 
													transition={{ type: 'spring', stiffness: 500, damping: 40 }}
												/>
											)}
											{i === activeTab && (
												<motion.div 
													layoutId="tab-highlight-mobile" 
													className="absolute left-0 right-0 bottom-0 h-1 bg-white/80 rounded-t md:hidden" 
													transition={{ type: 'spring', stiffness: 500, damping: 40 }}
												/>
											)}
										</button>
									))}
								</nav>
							</LayoutGroup>
						</div>
						
						<div className="md:col-span-8">
                <motion.div
								key={activeTab}
								initial={{ 
									opacity: 0, 
									y: 10 
								}}
								animate={{ opacity: 1, y: 0 }}
								transition={{ 
									duration: 0.3,
									ease: "easeOut"
								}}
								className="gradient-border w-full"
							>
								<div className="gb-inner p-4 md:p-8 rounded-[15px]">
									<h4 
										key={`title-${activeTab}`}
										className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight"
									>
										{originalCategories[activeTab].title}
									</h4>
									<p 
										key={`desc-${activeTab}`}
										className="text-neutral-300 mb-4 md:mb-6 leading-relaxed text-sm md:text-base"
									>
										{originalCategories[activeTab].desc}
									</p>
									<div 
										className={activeTab === 1 ? "grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4" : "grid gap-3 md:gap-4"}
									>
										{originalCategories[activeTab].items.map((item) => (
											<div
												key={item.name}
												className="flex items-start gap-2 md:gap-3 p-2 md:p-3 rounded-lg group hover:bg-white/5 transition-colors duration-200"
											>
												<div
													className="w-2 h-2 bg-white/40 rounded-full mt-2 flex-shrink-0"
												/>
												<div className="min-w-0 flex-1">
													<h5 
														className="text-white font-medium mb-1 text-sm md:text-base"
													>
														{item.name}
													</h5>
													{'desc' in item && (
													<p className="text-xs md:text-sm text-neutral-400 group-hover:text-neutral-300 leading-relaxed">
														{item.desc}
													</p>
													)}
          </div>
          </div>
										))}
									</div>
								</div>
							</motion.div>
      </div>
					</div>
				</div>
			</section>

			{/* Kullanıcı Yorumları */}
			<section className="relative bg-gradient-to-b from-neutral-900 to-neutral-800 py-20">
				<div className="max-w-6xl mx-auto px-6 relative z-10">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						className="text-center mb-16"
					>
						<h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
							Öğrencilerimiz Ne Diyor?
						</h2>
						<p className="text-neutral-400 text-lg max-w-2xl mx-auto">
							Binlerce öğrenci WordPlay ile seviyelerini geliştirdi. İşte onların başarı hikayeleri...
						</p>
					</motion.div>

					<div className="grid md:grid-cols-3 gap-8">
						{/* Mehmet B. - Endüstri Mühendisliği */}
						<motion.div
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.1 }}
							className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 hover:border-blue-400/40 transition-all duration-300 group"
						>
							<div className="flex items-center gap-3 mb-4">
								<div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
									<span className="text-white font-bold text-lg">M</span>
								</div>
								<div>
									<h4 className="text-white font-semibold">Mehmet B.</h4>
									<p className="text-blue-300 text-sm">İşletme</p>
								</div>
							</div>
							<blockquote className="text-neutral-300 leading-relaxed mb-4">
								"Kuepeyi verdim ve uygulama o kadar işe yaradı ki çok teşekkür ediyorum. Umarım çok daha iyi yerlere gelirsiniz, başarılarınızın devamını diliyorum!"
							</blockquote>
							<div className="flex items-center gap-1">
								{[...Array(5)].map((_, i) => (
									<Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
								))}
							</div>
						</motion.div>

						{/* Zeynep Ö. */}
						<motion.div
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.2 }}
							className="bg-gradient-to-br from-emerald-900/20 to-teal-900/20 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-6 hover:border-emerald-400/40 transition-all duration-300 group"
						>
							<div className="flex items-center gap-3 mb-4">
								<div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
									<span className="text-white font-bold text-lg">Z</span>
								</div>
								<div>
									<h4 className="text-white font-semibold">Zeynep Ö.</h4>
									<p className="text-emerald-300 text-sm">Psikoloji</p>
								</div>
							</div>
							<blockquote className="text-neutral-300 leading-relaxed mb-4">
								"İşe yarıyor! Pre-Intermediate seviyesindeyken Upper-Intermediate'a geçtim. Cidden harika!"
							</blockquote>
							<div className="flex items-center gap-1">
								{[...Array(5)].map((_, i) => (
									<Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
								))}
							</div>
						</motion.div>

						{/* Mert K. */}
						<motion.div
							initial={{ opacity: 0, y: 40 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.3 }}
							className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 hover:border-purple-400/40 transition-all duration-300 group"
						>
							<div className="flex items-center gap-3 mb-4">
								<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
									<span className="text-white font-bold text-lg">M</span>
								</div>
								<div>
									<h4 className="text-white font-semibold">Mert K.</h4>
									<p className="text-purple-300 text-sm">Endüstri Mühendisliği</p>
								</div>
							</div>
							<blockquote className="text-neutral-300 leading-relaxed mb-4">
								"Hazırlığı atlarken bana en çok faydası dokunan şey diyebilirim. Kelimeleri oyunlarla, eğlenceli bir şekilde öğreniyorsun, sıkılmadan tekrar yapabiliyorsun. WordPlay olmasa kesinlikle bu kadar kolay geçemezdim!"
							</blockquote>
							<div className="flex items-center gap-1">
								{[...Array(5)].map((_, i) => (
									<Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
								))}
							</div>
						</motion.div>
					</div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.4 }}
						className="text-center mt-12"
					>
						<p className="text-neutral-400 text-sm">
							💡 <span className="text-white font-medium">1,000+</span> öğrenci WordPlay ile başarıya ulaştı
						</p>
					</motion.div>
				</div>
			</section>

			{/* CTA */}
			<section className="relative bg-neutral-900">
				<div className="max-w-5xl mx-auto px-6 py-16 text-center relative z-10">
					<motion.h3 
						className="text-2xl md:text-3xl font-semibold text-white mb-4 tracking-tight"
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						whileHover={{ scale: 1.02 }}
					>
						Hemen Başlayın
					</motion.h3>
					<motion.p 
						className="text-neutral-400 mb-8 max-w-2xl mx-auto"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
					>
						Binlerce öğrenci WordPlay ile seviyesini geliştirdi. Siz de şimdi katılın.
					</motion.p>
					<motion.button 
						onClick={() => { setAuthMode('register'); setShowAuth(true); }} 
						className="btn-shine inline-flex items-center gap-2 rounded-md px-6 py-3 bg-white text-neutral-950 font-medium hover:bg-neutral-200 transition-colors"
						whileHover={{ y: -2, scale: 1.01 }} 
						whileTap={{ scale: 0.99 }}
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
					>
						Ücretsiz Hesap Oluştur
						<ArrowRight className="w-4 h-4" />
					</motion.button>
				</div>
			</section>


			{/* Footer */}
			<footer className="relative bg-neutral-950 border-t border-white/10">
				<div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
					<div className="grid md:grid-cols-4 gap-8 pb-8 border-b border-white/10">
						<div>
							<div className="flex items-center gap-3 mb-4">
								<img src={logo} alt="Wordplay" className="w-8 h-8 logo-mono" />
								<span className="text-lg font-semibold text-white">Wordplay</span>
							</div>
							<p className="text-sm text-neutral-400 leading-relaxed">
								Koç Üniversitesi hazırlık listeleriyle uyumlu, oyunlaştırılmış kelime öğrenme platformu. 
								Hazırlığı geçmenin en eğlenceli yolu.
							</p>
						</div>
						<div>
							<h5 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Kurumsal</h5>
							<ul className="space-y-3 text-sm text-neutral-400">
								<li>
									<a className="hover:text-white transition-colors duration-200 flex items-center gap-2" href="/hakkimizda">
										<span className="w-1 h-1 bg-neutral-600 rounded-full"></span>
										Hakkımızda
									</a>
								</li>
								<li>
									<a className="hover:text-white transition-colors duration-200 flex items-center gap-2" href="/iletisim">
										<span className="w-1 h-1 bg-neutral-600 rounded-full"></span>
										İletişim
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h5 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Yasal</h5>
							<ul className="space-y-3 text-sm text-neutral-400">
								<li>
									<a className="hover:text-white transition-colors duration-200 flex items-center gap-2" href="/gizlilik">
										<span className="w-1 h-1 bg-neutral-600 rounded-full"></span>
										Gizlilik Politikası
									</a>
								</li>
								<li>
									<a className="hover:text-white transition-colors duration-200 flex items-center gap-2" href="/kullanim-sartlari">
										<span className="w-1 h-1 bg-neutral-600 rounded-full"></span>
										Kullanım Şartları
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h5 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Destek</h5>
							<ul className="space-y-3 text-sm text-neutral-400">
								<li>
									<a className="hover:text-white transition-colors duration-200 flex items-center gap-2" href="/sss">
										<span className="w-1 h-1 bg-neutral-600 rounded-full"></span>
										Sık Sorulan Sorular
									</a>
								</li>
								<li>
									<a className="hover:text-white transition-colors duration-200 flex items-center gap-2" href="/destek">
										<span className="w-1 h-1 bg-neutral-600 rounded-full"></span>
										Teknik Destek
									</a>
								</li>
							</ul>
						</div>
					</div>
					<div className="flex flex-col md:flex-row items-center justify-between pt-8 text-xs text-neutral-500 border-t border-white/5">
						<div className="flex items-center gap-4 mb-4 md:mb-0">
							<span>© 2024 WordPlay. Tüm hakları saklıdır.</span>
							<span className="hidden md:inline">•</span>
							<span className="hidden md:inline">Koç Üniversitesi ile uyumlu</span>
						</div>
						<div className="flex items-center gap-4">
							<span>v1.0.0</span>
							<span className="hidden md:inline">•</span>
							<span className="hidden md:inline">Beta Sürüm</span>
						</div>
					</div>
				</div>
			</footer>

						{/* Auth Modal - Glassmorphism Design */}
      {showAuth && (
				<div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
					<motion.div 
						initial={{ opacity: 0, scale: 0.9, y: 20 }} 
						animate={{ opacity: 1, scale: 1, y: 0 }}
						transition={{ type: "spring", stiffness: 300, damping: 30 }}
						className="relative w-full max-w-sm sm:max-w-md"
					>
						{/* Glass Background */}
						<div className="absolute inset-0 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl"></div>
						
						{/* Glass Overlay */}
						<div className="absolute inset-0 bg-gradient-to-br from-white/2 to-white/5 rounded-3xl"></div>
						
						{/* Content */}
						<div className="relative p-6 sm:p-8">
							{/* Close Button */}
							<button
								onClick={() => setShowAuth(false)}
								className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-white hover:text-white hover:bg-white/10 transition-all duration-200"
							>
								<X className="w-4 h-4" />
							</button>

							{/* Header */}
							<div className="text-center mb-8">
								<h2 className="text-2xl font-bold text-white mb-2">
									{authMode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
								</h2>
								<p className="text-white/70 text-sm">
									{authMode === 'login' 
										? 'Hesabınıza giriş yapın' 
										: 'Yeni hesap oluşturun'
									}
								</p>
							</div>

        <LazyAuth
								mode={authMode}
          onClose={() => setShowAuth(false)}
								onSuccess={() => { setShowAuth(false); navigate('/home'); }}
							/>
							
							{/* Switch Mode */}
							<div className="mt-6 text-center">
								<span className="text-white/60 text-sm">
									{authMode === 'login' ? 'Hesabınız yok mu?' : 'Zaten hesabınız var mı?'}
								</span>
								<button
									onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
									className="ml-2 text-white hover:text-white/80 font-medium text-sm transition-colors duration-200"
								>
									{authMode === 'login' ? 'Kayıt ol' : 'Giriş yap'}
								</button>
      </div>
						</div>
					</motion.div>
				</div>
			)}
    </div>
  );
});

export { WelcomePage };
export default WelcomePage; 

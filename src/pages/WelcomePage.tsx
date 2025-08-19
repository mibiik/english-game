import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, LayoutGroup } from 'framer-motion';
import { 
  BookOpen, 
  Brain, 
  Users, 
	Target,
	Trophy,
	Play,
  ArrowRight, 
	CheckCircle,
	ShieldCheck,
	Lock,
	BadgeCheck,
  GraduationCap,
	Star,
	Zap,
	Cpu,
	Wifi,
	Database,
	Rocket,
	Moon,
	X
} from 'lucide-react';
import logo from './ico.png';
import { Auth } from '../components/Auth';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
	const [activeTab, setActiveTab] = useState(0);
	const [time, setTime] = useState(new Date());
	const [isSpaceMode, setIsSpaceMode] = useState(false);
	const [isFirstTabChange, setIsFirstTabChange] = useState(true);
	const [tabChangeDirection, setTabChangeDirection] = useState<'left' | 'right' | null>(null);

	// Terminal-style time update
	useEffect(() => {
		const timer = setInterval(() => setTime(new Date()), 1000);
		return () => clearInterval(timer);
	}, []);

	// Tab değişim animasyonu
	const handleTabChange = (newTabIndex: number) => {
		if (isFirstTabChange) {
			// İlk tab değişiminde özel animasyon
			setIsFirstTabChange(false);
		} else {
			// Yön belirleme
			const direction = newTabIndex > activeTab ? 'right' : 'left';
			setTabChangeDirection(direction);
			
			// 300ms sonra yön sıfırla
			setTimeout(() => setTabChangeDirection(null), 300);
		}
		
		setActiveTab(newTabIndex);
	};

	// Original theme data
	const originalCategories = [
		{
			label: 'Seviyeler',
			title: 'Dört farklı seviye ile ilerleyin',
			desc: 'Foundation\'dan Upper-Intermediate\'e kadar kademeli öğrenme.',
			items: [
				{ name: 'Foundation', desc: 'Temel kelimeler ve kalıplar' },
				{ name: 'Pre-Intermediate', desc: 'Günlük kullanım ve kısa metinler' },
				{ name: 'Intermediate', desc: 'Akıcı okuma ve yazma pratikleri' },
				{ name: 'Upper-Intermediate', desc: 'Akademik metinler ve sınav hazırlığı' }
			]
		},
		{
			label: 'Oyun Modları',
			title: '12 farklı öğrenme yöntemi',
			desc: 'Her öğrenme stiline uygun çeşitli oyun modları.',
			items: [
				{ name: 'Çoktan Seçmeli', desc: 'Hızlı testlerle kelime pekiştirme' },
				{ name: 'Eşleştirme', desc: 'Anlam ve kelime eşleştirmeleri' },
				{ name: 'Boşluk Doldurma', desc: 'Cümle içinde doğru kullanım' },
				{ name: 'Kelime Kartları', desc: 'Spaced repetition ile hafıza' },
				{ name: 'Paraphrase', desc: 'Anlamı koruyarak dönüştürme' },
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

	// Space station theme data
	const spaceStationModules = [
		{
			label: 'TRAINING LEVELS',
			title: 'Eğitim Seviye Modülleri',
			desc: 'Uzay üssünde kademeli eğitim programları ile becerilerinizi geliştirin.',
			items: [
				{ name: 'FOUNDATION MODULE', desc: 'Temel uzay dili protokolleri', status: 'ACTIVE' },
				{ name: 'PRE-INTERMEDIATE BAY', desc: 'Gelişmiş iletişim sistemleri', status: 'ACTIVE' },
				{ name: 'INTERMEDIATE DECK', desc: 'Karmaşık operasyon komutları', status: 'LOCKED' },
				{ name: 'ADVANCED COMMAND', desc: 'Uzman seviye kontrol sistemleri', status: 'LOCKED' }
			]
		},
		{
			label: 'SIMULATION MODES',
			title: 'Simülasyon Odaları',
			desc: 'Farklı senaryolar için özel tasarlanmış eğitim simülasyonları.',
			items: [
				{ name: 'MULTIPLE CHOICE SIM', desc: 'Hızlı karar verme simülasyonu', status: 'ONLINE' },
				{ name: 'MATCHING PROTOCOL', desc: 'Sistem eşleştirme protokolü', status: 'ONLINE' },
				{ name: 'COMPLETION MATRIX', desc: 'Eksik veri tamamlama matrisi', status: 'ONLINE' },
				{ name: 'MEMORY CORE', desc: 'Uzun süreli veri depolama', status: 'ACTIVE' },
				{ name: 'PARAPHRASE ENGINE', desc: 'Dil çeviri ve dönüştürme', status: 'BETA' },
				{ name: 'VOICE COMM SYSTEM', desc: 'Ses iletişim protokolü', status: 'BETA' }
			]
		},
		{
			label: 'CREW EXPERIENCE',
			title: 'Mürettebat Deneyim Sistemi',
			desc: 'Kişisel gelişim ve performans izleme sistemleri.',
			items: [
				{ name: 'ADAPTIVE AI CORE', desc: 'Öğrenme zorluğu otomatik ayarlama', status: 'ONLINE' },
				{ name: 'REPETITION ENGINE', desc: 'Spaced repetition algoritması', status: 'ACTIVE' },
				{ name: 'FEEDBACK MATRIX', desc: 'Anlık performans analizi', status: 'ACTIVE' },
				{ name: 'PROGRESS TRACKER', desc: 'Detaylı gelişim raporları', status: 'SCANNING' }
			]
		}
	];

	const stats = [
		{ number: '12+', label: 'Oyun Modu' },
		{ number: '1000+', label: 'Kelime' },
		{ number: '4', label: 'Seviye' },
		{ number: '∞', label: 'Pratik' }
	];

	const stationStats = [
		{ number: '12+', label: 'SIM MODULES', icon: <Cpu className="w-4 h-4" /> },
		{ number: '1000+', label: 'DATA ENTRIES', icon: <Database className="w-4 h-4" /> },
		{ number: '4', label: 'TRAINING LEVELS', icon: <GraduationCap className="w-4 h-4" /> },
		{ number: '∞', label: 'UPTIME', icon: <Wifi className="w-4 h-4" /> }
	];

	const fadeUp = {
		hidden: { opacity: 0, y: 16 },
		show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'ONLINE': return 'text-green-400';
			case 'ACTIVE': return 'text-cyan-400';
			case 'LOCKED': return 'text-red-400';
			case 'BETA': return 'text-yellow-400';
			case 'SCANNING': return 'text-purple-400';
			default: return 'text-gray-400';
		}
	};

	const currentCategories = isSpaceMode ? spaceStationModules : originalCategories;
	const currentStats = isSpaceMode ? stationStats : stats;

	if (isSpaceMode) {
		// Space Station Theme
  return (
			<div className="min-h-screen bg-black text-cyan-100 relative font-mono">
				{/* Space Station Background */}
				<div className="space-gradient"></div>
				<div className="space-stars"></div>
				<div className="space-nebula"></div>
				<div className="hud-grid"></div>
				<div className="scan-lines"></div>

				

				{/* Command Header */}
				<motion.header 
					className="sticky top-0 z-40 border-b-2 border-cyan-500/30 backdrop-blur bg-black/60"
					initial={{ y: -100 }}
					animate={{ y: 0 }}
					transition={{ type: 'spring', stiffness: 300, damping: 30 }}
				>
					<div className="max-w-6xl mx-auto px-6 py-3">
						<div className="flex items-center justify-between">
          <motion.div
								className="flex items-center gap-4"
								whileHover={{ scale: 1.02 }}
							>
              <motion.img
                src={logo}
									alt="WordPlay Station" 
									className="w-8 h-8 filter brightness-0 invert" 
									whileHover={{ rotate: 360, filter: 'hue-rotate(180deg)' }}
									transition={{ duration: 0.8 }}
								/>
								<div>
									<motion.h1 
										className="text-lg font-bold text-cyan-400 tracking-wider hologram-text"
										whileHover={{ letterSpacing: '0.2em' }}
									>
										WORDPLAY STATION
									</motion.h1>
									<div className="text-xs text-cyan-600">
										LANG_TRAINING_MODULE_v2.1
									</div>
            </div>
          </motion.div>

							<div className="flex items-center gap-4">
								<div className="text-xs text-cyan-400 font-mono">
									{time.toLocaleTimeString()} UTC
								</div>
								<div className="flex items-center gap-2">
									<motion.button
										onClick={() => { setAuthMode('login'); setShowAuth(true); }}
										className="rounded px-4 py-2 text-sm font-medium text-cyan-400 hover:text-cyan-300 border border-cyan-500/50 hover:border-cyan-400 transition-colors"
										whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(0,255,255,0.3)' }}
										whileTap={{ scale: 0.95 }}
									>
										ACCESS LOGIN
									</motion.button>
									<motion.button
										onClick={() => { setAuthMode('register'); setShowAuth(true); }}
										className="rounded px-4 py-2 text-sm font-medium bg-cyan-500 text-black hover:bg-cyan-400 transition-colors"
										whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(0,255,255,0.5)' }}
										whileTap={{ scale: 0.95 }}
									>
										REGISTER CREW
									</motion.button>
								</div>
							</div>
						</div>
					</div>
				</motion.header>

				{/* Mission Brief */}
				<section className="relative px-6">
					<div className="max-w-5xl mx-auto text-center py-20 relative z-10">
						<motion.div
							variants={fadeUp} 
							initial="hidden" 
							animate="show"
							className="mb-8"
						>
							<div className="text-cyan-400 text-sm font-mono mb-2 tracking-widest">
								[ MISSION BRIEFING ]
							</div>
							<h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-5">
								LANGUAGE TRAINING
								<br />
								<span className="hologram-text">SPACE STATION</span>
							</h2>
						</motion.div>
          
          <motion.p
							variants={fadeUp} 
							initial="hidden" 
							animate="show" 
							transition={{ delay: 0.06 }} 
							className="text-base md:text-lg text-cyan-200 leading-relaxed max-w-2xl mx-auto mb-10 font-mono"
						>
							{'>'} Koç Üniversitesi ELC protokolleri ile uyumlu
							<br />
							{'>'} Gelişmiş AI destekli öğrenme sistemleri
            <br />
							{'>'} Gerçek zamanlı performans analizi
          </motion.p>

          <motion.div
							variants={fadeUp} 
							initial="hidden" 
							animate="show" 
							transition={{ delay: 0.12 }} 
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
								whileHover={{ y: -2, scale: 1.01, boxShadow: '0 0 20px rgba(0,255,255,0.4)' }} 
								whileTap={{ scale: 0.99 }} 
								onClick={() => { setAuthMode('register'); setShowAuth(true); }} 
								className="inline-flex items-center gap-3 rounded px-8 py-4 bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-all uppercase tracking-wider"
							>
								<Zap className="w-5 h-5" />
								INITIATE TRAINING
              <ArrowRight className="w-5 h-5" />
            </motion.button>
						</motion.div>
					</div>
				</section>

				{/* Theme Toggle - Space Mode Bottom */}
				<section className="relative bg-black/80 border-t-2 border-cyan-500/30">
					<div className="max-w-6xl mx-auto px-6 py-12 text-center relative z-10">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
						>
							<div className="text-cyan-400 text-xs font-mono tracking-widest mb-4">
								[ SYSTEM MODE ]
							</div>
							<motion.button
								onClick={() => setIsSpaceMode(false)}
								className="inline-flex items-center gap-3 px-8 py-4 bg-cyan-500/20 border-2 border-cyan-400/50 rounded-xl text-cyan-300 hover:bg-cyan-500/30 hover:border-cyan-300 transition-all backdrop-blur-sm font-mono"
								whileHover={{ scale: 1.05, y: -2, boxShadow: '0 0 25px rgba(0,255,255,0.4)' }}
								whileTap={{ scale: 0.95 }}
							>
								<Moon className="w-5 h-5" />
								<span className="font-medium tracking-wide">SWITCH TO NORMAL MODE</span>
							</motion.button>
						</motion.div>
					</div>
				</section>

				{/* Auth Terminal */}
				{showAuth && (
					<div className="fixed inset-0 bg-black/80 backdrop-blur flex items-center justify-center z-50 p-4">
						<motion.div 
							initial={{ opacity: 0, scale: 0.9, rotateX: -10 }} 
							animate={{ opacity: 1, scale: 1, rotateX: 0 }} 
							className="terminal-window p-8 max-w-md w-full"
						>
							<div className="text-cyan-400 text-sm font-mono tracking-widest mb-4 text-center">
								[ ACCESS TERMINAL ]
							</div>
							<Auth
								mode={authMode}
								onClose={() => setShowAuth(false)}
								onSuccess={() => { setShowAuth(false); navigate('/home'); }}
							/>
						</motion.div>
					</div>
				)}
			</div>
		);
	}

	// Original Professional Theme
	return (
		<div className="min-h-screen bg-neutral-950 text-neutral-200 relative">
			{/* Space theme background */}
			<div className="space-gradient"></div>
			<div className="space-stars"></div>
			<div className="space-nebula"></div>
			<div className="absolute inset-0 bg-dots-dark"></div>
			<div className="animated-dark-gradient"></div>
			<div className="absolute inset-0 vignette-overlay pointer-events-none"></div>

			

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
								alt="WordPlay" 
								className="w-7 h-7 logo-mono" 
								whileHover={{ rotate: 5, scale: 1.1 }}
								transition={{ type: 'spring', stiffness: 400 }}
							/>
							<motion.h1 
								className="text-base md:text-lg font-semibold text-white tracking-tight"
								whileHover={{ letterSpacing: '0.1em' }}
								transition={{ duration: 0.3 }}
							>
								WordPlay
							</motion.h1>
						</motion.div>
						<div className="flex items-center gap-2">
							<motion.button
								aria-label="Giriş Yap"
								onClick={() => { setAuthMode('login'); setShowAuth(true); }}
								className="rounded-md px-4 py-2 text-sm font-medium text-neutral-200 hover:text-white hover:bg-white/5 border border-white/10 transition-colors focus-white"
								whileHover={{ scale: 1.05, y: -1 }}
								whileTap={{ scale: 0.95 }}
							>
								Giriş Yap
							</motion.button>
							<motion.button
								aria-label="Kayıt Ol"
								onClick={() => { setAuthMode('register'); setShowAuth(true); }}
								className="btn-shine rounded-md px-4 py-2 text-sm font-medium bg-white text-neutral-950 hover:bg-neutral-200 transition-colors focus-white"
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
				<div className="max-w-5xl mx-auto text-center py-20 relative z-10">
					<motion.h2 variants={fadeUp} initial="hidden" animate="show" className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-5">
						Seviyenizdeki Kelimelerde
						<br className="hidden md:block" />
						<span className="text-white/80"> Ustalaşın</span>
					</motion.h2>
					<motion.p variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.06 }} className="text-base md:text-lg text-neutral-400 leading-relaxed max-w-2xl mx-auto mb-10">
						Koç Üniversitesi ELC listeleriyle uyumlu, oyunlarla öğrenin ve kelime haznenizi geliştirin. Hazırlığı geçmenin en eğlenceli yolu!
					</motion.p>
					<motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ delay: 0.12 }} className="flex flex-col sm:flex-row gap-3 justify-center">
						<motion.button whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => { setAuthMode('register'); setShowAuth(true); }} className="btn-shine inline-flex items-center gap-2 rounded-md px-6 py-3 bg-white text-neutral-950 font-medium hover:bg-neutral-200 transition-colors focus-white">
							Ücretsiz Başla
							<ArrowRight className="w-4 h-4" />
						</motion.button>
						<motion.button whileHover={{ y: -2, scale: 1.01 }} whileTap={{ scale: 0.99 }} onClick={() => { setAuthMode('login'); setShowAuth(true); }} className="inline-flex items-center gap-2 rounded-md px-6 py-3 border border-white/10 text-neutral-200 hover:bg-white/5 transition-colors focus-white">
							<Play className="w-4 h-4" />
							Giriş Yap
						</motion.button>
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
								whileHover={{ 
									scale: 1.1, 
									y: -5,
									transition: { type: 'spring', stiffness: 400 }
								}}
								viewport={{ once: true, amount: 0.4 }}
								transition={{ 
									delay: index * 0.1,
									type: 'spring',
									stiffness: 300,
									damping: 20
								}}
								className="text-center cursor-pointer group"
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
									className="text-sm text-neutral-400 tracking-wide group-hover:text-neutral-200"
									whileHover={{ letterSpacing: '0.1em' }}
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
						whileHover={{ scale: 1.02, letterSpacing: '0.02em' }}
					>
						Platform Özellikleri
					</motion.h3>
					
					<div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
						<div className="md:col-span-4">
							<LayoutGroup>
								<nav className="flex flex-wrap md:flex-col gap-2 md:gap-3" role="tablist" aria-label="Ana kategoriler">
									{originalCategories.map((cat, i) => (
										<motion.button
											key={cat.label}
											onClick={() => handleTabChange(i)}
											className={`${i === activeTab ? 'bg-white/15 text-white border-white/30' : 'text-neutral-300 hover:text-white hover:bg-white/8 border-white/10'} relative rounded-xl px-4 md:px-6 py-3 md:py-4 text-left border transition-all duration-300 focus-white group text-sm md:text-base flex-1 md:flex-none hover:md:translate-x-1`}
											whileHover={{ scale: 1.02, x: 5 }}
											whileTap={{ scale: 0.98 }}
											role="tab"
											aria-selected={i === activeTab}
										>
											<motion.div
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												transition={{ delay: i * 0.1 }}
												className="text-center md:text-left"
											>
												{cat.label}
        </motion.div>
											{i === activeTab && (
												<motion.div 
													layoutId="tab-highlight" 
													className="absolute left-0 top-0 bottom-0 w-1 bg-white/80 rounded-r hidden md:block" 
													transition={{ type: 'spring', stiffness: 400, damping: 30 }}
												/>
											)}
											{i === activeTab && (
												<motion.div 
													layoutId="tab-highlight-mobile" 
													className="absolute left-0 right-0 bottom-0 h-1 bg-white/80 rounded-t md:hidden" 
													transition={{ type: 'spring', stiffness: 400, damping: 30 }}
												/>
											)}
										</motion.button>
									))}
								</nav>
							</LayoutGroup>
						</div>
						
						<div className="md:col-span-8">
                <motion.div
								key={activeTab}
								initial={{ 
									opacity: 0, 
									x: isFirstTabChange ? 0 : (tabChangeDirection === 'right' ? 50 : -50), 
									y: 20 
								}}
								animate={{ opacity: 1, x: 0, y: 0 }}
								transition={{ 
									type: 'spring', 
									stiffness: 300, 
									damping: 25,
									duration: isFirstTabChange ? 0.6 : 0.4
								}}
								className="gradient-border w-full"
							>
								<div className="gb-inner p-4 md:p-8 rounded-[15px]">
									<motion.h4 
										key={`title-${activeTab}`}
										className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight"
										initial={{ opacity: 0, y: 20, scale: 0.95 }}
										animate={{ opacity: 1, y: 0, scale: 1 }}
										transition={{ 
											delay: 0.1, 
											type: 'spring', 
											stiffness: 200, 
											damping: 20 
										}}
									>
										{originalCategories[activeTab].title}
									</motion.h4>
									<motion.p 
										key={`desc-${activeTab}`}
										className="text-neutral-300 mb-4 md:mb-6 leading-relaxed text-sm md:text-base"
										initial={{ opacity: 0, y: 15, scale: 0.98 }}
										animate={{ opacity: 1, y: 0, scale: 1 }}
										transition={{ 
											delay: 0.2, 
											type: 'spring', 
											stiffness: 200, 
											damping: 20 
										}}
									>
										{originalCategories[activeTab].desc}
									</motion.p>
									<motion.div 
										className="grid gap-3 md:gap-4"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.3 }}
									>
										{originalCategories[activeTab].items.map((item, idx) => (
											<motion.div
												key={item.name}
												initial={{ opacity: 0, x: -20 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ delay: 0.4 + idx * 0.1 }}
												whileHover={{ x: 5, scale: 1.01 }}
												className="flex items-start gap-2 md:gap-3 p-2 md:p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group hover:md:translate-x-1"
											>
												<motion.div
													className="w-2 h-2 bg-white/40 rounded-full mt-2 flex-shrink-0 group-hover:bg-white/70"
													whileHover={{ scale: 1.5 }}
												/>
												<div className="min-w-0 flex-1">
													<motion.h5 
														className="text-white font-medium mb-1 group-hover:text-white text-sm md:text-base"
														whileHover={{ letterSpacing: '0.02em' }}
													>
														{item.name}
													</motion.h5>
													<p className="text-xs md:text-sm text-neutral-400 group-hover:text-neutral-300 leading-relaxed">
														{item.desc}
													</p>
          </div>
											</motion.div>
										))}
									</motion.div>
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

			{/* Theme Toggle - Bottom */}
			<section className="relative bg-neutral-800 border-t border-white/10">
				<div className="max-w-6xl mx-auto px-6 py-12 text-center relative z-10">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
					>
						<p className="text-neutral-400 text-sm mb-4">
							Farklı bir deneyim mi istiyorsunuz?
						</p>
						<motion.button
							onClick={() => setIsSpaceMode(true)}
							className="inline-flex items-center gap-3 px-8 py-4 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/15 hover:text-white transition-all backdrop-blur-sm"
							whileHover={{ scale: 1.05, y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.3)' }}
							whileTap={{ scale: 0.95 }}
						>
							<Rocket className="w-5 h-5" />
							<span className="font-medium">Uzay Üssü Moduna Geç</span>
						</motion.button>
					</motion.div>
				</div>
			</section>

			{/* Footer */}
			<footer className="relative bg-black border-t border-white/10">
				<div className="max-w-6xl mx-auto px-6 py-12 relative z-10">
					<div className="grid md:grid-cols-4 gap-8 pb-8 border-b border-white/10">
						<div>
							<div className="flex items-center gap-2 mb-3">
								<img src={logo} alt="WordPlay" className="w-6 h-6 logo-mono" />
								<span className="text-sm text-neutral-300">WordPlay</span>
							</div>
							<p className="text-sm text-neutral-400">Koç ELC ile uyumlu, modern kelime öğrenme platformu.</p>
						</div>
						<div>
							<h5 className="text-sm font-semibold text-white mb-2">Kurumsal</h5>
							<ul className="space-y-1 text-sm text-neutral-400">
								<li><a className="hover:text-neutral-200" href="#">Hakkında</a></li>
								<li><a className="hover:text-neutral-200" href="#">İletişim</a></li>
							</ul>
						</div>
						<div>
							<h5 className="text-sm font-semibold text-white mb-2">Yasal</h5>
							<ul className="space-y-1 text-sm text-neutral-400">
								<li><a className="hover:text-neutral-200" href="#">Gizlilik</a></li>
								<li><a className="hover:text-neutral-200" href="#">Kullanım Şartları</a></li>
							</ul>
						</div>
						<div>
							<h5 className="text-sm font-semibold text-white mb-2">Kaynaklar</h5>
							<ul className="space-y-1 text-sm text-neutral-400">
								<li><a className="hover:text-neutral-200" href="#">SSS</a></li>
								<li><a className="hover:text-neutral-200" href="#">Destek</a></li>
							</ul>
						</div>
					</div>
					<div className="flex items-center justify-between pt-6 text-xs text-neutral-500">
						<span>© 2024 WordPlay</span>
						<span>v1.0.0</span>
					</div>
				</div>
			</footer>

						{/* Auth Modal - Clean & Minimal */}
      {showAuth && (
				<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 sm:p-6">
					<motion.div 
						initial={{ opacity: 0, scale: 0.9 }} 
						animate={{ opacity: 1, scale: 1 }} 
						className="bg-white rounded-2xl w-full max-w-sm sm:max-w-md shadow-2xl relative"
					>
						{/* Close */}
						<button
							onClick={() => setShowAuth(false)}
							className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
						>
							<X className="w-5 h-5" />
						</button>

						{/* Content */}
						<div className="p-6 sm:p-8">
							<div className="text-center mb-6">
								<h2 className="text-2xl font-bold text-gray-900 mb-2">
									{authMode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
								</h2>
								<p className="text-gray-600">
									{authMode === 'login' 
										? 'Hesabınıza giriş yapın' 
										: 'Yeni hesap oluşturun'
									}
								</p>
							</div>

        <Auth
								mode={authMode}
          onClose={() => setShowAuth(false)}
								onSuccess={() => { setShowAuth(false); navigate('/home'); }}
							/>
							
							{/* Switch Mode */}
							<div className="mt-6 text-center">
								<span className="text-gray-500 text-sm">
									{authMode === 'login' ? 'Hesabınız yok mu?' : 'Zaten hesabınız var mı?'}
								</span>
								<button
									onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
									className="ml-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
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
};

export { WelcomePage };
export default WelcomePage; 

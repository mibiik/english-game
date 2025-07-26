class SoundService {
  private static instance: SoundService;
  private correctAudio: HTMLAudioElement | null = null;
  private wrongAudio: HTMLAudioElement | null = null;
  private soundEnabled: boolean = true;

  private constructor() {
    this.initializeAudio();
    this.loadSoundState();
  }

  public static getInstance(): SoundService {
    if (!SoundService.instance) {
      SoundService.instance = new SoundService();
    }
    return SoundService.instance;
  }

  private initializeAudio(): void {
    if (typeof window !== 'undefined') {
      this.correctAudio = new Audio('/correct-choice-43861.mp3');
      this.wrongAudio = new Audio('/wrong-47985.mp3');
      
      // Ses dosyalarını önceden yükle
      this.correctAudio.load();
      this.wrongAudio.load();
    }
  }

  private loadSoundState(): void {
    try {
      const saved = localStorage.getItem('soundEnabled');
      this.soundEnabled = saved ? JSON.parse(saved) : true;
      (window as any).soundEnabled = this.soundEnabled;
    } catch (error) {
      console.error('Ses durumu yüklenirken hata:', error);
      this.soundEnabled = true;
    }
  }

  public playCorrect(): void {
    if (this.soundEnabled && this.correctAudio) {
      this.correctAudio.currentTime = 0;
      this.correctAudio.play().catch(error => {
        console.error('Doğru ses efekti çalınırken hata:', error);
      });
    }
  }

  public playWrong(): void {
    if (this.soundEnabled && this.wrongAudio) {
      this.wrongAudio.currentTime = 0;
      this.wrongAudio.play().catch(error => {
        console.error('Yanlış ses efekti çalınırken hata:', error);
      });
    }
    
    // Telefon titreşimi
    if (typeof window !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(300);
    }
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
    localStorage.setItem('soundEnabled', JSON.stringify(enabled));
    (window as any).soundEnabled = enabled;
  }

  public toggleSound(): void {
    this.setSoundEnabled(!this.soundEnabled);
  }
}

export const soundService = SoundService.getInstance(); 
import {Component, inject} from '@angular/core';
import {environment} from '../../environments/environment';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonRange,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
  LoadingController
} from '@ionic/angular/standalone';
import {FormsModule} from '@angular/forms';

declare type Voice = { name: string, gender: string, language: string };

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonSelect, IonSelectOption, IonLabel, IonRange, IonTextarea, IonButton]
})
export class HomePage {
  languages: string[] = [];
  genders: string[] = [];
  voices: Voice[] = [];
  voicesResponse: Voice[] = [];
  selectedGender: string | null = null;
  selectedLanguage: string | null = null;
  selectedVoice: string | null = null;
  pitch = 0;
  speakingRate = 1;
  text = '';
  selectedClientVoice: SpeechSynthesisVoice | null = null;
  clientVoices: SpeechSynthesisVoice[];
  private readonly loadingController = inject(LoadingController);

  constructor() {
    this.loadVoices();
    this.clientVoices = speechSynthesis.getVoices().sort((a, b) => a.name > b.name ? 1 : -1);
    speechSynthesis.onvoiceschanged = () => this.clientVoices = speechSynthesis.getVoices().sort((a, b) => a.name > b.name ? 1 : -1);
  }

  async speakWithWebSpeechAPI(): Promise<void> {
    const utterance = new SpeechSynthesisUtterance(this.text);
    utterance.voice = this.selectedClientVoice;
    speechSynthesis.speak(utterance);
  }

  async speakWithGoogle(): Promise<void> {
    if (this.selectedLanguage === null || this.selectedVoice === null) {
      return Promise.reject('no language or voice selected');
    }

    const formData = new FormData();
    formData.append('language', this.selectedLanguage);
    formData.append('voice', this.selectedVoice);
    formData.append('text', this.text);
    formData.append('pitch', this.pitch.toString());
    formData.append('speakingRate', this.speakingRate.toString());

    const loadingElement = await this.loadingController.create({
      message: 'Generating mp3...',
      spinner: 'crescent'
    });
    await loadingElement.present();

    let mp3Bytes = null;
    try {
      const response = await fetch(`${environment.SERVER_URL}/speak`, {
        body: formData,
        method: 'POST'
      });
      mp3Bytes = await response.arrayBuffer();
    } finally {
      await loadingElement.dismiss();
    }

    if (mp3Bytes !== null) {
      const audioContext = new AudioContext();
      const audioBufferSource = audioContext.createBufferSource();

      audioBufferSource.buffer = await audioContext.decodeAudioData(mp3Bytes);

      audioBufferSource.connect(audioContext.destination);
      audioBufferSource.loop = false;
      audioBufferSource.start(0);
    }
  }

  languageChanged(event: Event): void {
    this.selectedLanguage = (event as CustomEvent).detail.value;
    this.voices = this.voicesResponse.filter(this.matches.bind(this));
    setTimeout(() => this.selectedVoice = this.voices[0].name, 1);
  }

  genderChanged(event: Event): void {
    this.selectedGender = (event as CustomEvent).detail.value;
    this.voices = this.voicesResponse.filter(this.matches.bind(this));
    setTimeout(() => this.selectedVoice = this.voices[0].name, 1);
  }

  private async loadVoices(): Promise<void> {
    const response = await fetch(`${environment.SERVER_URL}/voices`);
    this.voicesResponse = await response.json();
    this.languages = this.voicesResponse.map(v => v.language).filter(this.onlyUnique).sort();
    this.genders = this.voicesResponse.map(v => v.gender).filter(this.onlyUnique).sort();

    this.selectedGender = 'FEMALE';
    this.selectedLanguage = 'en-GB';
    this.selectedVoice = 'en-GB-Wavenet-A';
    this.text = 'Text to speak';
    this.voices = this.voicesResponse.filter(this.matches.bind(this));
  }

  private matches(voice: Voice): boolean {
    const matchesGender = !this.selectedGender || this.selectedGender === voice.gender;
    const matchesLanguage = !this.selectedLanguage || this.selectedLanguage === voice.language;
    return matchesGender && matchesLanguage;
  }

  private onlyUnique(value: string, index: number, self: string[]): boolean {
    return self.indexOf(value) === index;
  }

}

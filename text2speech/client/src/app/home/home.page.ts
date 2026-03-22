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
declare type SpeakRequest = {
  language: string,
  voice: string,
  text: string,
  pitch: number,
  speakingRate: number
};

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
  clientVoices: SpeechSynthesisVoice[] = [];
  private readonly loadingController = inject(LoadingController);

  constructor() {
    this.loadVoices();
    this.updateClientVoices();
    speechSynthesis.onvoiceschanged = () => this.updateClientVoices();
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

    const requestBody: SpeakRequest = {
      language: this.selectedLanguage,
      voice: this.selectedVoice,
      text: this.text,
      pitch: this.pitch,
      speakingRate: this.speakingRate
    };

    const loadingElement = await this.loadingController.create({
      message: 'Generating mp3...',
      spinner: 'crescent'
    });
    await loadingElement.present();

    let mp3Blob: Blob | null = null;
    try {
      const response = await fetch(`${environment.SERVER_URL}/speak`, {
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST'
      });
      if (!response.ok) {
        throw new Error(`Text-to-Speech request failed with status ${response.status}`);
      }
      mp3Blob = await response.blob();
    } finally {
      await loadingElement.dismiss();
    }

    if (mp3Blob !== null) {
      const audioUrl = URL.createObjectURL(mp3Blob);
      const audio = new Audio(audioUrl);
      audio.addEventListener('ended', () => URL.revokeObjectURL(audioUrl), {once: true});
      audio.addEventListener('error', () => URL.revokeObjectURL(audioUrl), {once: true});
      await audio.play();
    }
  }

  languageChanged(event: Event): void {
    this.selectedLanguage = (event as CustomEvent).detail.value;
    this.updateFilteredVoices();
  }

  genderChanged(event: Event): void {
    this.selectedGender = (event as CustomEvent).detail.value;
    this.updateFilteredVoices();
  }

  private async loadVoices(): Promise<void> {
    const response = await fetch(`${environment.SERVER_URL}/voices`);
    this.voicesResponse = await response.json();
    this.languages = this.voicesResponse.map(v => v.language).filter(this.onlyUnique).sort();
    this.genders = this.voicesResponse.map(v => v.gender).filter(this.onlyUnique).sort();

    this.selectedLanguage = this.languages.find(language => language.startsWith('en-')) ?? this.languages[0] ?? null;
    this.selectedGender = this.genders.includes('FEMALE') ? 'FEMALE' : this.genders[0] ?? null;
    this.text = 'Text to speak';
    this.updateFilteredVoices();
  }

  private updateClientVoices(): void {
    this.clientVoices = speechSynthesis.getVoices().sort((a, b) => a.name.localeCompare(b.name));
    this.selectedClientVoice = this.selectedClientVoice
      ?? this.clientVoices.find(voice => voice.lang.startsWith('en-'))
      ?? this.clientVoices[0]
      ?? null;
  }

  private updateFilteredVoices(): void {
    this.voices = this.voicesResponse.filter(this.matches.bind(this));
    this.selectedVoice = this.voices[0]?.name ?? null;
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

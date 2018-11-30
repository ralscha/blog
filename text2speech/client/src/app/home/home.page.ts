import {Component} from '@angular/core';
import {environment} from '../../environments/environment';
import {LoadingController} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {

  languages: string[] = [];
  genders: string[] = [];
  voices: any = [];
  voicesResponse: any;

  selectedGender: string;
  selectedLanguage: string;
  selectedVoice: string;

  pitch = 0;
  speakingRate = 1;
  text = '';

  selectedClientVoice: SpeechSynthesisVoice;
  clientVoices: SpeechSynthesisVoice[];

  constructor(private readonly loadingController: LoadingController) {
    this.loadVoices();
    this.clientVoices = speechSynthesis.getVoices().sort((a, b) => a.name > b.name ? 1 : -1);
    speechSynthesis.onvoiceschanged = () => this.clientVoices = speechSynthesis.getVoices().sort((a, b) => a.name > b.name ? 1 : -1);
  }

  async speakWithWebSpeechAPI() {
    const utterance = new SpeechSynthesisUtterance(this.text);
    utterance.voice = this.selectedClientVoice;
    speechSynthesis.speak(utterance);
  }

  async speakWithGoogle() {
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
      loadingElement.dismiss();
    }

    if (mp3Bytes !== null) {
      const audioContext = new AudioContext();
      const audioBufferSource = audioContext.createBufferSource();

      const decodedData = await audioContext.decodeAudioData(mp3Bytes);
      audioBufferSource.buffer = decodedData;

      audioBufferSource.connect(audioContext.destination);
      audioBufferSource.loop = false;
      audioBufferSource.start(0);
    }
  }

  languageChanged(event) {
    this.selectedLanguage = event.target.value;
    this.voices = this.voicesResponse.filter(this.matches.bind(this));
    setTimeout(() => this.selectedVoice = this.voices[0].name, 1);
  }

  genderChanged(event) {
    this.selectedGender = event.target.value;
    this.voices = this.voicesResponse.filter(this.matches.bind(this));
    setTimeout(() => this.selectedVoice = this.voices[0].name, 1);
  }

  private async loadVoices() {
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

  private matches(voice) {
    const matchesGender = !this.selectedGender || this.selectedGender === voice.gender;
    const matchesLanguage = !this.selectedLanguage || this.selectedLanguage === voice.language;
    return matchesGender && matchesLanguage;
  }

  private onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

}

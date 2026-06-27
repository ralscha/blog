import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Movie } from '../movie';
import { LoadingController } from '@ionic/angular';
// @ts-ignore
import RecordRTC from 'recordrtc';
import { environment } from '../../environments/environment';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonContent,
  IonFooter,
  IonHeader,
  IonList,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

/* eslint-disable @typescript-eslint/no-explicit-any */

type SpeechWindow = Window & {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
};

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonList,
    IonCardHeader,
    IonFooter,
    IonButton,
  ],
})
export class HomePage {
  movies: Movie[] = [];
  matches: string[] = [];
  isRecording = false;
  isWebSpeechRecording = false;
  private readonly changeDetectorRef = inject(ChangeDetectorRef);
  private readonly loadingCtrl = inject(LoadingController);
  private recorder: RecordRTC;
  private mediaStream: MediaStream | null = null;

  get isWebSpeechSupported(): boolean {
    return !!this.getSpeechRecognitionCtor();
  }

  private get speechWindow(): SpeechWindow {
    return window as SpeechWindow;
  }

  private getSpeechRecognitionCtor(): any {
    return this.speechWindow.SpeechRecognition ?? this.speechWindow.webkitSpeechRecognition;
  }

  async movieSearch(searchTerms: string[]): Promise<void> {
    if (searchTerms && searchTerms.length > 0) {
      const loading = await this.loadingCtrl.create({
        message: 'Please wait...',
      });
      loading.present();

      this.matches = searchTerms;
      let queryParams = '';
      searchTerms.forEach((term) => {
        queryParams += `term=${term}&`;
      });
      const response = await fetch(`${environment.serverUrl}/search?${queryParams}`);
      this.movies = await response.json();
      loading.dismiss();
      this.changeDetectorRef.detectChanges();
    } else {
      this.movies = [];
    }
  }

  searchWebSpeech(): void {
    const SpeechRecognitionCtor = this.getSpeechRecognitionCtor();
    if (!SpeechRecognitionCtor) {
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;

    recognition.onstart = () => {
      this.isWebSpeechRecording = true;
      this.changeDetectorRef.detectChanges();
    };

    recognition.onerror = (event: any) => console.log('error', event);
    recognition.onend = () => {
      this.isWebSpeechRecording = false;
      this.changeDetectorRef.detectChanges();
    };

    recognition.onresult = (event: any) => {
      const terms = [];
      if (event.results) {
        for (const result of event.results) {
          for (const ra of result) {
            terms.push(ra.transcript);
          }
        }
      }

      this.movieSearch(terms);
    };

    recognition.start();
  }

  async searchGoogleCloudSpeech(): Promise<void> {
    if (this.isRecording) {
      if (this.recorder) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        this.recorder.stopRecording(async (_: any) => {
          const recordedBlob = this.recorder.getBlob();

          const headers = new Headers();
          headers.append('Content-Type', 'application/octet-stream');

          const requestParams = {
            headers,
            method: 'POST',
            body: recordedBlob,
          };
          const response = await fetch(`${environment.serverUrl}/uploadSpeech`, requestParams);
          const searchTerms = await response.json();
          this.mediaStream?.getTracks().forEach((track) => track.stop());
          this.mediaStream = null;
          this.movieSearch(searchTerms);
        });
      }
      this.isRecording = false;
    } else {
      this.isRecording = true;
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
      const options = {
        mimeType: 'audio/wav',
        recorderType: RecordRTC.StereoAudioRecorder,
      };
      this.recorder = RecordRTC(this.mediaStream, options);
      this.recorder.startRecording();
    }
  }
}

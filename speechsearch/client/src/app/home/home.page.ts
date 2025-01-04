import {ChangeDetectorRef, Component} from '@angular/core';
import {Movie} from '../movie';
import {LoadingController} from '@ionic/angular';
// @ts-ignore
import * as RecordRTC from 'recordrtc';
import {environment} from '../../environments/environment';

/* eslint-disable @typescript-eslint/no-explicit-any */
declare let webkitSpeechRecognition: any;

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
    standalone: false
})
export class HomePage {
  movies: Movie[] = [];
  matches: string[] = [];
  isRecording = false;
  isWebSpeechRecording = false;
  private recorder: RecordRTC;

  constructor(private readonly changeDetectorRef: ChangeDetectorRef,
              private readonly loadingCtrl: LoadingController) {
  }

  async movieSearch(searchTerms: string[]): Promise<void> {
    if (searchTerms && searchTerms.length > 0) {

      const loading = await this.loadingCtrl.create({
        message: 'Please wait...'
      });
      loading.present();

      this.matches = searchTerms;
      let queryParams = '';
      searchTerms.forEach(term => {
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

  searchCordova(): void {
    // @ts-ignore
    window.plugins.speechRecognition.hasPermission(permission => {

      if (!permission) {
        // @ts-ignore
        window.plugins.speechRecognition.requestPermission(() => {
          // @ts-ignore
          window.plugins.speechRecognition.startListening(terms => {
            if (terms && terms.length > 0) {
              this.movieSearch([terms[0]]);
            } else {
              this.movieSearch(terms);
            }
          });
        });
      } else {
        // @ts-ignore
        window.plugins.speechRecognition.startListening(terms => {
          if (terms && terms.length > 0) {
            this.movieSearch([terms[0]]);
          } else {
            this.movieSearch(terms);
          }
        });
      }
    });
  }

  searchWebSpeech(): void {
    if (!('webkitSpeechRecognition' in window)) {
      return;
    }

    const recognition = new webkitSpeechRecognition();
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
            body: recordedBlob
          };
          const response = await fetch(`${environment.serverUrl}/uploadSpeech`, requestParams);
          const searchTerms = await response.json();
          this.movieSearch(searchTerms);
        });
      }
      this.isRecording = false;
    } else {
      this.isRecording = true;
      const stream = await navigator.mediaDevices.getUserMedia({video: false, audio: true});
      const options = {
        mimeType: 'audio/wav',
        recorderType: RecordRTC.StereoAudioRecorder
      };
      this.recorder = RecordRTC(stream, options);
      this.recorder.startRecording();
    }
  }


}

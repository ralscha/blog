import {Component, ViewChild} from '@angular/core';
import Flow from '@flowjs/flow.js';
import * as RecordRTC from 'recordrtc';
import {ToastController} from '@ionic/angular';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  recording = false;
  loadProgress = 0;
  @ViewChild('videoElement') videoElement;
  private recordRTC: RecordRTC;

  constructor(private readonly toastCtrl: ToastController) {
  }

  start() {
    this.recording = true;
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
      .then(async (stream) => {
        this.videoElement.nativeElement.srcObject = stream;
        await this.videoElement.nativeElement.play();

        const options = {
          mimeType: 'video/webm\;codecs=vp9',
          recorderType: RecordRTC.MediaStreamRecorder
        };
        this.recordRTC = RecordRTC(stream, options);
        this.recordRTC.startRecording();

      })
      .catch(function (err) {
        console.log('An error occured! ' + err);
      });
  }

  stop() {
    this.loadProgress = 0;
    this.recording = false;
    if (this.recordRTC) {
      this.recordRTC.stopRecording(_ => {
        const recordedBlob = this.recordRTC.getBlob();
        this.uploadVideo(recordedBlob);
      });
    }

    this.videoElement.nativeElement.pause();
    this.videoElement.nativeElement.srcObject = null;
  }

  takeSnapshot() {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 960;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(this.videoElement.nativeElement, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(this.uploadSnapshot.bind(this), 'image/jpeg', 1);
  }

  private uploadVideo(blob: Blob) {
    const f = new File([blob], `video_${Date.now()}.webm`, {
      type: 'video/webm'
    });

    this.uploadFile(f);
  }

  private uploadSnapshot(blob: Blob) {
    const f = new File([blob], `snapshot_${Date.now()}.jpg`, {
      type: 'image/jpeg'
    });

    this.uploadFile(f);
  }

  private uploadFile(file: File) {
    const flow = new Flow({
      target: `${environment.serverURL}/upload`,
      chunkSize: 50000,
      forceChunkSize: true,
      simultaneousUploads: 1,
      permanentErrors: [415, 500, 501]
    });

    flow.addFile(file);
    flow.upload();

    flow.on('fileSuccess', async (_, message) => {
      const toast = await this.toastCtrl.create({
        message: 'Upload successful',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });

    flow.on('fileError', async (_, message) => {
      const toast = await this.toastCtrl.create({
        message: 'Upload failed',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });

    flow.on('fileProgress', _ => {
      if (flow.progress()) {
        this.loadProgress = Math.floor(flow.progress() * 100);
      }
    });
  }
}

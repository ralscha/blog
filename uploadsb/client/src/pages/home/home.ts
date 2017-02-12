import {Component} from '@angular/core';
import {Camera, FileEntry, File} from "ionic-native";
import {Http, Response} from "@angular/http";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import 'rxjs/add/observable/throw';
import {Observable} from "rxjs";
import {LoadingController, Loading, ToastController} from "ionic-angular";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public myPhoto: any;
  public myPhotoURL: any;
  public error: string;
  private loading: Loading;

  constructor(private readonly http: Http,
              private readonly loadingCtrl: LoadingController,
              private readonly toastCtrl: ToastController) {
  }

  takePhoto() {
    Camera.getPicture({
      quality: 100,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.CAMERA,
      encodingType: Camera.EncodingType.PNG,
      saveToPhotoAlbum: true
    }).then(imageData => {
      this.myPhoto = imageData;
      this.uploadPhoto(imageData);
    }, error => {
      this.error = JSON.stringify(error);
    });
  }

  selectPhoto(): void {
    Camera.getPicture({
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: Camera.DestinationType.FILE_URI,
      quality: 100,
      encodingType: Camera.EncodingType.PNG,
    }).then(imageData => {
      this.myPhoto = imageData;
      this.uploadPhoto(imageData);
    }, error => {
      this.error = JSON.stringify(error);
    });
  }

  private uploadPhoto(imageFileUri: any): void {
    this.error = null;
    this.loading = this.loadingCtrl.create({
      content: 'Uploading...'
    });

    this.loading.present();

    File.resolveLocalFilesystemUrl(imageFileUri)
      .then(entry => (<FileEntry>entry).file(file => this.readFile(<Blob>file)))
      .catch(err => console.log(err));
  }

  private readFile(blob: Blob) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], {type: blob.type});
      formData.append('file', imgBlob, (<any>blob).name);
      this.postData(formData);
    };
    reader.readAsArrayBuffer(blob);
  }

  private postData(formData: FormData) {
    this.http.post("http://192.168.178.20:8080/upload", formData)
      .catch((e) => this.handleError(e))
      .map(response => response.text())
      .finally(() => this.loading.dismiss())
      .subscribe(ok => this.showToast(ok));
  }

  private showToast(ok: boolean) {
    if (ok) {
      const toast = this.toastCtrl.create({
        message: 'Upload successful',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }
    else {
      const toast = this.toastCtrl.create({
        message: 'Upload failed',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    this.error = errMsg;
    return Observable.throw(errMsg);
  }

}

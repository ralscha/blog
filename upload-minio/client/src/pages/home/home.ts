import {Component} from '@angular/core';
import {Observable} from "rxjs";
import {LoadingController, Loading, ToastController} from "ionic-angular";
import {Camera} from '@ionic-native/camera';
import {File, FileEntry} from "@ionic-native/file";
import {catchError, finalize} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public myPhoto: any;
  public myPhotoURL: any;
  public error: string;
  private loading: Loading;

  constructor(private readonly http: HttpClient,
              private readonly loadingCtrl: LoadingController,
              private readonly toastCtrl: ToastController,
              private readonly camera: Camera,
              private readonly file: File) {
  }

  takePhoto() {
    this.camera.getPicture({
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.PNG
    }).then(imageData => {
      this.myPhoto = imageData;
      this.uploadPhoto(imageData);
    }, error => {
      this.error = JSON.stringify(error);
    });
  }

  selectPhoto(): void {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      quality: 100,
      encodingType: this.camera.EncodingType.PNG,
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

    this.file.resolveLocalFilesystemUrl(imageFileUri)
      .then(entry => (entry as FileEntry).file(file => this.readFile(file)))
      .catch(err => console.log(err));
  }

  private readFile(file: any) {
    const fileName = file.name;
    const reader = new FileReader();
    reader.onloadend = () => {
      const imgBlob = new Blob([reader.result], {type: file.type});
      this.fetchPresignUrl(fileName).subscribe(url => this.postData(url, imgBlob));
    };
    reader.readAsArrayBuffer(file);
  }

  fetchPresignUrl(fileName: string): Observable<string> {
    return this.http.get(`http://192.168.178.84:8080/getPreSignUrl?fileName=${fileName}`, {responseType: 'text'});
  }

  private postData(url: string, blob: Blob) {
    this.http.put(url, blob, {observe: 'response', responseType: 'text'})
      .pipe(catchError(e => this.handleError(e)),
        finalize(() => this.loading.dismiss())
      )
      .subscribe(resp => {
        this.showToast(resp.ok);
      });
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
      const body:any = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    this.error = errMsg;
    return Observable.throw(errMsg);
  }

}

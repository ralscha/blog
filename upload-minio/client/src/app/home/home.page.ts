import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoadingController, ToastController} from '@ionic/angular';
import {catchError, finalize} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {environment} from '../../environments/environment';

/* eslint-disable @typescript-eslint/no-explicit-any */
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage {

  public myPhoto: any;
  public error: string | null = null;
  private loading: any;

  constructor(private readonly http: HttpClient,
              private readonly loadingCtrl: LoadingController,
              private readonly toastCtrl: ToastController) {
  }

  takePhoto(): void {
    // @ts-ignore
    const camera: any = navigator.camera;
    camera.getPicture((imageData: any) => {
      this.myPhoto = this.convertFileSrc(imageData);
      this.uploadPhoto(imageData);
    }, (error: any) => this.error = JSON.stringify(error), {
      quality: 100,
      destinationType: camera.DestinationType.FILE_URI,
      sourceType: camera.PictureSourceType.CAMERA,
      encodingType: camera.EncodingType.JPEG
    });
  }

  selectPhoto(): void {
    // @ts-ignore
    const camera: any = navigator.camera;
    camera.getPicture((imageData: any) => {
      this.myPhoto = this.convertFileSrc(imageData);
      this.uploadPhoto(imageData);
    }, (error: any) => this.error = JSON.stringify(error), {
      sourceType: camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: camera.DestinationType.FILE_URI,
      quality: 100,
      encodingType: camera.EncodingType.JPEG,
    });
  }

  fetchPresignUrl(fileName: string): Observable<string> {
    return this.http.get(`${environment.serverURL}/getPreSignUrl?fileName=${fileName}`, {responseType: 'text'});
  }

  private convertFileSrc(url: string): string {
    if (!url) {
      return url;
    }
    if (url.startsWith('/')) {
      // @ts-ignore
      return window.WEBVIEW_SERVER_URL + '/_app_file_' + url;
    }
    if (url.startsWith('file://')) {
      // @ts-ignore
      return window.WEBVIEW_SERVER_URL + url.replace('file://', '/_app_file_');
    }
    if (url.startsWith('content://')) {
      // @ts-ignore
      return window.WEBVIEW_SERVER_URL + url.replace('content:/', '/_app_content_');
    }
    return url;
  }

  private async uploadPhoto(imageFileUri: any): Promise<void> {
    this.error = null;
    this.loading = await this.loadingCtrl.create({
      message: 'Uploading...'
    });

    this.loading.present();

    // @ts-ignore
    window.resolveLocalFileSystemURL(imageFileUri,
      (entry: any) => {
        entry.file((file: any) => this.readFile(file));
      });
  }

  private readFile(file: any): void {
    const fileName = file.name;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        const imgBlob = new Blob([reader.result], {type: file.type});
        this.fetchPresignUrl(fileName).subscribe(url => this.postData(url, imgBlob));
      }
    };
    reader.readAsArrayBuffer(file);
  }

  private postData(url: string, blob: Blob): void {
    this.http.put(url, blob, {observe: 'response', responseType: 'text'})
      .pipe(catchError(e => this.handleError(e)),
        finalize(() => this.loading.dismiss())
      )
      .subscribe(resp => {
        this.showToast(resp.ok);
      });
  }

  private async showToast(ok: boolean | {}): Promise<void> {
    if (ok === true) {
      const toast = await this.toastCtrl.create({
        message: 'Upload successful',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    } else {
      const toast = await this.toastCtrl.create({
        message: 'Upload failed',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }
  }

  private handleError(error: Response | any): Observable<never> {
    let errMsg: string;
    if (error instanceof Response) {
      const body: any = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    this.error = errMsg;
    return throwError(errMsg);
  }

}

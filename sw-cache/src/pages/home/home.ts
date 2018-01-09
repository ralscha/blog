import {Component} from '@angular/core';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  pictures: string[] = [];

  constructor() {
    navigator.serviceWorker.addEventListener('message', event => {
      if (event.data === 'imagesCached') {
        this.listCache();
      }
    });
  }

  ionViewWillEnter() {
    this.listCache();
  }

  async listCache() {
    this.pictures = [];
    const cache = await caches.open('images');
    const responses = await cache.matchAll();
    responses.forEach(async response => {
      const ab = await response.arrayBuffer();
      const imageStr = 'data:image/jpeg;base64,' + btoa(String.fromCharCode.apply(null, new Uint8Array(ab)));
      this.pictures.push(imageStr);
    });
  }


}

import {Component, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit} from '@angular/core';
import {IonContent, IonHeader, IonicSlides, IonTitle, IonToolbar} from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent
  ]
})
export class HomePage implements OnInit, OnDestroy {
  swiperModules = [IonicSlides];
  pictures: string[] = [];
  private readonly cacheName = 'images-v1';
  private readonly onMessage = (event: MessageEvent<string>) => {
    if (event.data === 'imagesCached') {
      void this.listCache();
    }
  };

  constructor() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', this.onMessage);
    }
  }

  ngOnInit(): void {
    void this.listCache();
  }

  async listCache(): Promise<void> {
    this.revokeObjectUrls();
    const cache = await caches.open(this.cacheName);
    const responses = await cache.matchAll();
    this.pictures = await Promise.all(
      responses.map(async response => URL.createObjectURL(await response.blob()))
    );
  }

  ngOnDestroy(): void {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.removeEventListener('message', this.onMessage);
    }
    this.revokeObjectUrls();
  }

  private revokeObjectUrls(): void {
    for (const picture of this.pictures) {
      URL.revokeObjectURL(picture);
    }
    this.pictures = [];
  }

}

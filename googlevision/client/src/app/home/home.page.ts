import {AfterViewInit, Component, ElementRef, inject, viewChild} from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonTitle,
  IonToolbar,
  LoadingController
} from '@ionic/angular/standalone';
import {environment} from '../../environments/environment';
import {Face, FaceLandmark, Landmark, Logo, Text, Vertex, VisionResult} from '../vision';
import {GoogleMap, MapMarker} from '@angular/google-maps';
import {DecimalPipe} from '@angular/common';
import {addIcons} from "ionicons";
import {cameraOutline} from "ionicons/icons";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [GoogleMap, MapMarker, DecimalPipe, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonList, IonItem, IonLabel, IonRow, IonCol, IonFooter]
})
export class HomePage implements AfterViewInit {
  readonly fileInput = viewChild.required<ElementRef>('fileSelector');
  readonly canvas = viewChild.required<ElementRef>('canvas');
  readonly canvasContainer = viewChild.required<ElementRef>('canvasContainer');
  visionResult: VisionResult | null = null;
  detail: string | null = null;
  selectedFace: Face | null = null;
  markers: { lat: number, lng: number }[] = [];
  mapOptions: google.maps.MapOptions = {
    center: {lat: 40, lng: -20},
    zoom: 8
  };
  private readonly loadingController = inject(LoadingController);
  private ratio!: number;
  private ctx!: CanvasRenderingContext2D;
  private selectedFile: File | null = null;
  private image: HTMLImageElement | null = null;

  constructor() {
    addIcons({cameraOutline});
  }

  ngAfterViewInit(): void {
    const context = this.canvas().nativeElement.getContext('2d');
    if (context === null) {
      throw new Error('Unable to create 2D canvas context');
    }
    this.ctx = context;
  }

  showDetail(detail: string | null): void {
    if (detail === null && this.selectedFace !== null) {
      this.selectedFace = null;
      this.redrawImage();
    } else {
      this.detail = detail;
      if (this.detail === null) {
        this.redrawImage();
        this.markers = [];
      }
    }
  }

  onTextClick(text: Text): void {
    this.drawVertices(text.boundingPoly);
  }

  onLogoClick(logo: Logo): void {
    this.drawVertices(logo.boundingPoly);
  }

  onFaceClick(face: Face): void {
    this.selectedFace = face;
    this.drawVertices(face.boundingPoly);
  }

  onFaceLandmarkClick(landmark: FaceLandmark): void {
    if (this.selectedFace === null) {
      return;
    }

    this.redrawImage();
    this.drawVertices(this.selectedFace.boundingPoly);

    const x = landmark.x * this.ratio;
    const y = landmark.y * this.ratio;

    this.ctx.beginPath();
    this.ctx.arc(x, y, 5, 0, 2 * Math.PI, false);
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = '#bada55';
    this.ctx.stroke();
  }

  onLandmarkClick(landmark: Landmark): void {
    if (landmark.locations && landmark.locations.length > 0) {
      this.mapOptions.center = {
        lat: landmark.locations[0].lat,
        lng: landmark.locations[0].lng
      };

      this.markers = [];
      for (const loc of landmark.locations) {
        this.markers.push({lat: loc.lat, lng: loc.lng});
      }
    }
  }

  redrawImage(): void {
    if (this.image) {
      this.drawImageScaled(this.image);
    }
  }

  drawVertices(vertices: Vertex[]): void {
    if (vertices) {
      this.redrawImage();

      this.ctx.beginPath();
      this.ctx.moveTo(vertices[0].x * this.ratio, vertices[0].y * this.ratio);
      this.ctx.lineTo(vertices[1].x * this.ratio, vertices[1].y * this.ratio);
      this.ctx.lineTo(vertices[2].x * this.ratio, vertices[2].y * this.ratio);
      this.ctx.lineTo(vertices[3].x * this.ratio, vertices[3].y * this.ratio);
      this.ctx.closePath();
      this.ctx.strokeStyle = '#bada55';
      this.ctx.lineWidth = 3;
      this.ctx.stroke();
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0);
    if (!file) {
      return;
    }

    this.selectedFile = file;
    const url = URL.createObjectURL(file);

    this.image = new Image();
    this.image.onload = async () => {
      const image = this.image;
      if (image === null) {
        URL.revokeObjectURL(url);
        return;
      }

      this.drawImageScaled(image);

      const loading = await this.loadingController.create({
        message: 'Processing...'
      });

      this.visionResult = null;
      this.selectedFace = null;
      this.detail = null;
      this.markers = [];

      await loading.present();

      try {
        await this.fetchSignUrl();
      } finally {
        URL.revokeObjectURL(url);
        await loading.dismiss();
      }
    };
    this.image.onerror = () => {
      URL.revokeObjectURL(url);
    };
    this.image.src = url;
  }

  clickFileSelector(): void {
    this.fileInput().nativeElement.click();
  }

  private async fetchSignUrl(): Promise<void> {
    if (this.selectedFile === null) {
      return Promise.reject('no file selected');
    }

    const response = await fetch(`${environment.serverURL}/signurl`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contentType: this.selectedFile.type || 'application/octet-stream'
      })
    });
    if (!response.ok) {
      throw new Error('Failed to fetch signed upload URL');
    }

    const {uuid, url} = await response.json();

    await this.uploadToGoogleCloudStorage(url);
    await this.initiateGoogleVision(uuid);
  }

  private async uploadToGoogleCloudStorage(signURL: string): Promise<void> {
    if (this.selectedFile === null) {
      return Promise.reject('no file selected');
    }

    const response = await fetch(signURL, {
      method: 'PUT',
      headers: {
        'Content-Type': this.selectedFile.type || 'application/octet-stream',
      },
      body: this.selectedFile
    });
    if (!response.ok) {
      throw new Error('Failed to upload file to Google Cloud Storage');
    }
  }

  private async initiateGoogleVision(uuid: string): Promise<void> {
    const response = await fetch(`${environment.serverURL}/vision`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({uuid})
    });
    if (!response.ok) {
      throw new Error('Failed to start Google Cloud Vision request');
    }

    this.visionResult = await response.json();
  }

  private drawImageScaled(img: HTMLImageElement): void {
    const width = this.canvasContainer().nativeElement.clientWidth;
    const height = this.canvasContainer().nativeElement.clientHeight;

    const hRatio = width / img.width;
    const vRatio = height / img.height;
    this.ratio = Math.min(hRatio, vRatio);
    if (this.ratio > 1) {
      this.ratio = 1;
    }

    this.canvas().nativeElement.width = img.width * this.ratio;
    this.canvas().nativeElement.height = img.height * this.ratio;

    this.ctx.clearRect(0, 0, width, height);
    this.ctx.drawImage(img, 0, 0, img.width, img.height,
      0, 0, img.width * this.ratio, img.height * this.ratio);
  }

}

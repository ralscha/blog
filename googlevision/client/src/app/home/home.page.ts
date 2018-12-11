import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {LoadingController} from '@ionic/angular';
import {environment} from '../../environments/environment';
import {Face, FaceLandmark, Landmark, Logo, Text, Vertex, VisionResult} from '../vision';
import {ControlPosition, FullscreenControlOptions} from '@agm/core/services/google-maps-types';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit {

  @ViewChild('fileSelector') fileInput: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('canvasContainer') canvasContainer: ElementRef;

  visionResult: VisionResult = null;
  detail: string = null;
  selectedFace: Face = null;
  lat: number = null;
  lng: number = null;
  zoom = 8;
  fullscreenControlOptions: FullscreenControlOptions = {position: ControlPosition.BOTTOM_LEFT};
  markers: { lat: number, lng: number }[] = [];
  private ratio: number;
  private ctx: CanvasRenderingContext2D;
  private selectedFile: File;
  private image: any;

  constructor(private readonly loadingController: LoadingController) {
  }

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }

  showDetail(detail: string) {
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

  onTextClick(text: Text) {
    this.drawVertices(text.boundingPoly);
  }

  onLogoClick(logo: Logo) {
    this.drawVertices(logo.boundingPoly);
  }

  onFaceClick(face: Face) {
    this.selectedFace = face;
    this.drawVertices(face.boundingPoly);
  }

  onFaceLandmarkClick(landmark: FaceLandmark) {
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

  onLandmarkClick(landmark: Landmark) {
    if (landmark.locations && landmark.locations.length > 0) {
      this.lat = landmark.locations[0].lat;
      this.lng = landmark.locations[0].lng;

      this.markers = [];
      for (const loc of landmark.locations) {
        this.markers.push({lat: loc.lat, lng: loc.lng});
      }
    }
  }

  redrawImage() {
    if (this.image) {
      this.drawImageScaled(this.image);
    }
  }

  drawVertices(vertices: Vertex[]) {
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

  onFileCange(event) {
    this.selectedFile = event.target.files[0];
    const url = URL.createObjectURL(this.selectedFile);

    this.image = new Image();
    this.image.onload = async () => {
      this.drawImageScaled(this.image);

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
        loading.dismiss();
      }
    };
    this.image.src = url;
  }

  clickFileSelector() {
    this.fileInput.nativeElement.click();
  }

  private async fetchSignUrl() {
    const formData = new FormData();
    formData.append('contentType', this.selectedFile.type);

    const response = await fetch(`${environment.serverURL}/signurl`, {
      method: 'POST',
      body: formData
    });
    const {uuid, url} = await response.json();

    await this.uploadToGoogleCloudStorage(url);
    await this.initiateGoogleVision(uuid);
  }

  private async uploadToGoogleCloudStorage(signURL: string) {
    await fetch(signURL, {
      method: 'PUT',
      headers: {
        'Content-Type': this.selectedFile.type,
      },
      body: this.selectedFile
    });
  }

  private async initiateGoogleVision(uuid: string) {
    const formData = new FormData();
    formData.append('uuid', uuid);

    const response = await fetch(`${environment.serverURL}/vision`, {
      method: 'POST',
      body: formData
    });
    this.visionResult = await response.json();
  }

  private drawImageScaled(img) {
    const width = this.canvasContainer.nativeElement.clientWidth;
    const height = this.canvasContainer.nativeElement.clientHeight;

    const hRatio = width / img.width;
    const vRatio = height / img.height;
    this.ratio = Math.min(hRatio, vRatio);
    if (this.ratio > 1) {
      this.ratio = 1;
    }

    this.canvas.nativeElement.width = img.width * this.ratio;
    this.canvas.nativeElement.height = img.height * this.ratio;

    this.ctx.clearRect(0, 0, width, height);
    this.ctx.drawImage(img, 0, 0, img.width, img.height,
      0, 0, img.width * this.ratio, img.height * this.ratio);
  }

}

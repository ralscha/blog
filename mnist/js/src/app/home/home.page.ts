import {Component, ViewChild} from '@angular/core';
import {DrawableDirective} from '../drawable.directive';
import {multiply} from 'mathjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss']
})
export class HomePage {

  @ViewChild(DrawableDirective) drawable!: DrawableDirective;
  detections: number[] = [];
  detectedNumber: number | null;
  private weightsInputHidden!: number[][];
  private weightsHiddenOutput!: number[][];

  constructor() {
    const fetchInputHidden = fetch('assets/weights-input-hidden.json');
    const fetchHiddenOutput = fetch('assets/weights-hidden-output.json');

    fetchInputHidden.then(response => response.json()).then(json => {
      this.weightsInputHidden = json;
    });
    fetchHiddenOutput.then(response => response.json()).then(json => {
      this.weightsHiddenOutput = json;
    });
  }

  sigmoid(t): number {
    return 1 / (1 + Math.exp(-t));
  }

  detect(canvas): void {
    const canvasCopy = document.createElement('canvas');
    canvasCopy.width = 28;
    canvasCopy.height = 28;

    const copyContext = canvasCopy.getContext('2d');

    const ratioX = canvas.width / 28;
    const ratioY = canvas.height / 28;
    const drawBox = this.drawable.getDrawingBox();
    const scaledSourceWidth = Math.min(20, Math.max(4, ((drawBox[2] - drawBox[0] + 32) / ratioX)));
    const scaledSourceHeight = Math.min(20, ((drawBox[3] - drawBox[1] + 32) / ratioY));
    const dx = (28 - scaledSourceWidth) / 2;
    const dy = (28 - scaledSourceHeight) / 2;

    copyContext.drawImage(canvas, drawBox[0] - 16, drawBox[1] - 16, drawBox[2] - drawBox[0] + 16, drawBox[3] - drawBox[1] + 16,
      dx, dy, scaledSourceWidth, scaledSourceHeight);
    const imageData = copyContext.getImageData(0, 0, 28, 28);

    const numPixels = imageData.width * imageData.height;
    const values = new Array<number>(numPixels);
    for (let i = 0; i < numPixels; i++) {
      values[i] = imageData.data[i * 4 + 3] / 255.0;
    }

    this.detections = this.forwardPropagation(values);
    this.detectedNumber = this.indexMax(this.detections);
  }

  erase(): void {
    this.detections = [];
    this.detectedNumber = null;
    this.drawable.clear();
  }

  private forwardPropagation(imageData: number[]): number[] {
    const inputs: number[][] = [];
    for (const id of imageData) {
      inputs.push([id]);
    }

    const hiddenInputs = multiply(this.weightsInputHidden, inputs);
    const hiddenOutputs = hiddenInputs.map(value => this.sigmoid(value));
    const finalInputs = multiply(this.weightsHiddenOutput, hiddenOutputs);
    return finalInputs.map(value => this.sigmoid(value));
  }

  private indexMax(data: number[]): number {
    let indexMax = 0;
    for (let r = 0; r < data.length; r++) {
      indexMax = data[r] > data[indexMax] ? r : indexMax;
    }

    return indexMax;
  }

}

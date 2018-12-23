import {Component, ViewChild} from '@angular/core';
import {DrawableDirective} from '../drawable.directive';
import * as math from 'mathjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @ViewChild(DrawableDirective) drawable: DrawableDirective;
  detections: number[] = [];
  detectedNumber: number;
  private weightsInputHidden: number[][];
  private weightsHiddenOutput: number[][];

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

  sigmoid(t) {
    return 1 / (1 + Math.exp(-t));
  }

  detect(canvas) {
    const canvasCopy = document.createElement('canvas');
    const copyContext = canvasCopy.getContext('2d');
    canvasCopy.width = 28;
    canvasCopy.height = 28;
    copyContext.drawImage(canvas, 0, 0, 28, 28);
    const imageData = copyContext.getImageData(0, 0, 28, 28);

    const numPixels = imageData.width * imageData.height;
    const values = new Array<number>(numPixels);
    for (let i = 0; i < numPixels; i++) {
      values[i] = (imageData.data[i * 4 + 3] / 255.0 * 0.999) + 0.001;
    }

    this.detections = this.forwardPropagation(values);
    this.detectedNumber = this.indexMax(this.detections);
  }

  erase() {
    this.detections = [];
    this.detectedNumber = null;
    this.drawable.clear();
  }

  private forwardPropagation(imageData: number[]): number[] {
    const inputs: number[][] = [];
    for (let r = 0; r < imageData.length; r++) {
      inputs.push([imageData[r]]);
    }

    const hiddenInputs = math.multiply(this.weightsInputHidden, inputs);
    const hiddenOutputs = hiddenInputs.map(value => this.sigmoid(value));
    const finalInputs = math.multiply(this.weightsHiddenOutput, hiddenOutputs);
    const finalOutputs = finalInputs.map(value => this.sigmoid(value));
    return finalOutputs;
  }

  private indexMax(data: number[]): number {
    let indexMax = 0;
    for (let r = 0; r < data.length; r++) {
      indexMax = data[r] > data[indexMax] ? r : indexMax;
    }

    return indexMax;
  }

}

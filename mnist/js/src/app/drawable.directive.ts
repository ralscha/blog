import {Directive, ElementRef, EventEmitter, HostListener, OnInit, Output, Renderer2} from '@angular/core';
import {Platform} from '@ionic/angular';

@Directive({
  selector: '[appDrawable]'
})
export class DrawableDirective implements OnInit {

  @Output() newImage = new EventEmitter();
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private lastX: number;
  private lastY: number;
  private minX = Number.MAX_SAFE_INTEGER;
  private minY = Number.MAX_SAFE_INTEGER;
  private maxX = 0;
  private maxY = 0;
  private drawing = false;

  constructor(private readonly  el: ElementRef, private readonly renderer: Renderer2,
              private readonly platform: Platform) {
  }

  ngOnInit() {
    this.canvas = this.el.nativeElement as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');
    this.renderer.setAttribute(this.canvas, 'width', '' + Math.min(300, this.platform.width() / 1.5));
    this.renderer.setAttribute(this.canvas, 'height', '' + Math.min(300, this.platform.width() / 1.5));
  }

  @HostListener('touchend', ['$event'])
  @HostListener('mouseup', ['$event'])
  up(e) {
    this.newImage.emit(this.getImgData());
    this.drawing = false;
  }

  @HostListener('touchstart', ['$event'])
  @HostListener('touchenter', ['$event'])
  @HostListener('mousedown', ['$event'])
  down(e) {
    this.drawing = true;

    const rect = this.canvas.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
      this.lastX = e.touches[0].clientX - rect.left;
      this.lastY = e.touches[0].clientY - rect.top;
    } else {
      this.lastX = e.clientX - rect.left;
      this.lastY = e.clientY - rect.top;
    }
  }

  @HostListener('touchmove', ['$event'])
  @HostListener('mousemove', ['$event'])
  move(e) {
    if (!this.drawing) {
      return;
    }

    this.ctx.beginPath();
    this.ctx.lineWidth = 32;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = '#000000';
    this.ctx.moveTo(this.lastX, this.lastY);

    const rect = this.canvas.getBoundingClientRect();

    let x;
    let y;
    if (e.touches && e.touches.length > 0) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    this.minX = Math.min(this.minX, x);
    this.minY = Math.min(this.minY, y);
    this.maxX = Math.max(this.maxX, x);
    this.maxY = Math.max(this.maxY, y);

    this.ctx.lineTo(x, y);
    this.lastX = x;
    this.lastY = y;
    this.ctx.stroke();
  }

  clear() {
    this.drawing = false;
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.minX = Number.MAX_SAFE_INTEGER;
    this.minY = Number.MAX_SAFE_INTEGER;
    this.maxX = 0;
    this.maxY = 0;
  }

  getDrawingBox() {
    return [this.minX, this.minY, this.maxX, this.maxY];
  }

  getImgData(): HTMLCanvasElement {
    return this.canvas;
  }

}

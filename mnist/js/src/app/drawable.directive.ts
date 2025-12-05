import {Directive, ElementRef, HostListener, inject, OnInit, Renderer2, output} from '@angular/core';
import {Platform} from '@ionic/angular/standalone';

@Directive({selector: '[appDrawable]'})
export class DrawableDirective implements OnInit {
  readonly newImage = output<HTMLCanvasElement>();
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly platform = inject(Platform);
  private ctx!: CanvasRenderingContext2D;
  private canvas!: HTMLCanvasElement;
  private lastX: number | null = null;
  private lastY: number | null = null;
  private minX = Number.MAX_SAFE_INTEGER;
  private minY = Number.MAX_SAFE_INTEGER;
  private maxX = 0;
  private maxY = 0;
  private drawing = false;

  ngOnInit(): void {
    this.canvas = this.el.nativeElement as HTMLCanvasElement;
    // @ts-ignore
    this.ctx = this.canvas.getContext('2d');
    this.renderer.setAttribute(this.canvas, 'width', '' + Math.min(300, this.platform.width() / 1.5));
    this.renderer.setAttribute(this.canvas, 'height', '' + Math.min(300, this.platform.width() / 1.5));
  }

  @HostListener('touchend')
  @HostListener('mouseup')
  up(): void {
    this.newImage.emit(this.getImgData());
    this.drawing = false;
  }

  @HostListener('touchstart', ['$event'])
  @HostListener('touchenter', ['$event'])
  @HostListener('mousedown', ['$event'])
  // @ts-ignore
  down(e): void {
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
  // @ts-ignore
  move(e): void {
    if (!this.drawing) {
      return;
    }

    this.ctx.beginPath();
    this.ctx.lineWidth = 32;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = '#000000';
    if (this.lastX !== null && this.lastY !== null) {
      this.ctx.moveTo(this.lastX, this.lastY);
    }

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

  clear(): void {
    this.drawing = false;
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.minX = Number.MAX_SAFE_INTEGER;
    this.minY = Number.MAX_SAFE_INTEGER;
    this.maxX = 0;
    this.maxY = 0;
  }

  getDrawingBox(): [number, number, number, number] {
    return [this.minX, this.minY, this.maxX, this.maxY];
  }

  getImgData(): HTMLCanvasElement {
    return this.canvas;
  }

}

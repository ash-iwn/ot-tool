import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { DomSanitizer, SafeUrl } from '@angular/platform-browser';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'ot-tool';

  tbase: string = '3';
  theight: string = '4';

  canvasWidth: number = Number(this.tbase) * 50;
  canvasHeight: number = Number(this.theight) * 50;

  @ViewChild('myCanvas', {static: false})
  canvas: ElementRef = {} as ElementRef;

  context: CanvasRenderingContext2D = {} as CanvasRenderingContext2D;
  data: any = [];

  sanitizedBlobUrl: SafeUrl = '';
  filename: string = '';

  

  constructor( @Inject(DOCUMENT) private document: Document, private http:HttpClient,  private sanitizer: DomSanitizer) {

  }

  ngOnInit(): void {
  }



  draw() {
    this.context = this.canvas.nativeElement.getContext('2d');
    this.canvasWidth = Number(this.tbase) * 50;
    this.canvasHeight = Number(this.theight) * 50;
  
    this.context.canvas.width = this.canvasWidth; 
    this.context.canvas.height = this.canvasHeight;

    const path=new Path2D();
    path.moveTo(0, this.canvasHeight);// bottom left corner
    path.lineTo( this.canvasWidth/2, 0); // top middle of canvas
    path.lineTo( this.canvasWidth,this.canvasHeight); // bottom right corner

    this.context.fill(path);

  }


  getWebPageData() {
    this.data = [];

    this.http.get('http://localhost:3200/getData').subscribe(val => {
      
      this.data = val;
      const blob = new Blob([JSON.stringify(this.data, null, 2)], {type: 'application/json'});
      const blobUrl = window.URL.createObjectURL(blob);
      window.open(blobUrl)

    });
  }
}


import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
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
  data: any;

  

  constructor( @Inject(DOCUMENT) private document: Document, private http:HttpClient) {

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

    //canvas.width = parseInt(Number(this.tbase) * 50);
    // canvas.height = parseInt(height.value * 50);

    // if (canvas.getContext) {
    //     const ctx = canvas.getContext('2d');

    //     const sWidth = canvas.width;
    //     const sHeight = canvas.height;
    //     const path=new Path2D(); // origin is at the top left corner of the canvas
    //     path.moveTo(0, sHeight);// bottom left corner
    //     path.lineTo(sWidth/2, 0); // top middle of canvas
    //     path.lineTo(sWidth,sHeight); // bottom right corner
    
    //     ctx.fill(path);
    // }
  }


  getWebPageData() {

    let response = this.http.get('http://localhost:3200/getData').subscribe(val => {
      console.log('val', val);
      this.data = val;

    });


  }

 

}


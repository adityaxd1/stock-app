import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-top-news-popup',
  standalone: true,
  imports: [MatIconModule,MatButtonModule,CommonModule],
  templateUrl: './top-news-popup.component.html',
  styleUrl: './top-news-popup.component.scss'
})
export class TopNewsPopupComponent implements OnInit {

  constructor(   public dialogRef: MatDialogRef<TopNewsPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,){}
    ngOnInit(): void {
      console.log(this.data,"data")
    }
  close(){
    this.dialogRef.close()
  }
}

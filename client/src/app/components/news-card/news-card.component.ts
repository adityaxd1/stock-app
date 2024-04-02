import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common"; 
import { TopNewsPopupComponent } from "../modals/top-news-popup/top-news-popup.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
   selector: "app-news-card",
   standalone: true,
   imports: [CommonModule],
   templateUrl: "./news-card.component.html",
   styleUrls: ["./news-card.component.scss"],
})
export class NewsCardComponent {
   @Input() set newsItem(value: any) {
      if (value) {
         this._newsItem = value;
         this.cdr.detectChanges();
      }
   }
   get newsItem(): any {
      return this._newsItem;
   }
   private _newsItem: any;

   constructor(private cdr: ChangeDetectorRef,public dialog: MatDialog) {}

   openModal(){
      const dialogRef = this.dialog.open(TopNewsPopupComponent, {
        data: this.newsItem,
        panelClass: 'custom-dialog-class'
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        console.log('The dialog was closed');
        if (result) {
       
        }
      });
    }
}

import { BuyPopupComponent } from '@/components/modals/buy-popup/buy-popup.component';
import { SellPopupComponent } from '@/components/modals/sell-popup/sell-popup.component';
import { TransactionService } from '@/services/transaction.service';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { api_base } from '../../../lib/config';
import { CommonService } from '@/services/common.service';
import { CommonModule } from '@angular/common';
import { AlertService } from '@/services/alert.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-portfolio-page',
  standalone: true,
  imports: [CommonModule,MatIconModule],
  templateUrl: './portfolio-page.component.html',
  styleUrl: './portfolio-page.component.scss'
})
export class PortfolioPageComponent {
  walletBalance=0
  portfolio:any=[]

  constructor(public dialog : MatDialog,
    public transactionService:TransactionService,
    public http:HttpClient,
    public alertService:AlertService,
    public commonService:CommonService){
    this.getData()
  }


  getData(){
    this.transactionService.getWalletBalance().subscribe((res:any)=>{
      
      this.walletBalance=res.data.wallet_balance
    })
    this.commonService.showLoader()
    this.transactionService.getPortfolio().subscribe((res:any)=>{
      this.portfolio=[]
      res.data.forEach((item:any)=>{
        this.commonService.showLoader()
        this.http.get(`${api_base}/stock/details/${item._id}`).subscribe((res:any)=>{
          this.portfolio.push({...res.data,avg_buy_price:item.avg_buy_price,total_units:item.total_units})
          console.log(this.portfolio)
          this.commonService.hideLoader()
          this.commonService.hideLoader()
        },err=>{
          this.commonService.hideLoader()
          this.commonService.hideLoader()
        })
      })
    })
    setTimeout(() => {
      this.commonService.hideLoader()
   }, 1500);
  }

  buy(item:any){
    const dialogRef = this.dialog.open(BuyPopupComponent, {
      data: item,
      panelClass: 'custom-dialog-class'
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result) {
        this.getData()
      }
    });
  }
  sell(item:any){
    const dialogRef = this.dialog.open(SellPopupComponent, {
      data: item,
      panelClass: 'custom-dialog-class'
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result) {
        this.getData()
      }
    });
  }
  checkValue(item:any){
  return  ((item.quote.c*item.total_units)-(item.avg_buy_price*item.total_units))*100/(item.avg_buy_price*item.total_units)
  }
}

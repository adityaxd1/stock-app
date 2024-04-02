import { AlertService } from '@/services/alert.service';
import { TransactionService } from '@/services/transaction.service';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sell-popup',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatIconModule,CommonModule],
  templateUrl: './sell-popup.component.html',
  styleUrl: './sell-popup.component.scss'
})
export class SellPopupComponent implements OnInit {
  quantity: any = 0;
  total: any = 0;
  portfolioQuantity = 0
  walletBalance=0
  constructor(public dialogRef: MatDialogRef<SellPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public transactionService: TransactionService,public alertService:AlertService) { }

  ngOnInit(): void {
    console.log(this.data, "data")
    this.transactionService.getTotalStockQuantity(this.data.profile.ticker).subscribe((res: any) => {
      this.portfolioQuantity = res.data.total_quantity
    })
    this.transactionService.getWalletBalance().subscribe((res:any)=>{
      console.log(res)
      this.walletBalance=res.data.wallet_balance
    })
  }
  submit() {
    this.transactionService.sellStock(this.data.profile.ticker, this.data.quote.c, this.quantity).subscribe(res => {
      this.alertService.add({message:`${this.data.profile.ticker} sold successfully`,type:"error",autoDismiss:true})
      this.dialogRef.close(this.data)
    })
  }
  close() {
    this.dialogRef.close()
  }
  change(event: any) {
    let formattedNumber = this.quantity * this.data.quote.c;
    this.total = formattedNumber.toFixed(3);
  }
}

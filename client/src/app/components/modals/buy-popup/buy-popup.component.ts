import { AlertService } from '@/services/alert.service';
import { TransactionService } from '@/services/transaction.service';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-buy-popup',
  standalone: true,
  imports: [MatButtonModule, FormsModule, CommonModule,
    MatIconModule, MatInputModule, MatFormFieldModule],
  templateUrl: './buy-popup.component.html',
  styleUrl: './buy-popup.component.scss'
})
export class BuyPopupComponent implements OnInit {
  quantity: any = 0;
  total: any = 0;
  walletBalance=0
  constructor(public dialogRef: MatDialogRef<BuyPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,public transactionService:TransactionService,public alertService:AlertService) { }

  ngOnInit(): void {
    console.log(this.data, "data")
    this.transactionService.getWalletBalance().subscribe((res:any)=>{
      console.log(res)
      this.walletBalance=res.data.wallet_balance
    })
  }
  submit() {
    console.log(this.data)
    this.transactionService.buyStock(this.data.profile.ticker,this.data.quote.c,this.quantity).subscribe(res=>{
      this.alertService.add({message:`${this.data.profile.ticker} bought successfully`,type:"success",autoDismiss:true})
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

import { HttpClient } from "@angular/common/http";
import { Component, OnInit, inject } from "@angular/core";
import { Observable, filter, map, of, tap } from "rxjs";
import { api_base } from "../../../lib/config";
import { ServerHttpResponse } from "../../../lib/types/httpResponse";
import { CommonModule } from "@angular/common";
import { AlertService } from "@/services/alert.service";
import { CommonService } from "@/services/common.service";
import { MatIconModule } from "@angular/material/icon";

@Component({
   selector: "app-wishlist-page",
   standalone: true,
   imports: [CommonModule,MatIconModule],
   templateUrl: "./wishlist-page.component.html",
   styleUrl: "./wishlist-page.component.scss",
})
export class WishlistPageComponent implements OnInit {
   http = inject(HttpClient);
   wishLists:any = []
   alertService = inject(AlertService);

   constructor(public commonService:CommonService){

   }

   ngOnInit(): void {
      this.getAllWishlist();
   }

   getAllWishlist() {
      this.commonService.showLoader()
      this.http.get<ServerHttpResponse<[]>>(`${api_base}/wishlist/get-all`).subscribe(res=>{
         res.data.forEach((item:any)=>{
            this.commonService.showLoader()
            this.http.get(`${api_base}/stock/details/${item.symbol}`).subscribe((r:any)=>{
               this.wishLists.push(r.data)
               this.commonService.hideLoader()
             },err=>{
               console.log(this.wishLists,"this.wishLists")
               this.commonService.hideLoader()
             })
         },(err:any)=>{
            this.commonService.hideLoader()

          })
      })
      setTimeout(() => {
         this.commonService.hideLoader()
      }, 1500);
   }
   log(any: any) {
      console.log(any);
   }

   onRemoveWishlist(symbol: string) {
      console.log(symbol);
      this.http.delete<ServerHttpResponse<any>>(`${api_base}/wishlist/remove/${symbol}`).subscribe({
         next: (value) => {
            console.log(value);
            if (value.data?.deletedCount) {
               this.alertService.add({ message: `Removed ${symbol} from Watchlist` });
               this.wishLists = this.wishLists.filter((v:any) => (v as any)?.profile.ticker !== symbol)
            }
         },
         error: (e) => {
            console.log(e);
         },
      });
   }
}

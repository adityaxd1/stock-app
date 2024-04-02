import { StockSearchbarComponent } from "@/components/stock-searchbar/stock-searchbar.component";
import { AlertService } from "@/services/alert.service";
import { CommonService } from "@/services/common.service";
import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, signal } from "@angular/core";
import { ActivatedRoute, Router, RouterOutlet } from "@angular/router";

const routeSymbol = signal("");

@Component({
   selector: "app-searchpage",
   standalone: true,
   imports: [StockSearchbarComponent, RouterOutlet, CommonModule],
   templateUrl: "./searchpage.component.html",
   styleUrl: "./searchpage.component.scss",
})
export class SearchpageComponent implements OnInit {
   private route = inject(ActivatedRoute);
   hasDefaultSymbol = "";
   private alertService = inject(AlertService);

   constructor(public commonService:CommonService,public router:Router){

   }

   ngOnInit(): void {
      if(this.commonService.selectedTicker){
         this.router.navigateByUrl("/search/"+this.commonService.selectedTicker)
      }
      if (this.route.children.length > 0) {
         this.route.children[0].paramMap.subscribe((v) => {
            this.hasDefaultSymbol = v.get("symbol") || "";
         });
      }
   }
}

import { Component, inject } from "@angular/core";
import { RouterModule, RouterOutlet } from "@angular/router";
import { NavbarComponent } from "@/components/navbar/navbar.component";
import { FooterComponent } from "./component/footer/footer.component";
import { AlertService } from "./services/alert.service";
import { AlartComponent } from "./components/alart/alart.component";
import { LoaderComponent } from "./components/loader/loader.component";
import { CommonService } from "./services/common.service";
import { StockChartComponent } from "./components/stock-chart/stock-chart.component";

@Component({
   selector: "app-root",
   standalone: true,
   imports: [RouterOutlet, RouterModule, NavbarComponent, FooterComponent, AlartComponent,LoaderComponent,StockChartComponent],
   templateUrl: "./app.component.html",
   styleUrl: "./app.component.scss",
})
export class AppComponent {
   title = "client";
   alertService = inject(AlertService)

   constructor(public commonService:CommonService){

   }

}

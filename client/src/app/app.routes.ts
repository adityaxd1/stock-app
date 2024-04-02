import { Routes } from "@angular/router";
import { SearchpageComponent } from "@/pages/searchpage/searchpage.component";
import { StockDetailsPage } from "@/pages/searchpage/stock-details-page/stock-details-page.component";
import { WishlistPageComponent } from "@/pages/wishlist-page/wishlist-page.component";
import { PortfolioPageComponent } from "@/pages/portfolio-page/portfolio-page.component";

export const routes: Routes = [
   {
      path: "",
      redirectTo: "search",
      pathMatch: "full",
   },
   {
      path: "search",
      component: SearchpageComponent,
      children: [
         {
            path: ":symbol",
            component: StockDetailsPage,
         },
      ],
   },
   {
      path: "watchlist",
      component: WishlistPageComponent,
   },
   {
      path: "portfolio",
      component: PortfolioPageComponent,
   },

   {
      path: "**",
      redirectTo: "/search",
   },
];

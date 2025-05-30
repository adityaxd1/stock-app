import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Router, RouterLink, RouterLinkActive, RouterModule } from "@angular/router";

@Component({
   selector: "app-navbar",
   standalone: true,
   imports: [RouterLink, RouterLinkActive, CommonModule, RouterModule],
   templateUrl: "./navbar.component.html",
   styleUrl: "./navbar.component.scss",
})
export class NavbarComponent {
   navbarLinkData = [
      {
         label: "Search",
         href: "search",
      },
      {
         label: "Watchlist",
         href: "watchlist",
      },
      {
         label: "Portfolio",
         href: "portfolio",
      },
   ];
}

import { AlertService } from "@/services/alert.service";
import { Component, inject } from "@angular/core";

@Component({
   selector: "app-alart",
   standalone: true,
   imports: [],
   templateUrl: "./alart.component.html",
   styleUrl: "./alart.component.scss",
})
export class AlartComponent {
   alertService = inject(AlertService);
}

import { AfterViewInit, Component, ElementRef, Input, OnInit, Signal, ViewChild, input, signal, viewChild } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { AsyncPipe } from "@angular/common";
import { Observable, config, lastValueFrom } from "rxjs";
import { startWith, map, debounceTime, switchMap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { api_base } from "../../../lib/config";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { ServerHttpResponse } from "../../../lib/types/httpResponse";
import { Router } from "@angular/router";
import { FinhubService } from "@/services/finhub/finhub.service";
import { FinnhubReturnTypes } from "@/services/finhub/finnhub.service.types";
import {MatIconModule} from '@angular/material/icon';
import { CommonService } from "@/services/common.service";
export type SearchaDataType = {};

@Component({
   selector: "app-stock-searchbar",
   standalone: true,
   imports: [FormsModule,MatIconModule, MatAutocompleteModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, AsyncPipe, MatProgressSpinnerModule],
   templateUrl: "./stock-searchbar.component.html",
   styleUrl: "./stock-searchbar.component.scss",
})
export class StockSearchbarComponent implements OnInit, AfterViewInit {
   @Input("hasDefaultSymbol") defaultSymbol: string = "";
   @ViewChild("searchInput", { static: true }) searchInput: ElementRef<HTMLInputElement> | undefined;

   options = signal<FinnhubReturnTypes["getSearchResult"]["data"]["result"]>([]);
   searching = signal(false);

   constructor(private http: HttpClient, public router: Router, private finnhub: FinhubService,public commonService:CommonService) {}

   ngOnInit() {
      this.searchInput!.nativeElement.value = this.defaultSymbol;
   }

   ngAfterViewInit(): void {
      this.registerAutoComplete();
   }

   onSelectedValue(ev: MatAutocompleteSelectedEvent) {
      // this.commonService.selectedTicker=ev.option.value
      this.router.navigateByUrl(`/search/${ev.option.value}`);
   }

   registerAutoComplete() {
      let timeout: number;
      this.searchInput?.nativeElement.addEventListener("input", (e) => {
         clearTimeout(timeout);
         timeout = window.setTimeout(() => {
            let value = this.searchInput?.nativeElement.value || "";
            if (value !== "") {
               this.searching.set(true);
               this.finnhub.getSearchResult(value).subscribe({
                  next: (value) => {
                     this.searching.set(false);
                     console.log(value);
                     this.options.set(value.data.result);
                  },
                  error: (err) => {
                     this.searching.set(false);
                     console.error(err);
                  },
               });
            }
         }, 700);
      });
   }

reset(){
   this.searchInput!.nativeElement.value  = '';
   this.router.navigateByUrl(`/search`);
}
search(){
   this.router.navigateByUrl(`/search/${this.searchInput!.nativeElement.value}`);
}
}

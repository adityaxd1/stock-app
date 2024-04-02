import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  loader:any=[]
  selectedTicker=""
  constructor() { }


  showLoader(){
    this.loader.push(1)
  }

  hideLoader(){
    if(this.loader.length>0){
      this.loader.splice(0,1)
    }
  }

  get isLoading(){
    return this.loader.length>0
  }
}

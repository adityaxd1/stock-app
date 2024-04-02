import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockSearchbarComponent } from './stock-searchbar.component';

describe('StockSearchbarComponent', () => {
  let component: StockSearchbarComponent;
  let fixture: ComponentFixture<StockSearchbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockSearchbarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StockSearchbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

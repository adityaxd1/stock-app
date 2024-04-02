import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockDetailsPage } from './stock-details-page.component';

describe('StockDetailsPageComponent', () => {
  let component: StockDetailsPage;
  let fixture: ComponentFixture<StockDetailsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockDetailsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

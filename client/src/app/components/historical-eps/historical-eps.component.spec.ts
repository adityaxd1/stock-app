import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalEpsComponent } from './historical-eps.component';

describe('HistoricalEpsComponent', () => {
  let component: HistoricalEpsComponent;
  let fixture: ComponentFixture<HistoricalEpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricalEpsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoricalEpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

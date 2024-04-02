import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedTrendsComponent } from './recommended-trends.component';

describe('RecommendedTrendsComponent', () => {
  let component: RecommendedTrendsComponent;
  let fixture: ComponentFixture<RecommendedTrendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendedTrendsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecommendedTrendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

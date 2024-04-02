import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopNewsPopupComponent } from './top-news-popup.component';

describe('TopNewsPopupComponent', () => {
  let component: TopNewsPopupComponent;
  let fixture: ComponentFixture<TopNewsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopNewsPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopNewsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

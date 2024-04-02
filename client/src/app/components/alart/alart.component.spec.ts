import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlartComponent } from './alart.component';

describe('AlartComponent', () => {
  let component: AlartComponent;
  let fixture: ComponentFixture<AlartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AlartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AthletePageComponent } from './athlete-page.component';

describe('AthletePageComponent', () => {
  let component: AthletePageComponent;
  let fixture: ComponentFixture<AthletePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AthletePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AthletePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

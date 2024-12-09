import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RewardArrayComponent } from './reward-array.component';

describe('RewardArrayComponent', () => {
  let component: RewardArrayComponent;
  let fixture: ComponentFixture<RewardArrayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RewardArrayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RewardArrayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

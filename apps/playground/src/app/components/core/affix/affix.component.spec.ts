import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffixComponent } from './affix.component';

describe('AffixComponent', () => {
  let component: AffixComponent;
  let fixture: ComponentFixture<AffixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AffixComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AffixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

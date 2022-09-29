import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyAgGridHeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: SkyAgGridHeaderComponent;
  let fixture: ComponentFixture<SkyAgGridHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkyAgGridHeaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkyAgGridHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

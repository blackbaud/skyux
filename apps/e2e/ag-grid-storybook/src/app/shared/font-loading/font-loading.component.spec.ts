import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyIconModule } from '@skyux/indicators';

import { FontLoadingComponent } from './font-loading.component';

describe('FontLoadingComponent', () => {
  let component: FontLoadingComponent;
  let fixture: ComponentFixture<FontLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FontLoadingComponent],
      imports: [SkyIconModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FontLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

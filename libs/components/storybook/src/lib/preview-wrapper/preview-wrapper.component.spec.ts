import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyThemeModule, SkyThemeService } from '@skyux/theme';

import { PreviewWrapperComponent } from './preview-wrapper.component';

describe('PreviewWrapperComponent', () => {
  let component: PreviewWrapperComponent;
  let fixture: ComponentFixture<PreviewWrapperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreviewWrapperComponent],
      imports: [SkyThemeModule],
      providers: [SkyThemeService],
    });
    fixture = TestBed.createComponent(PreviewWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { SkyProgressIndicatorModule } from '../progress-indicator.module';
import { SkyProgressIndicatorStatusMarkerComponent } from './progress-indicator-status-marker.component';

describe('Progress indicator status marker', () => {
  it('should not error when theme service is not provided', () => {
    TestBed.configureTestingModule({
      imports: [SkyProgressIndicatorModule],
    });

    expect(() => {
      const fixture = TestBed.createComponent(
        SkyProgressIndicatorStatusMarkerComponent
      );
      fixture.detectChanges();
    }).not.toThrowError();
  });
});

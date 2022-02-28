import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SkyLabelModule } from '@skyux/indicators';

import { SkyLabelFixture } from './label-fixture';

//#region Test component
@Component({
  selector: 'sky-label-test',
  template: `
    <sky-label [labelType]="labelType" data-sky-id="test-label">
      This is a sample label.
    </sky-label>
  `,
})
class TestComponent {
  public labelType = 'warning';
}
//#endregion Test component

describe('Label fixture', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [SkyLabelModule],
    });
  });

  it('should expose the expected properties', () => {
    const fixture = TestBed.createComponent(TestComponent);

    fixture.detectChanges();

    const label = new SkyLabelFixture(fixture, 'test-label');

    expect(label.labelType).toBe('warning');
    expect(label.text).toBe('This is a sample label.');

    const validLabelTypes = ['info', 'success', 'warning', 'danger'];

    for (const validLabelType of validLabelTypes) {
      fixture.componentInstance.labelType = validLabelType;

      fixture.detectChanges();

      expect(label.labelType).toBe(validLabelType);
    }

    fixture.componentInstance.labelType = 'invalid';

    fixture.detectChanges();

    expect(label.labelType).toBeUndefined();
  });
});

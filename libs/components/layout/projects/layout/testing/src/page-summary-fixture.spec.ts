import {
  TestBed
} from '@angular/core/testing';

import {
  Component
} from '@angular/core';

import {
  SkyPageSummaryModule
} from '@skyux/layout';

import {
  SkyPageSummaryFixture
} from './page-summary-fixture';

//#region Test component
@Component({
  selector: 'page-summary-test',
  template: `
<sky-page-summary data-sky-id="test-page-summary">
  <sky-page-summary-title>
    {{name}}
  </sky-page-summary-title>
  <sky-page-summary-subtitle>
    Board member
  </sky-page-summary-subtitle>
  <sky-page-summary-content>
    Sample content
  </sky-page-summary-content>
</sky-page-summary>
  `
})
class TestComponent {

  public name = 'Robert C. Hernandez';

}
//#endregion Test component

describe('Page summary fixture', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestComponent
      ],
      imports: [
        SkyPageSummaryModule
      ]
    });
  });

  it('should expose the expected properties', () => {
    const fixture = TestBed.createComponent(
      TestComponent
    );

    fixture.detectChanges();

    const card = new SkyPageSummaryFixture(
      fixture,
      'test-page-summary'
    );

    expect(card.titleText).toBe('Robert C. Hernandez');
    expect(card.subtitleText).toBe('Board member');
    expect(card.contentText).toBe('Sample content');
  });

});

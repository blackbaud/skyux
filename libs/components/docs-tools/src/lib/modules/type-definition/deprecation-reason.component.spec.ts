import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { expect, expectAsync } from '@skyux-sdk/testing';

import { SkyDocsDeprecationReasonComponent } from './deprecation-reason.component';
import { SkyDocsTypeDefinitionAnchorIdsService } from './type-anchor-ids.service';

describe('Deprecation reason component', () => {
  let fixture: ComponentFixture<SkyDocsDeprecationReasonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), SkyDocsTypeDefinitionAnchorIdsService],
    });

    fixture = TestBed.createComponent(SkyDocsDeprecationReasonComponent);
  });

  it('should render markdown inline code as code components', async () => {
    fixture.componentRef.setInput('message', 'Use `bar` instead.');
    fixture.detectChanges();
    await fixture.whenStable();

    const codeEl = (fixture.nativeElement as HTMLElement).querySelector(
      'sky-code code',
    );

    expect(codeEl).toHaveText('bar');
  });

  describe('a11y', () => {
    it('should be accessible', async () => {
      fixture.componentRef.setInput('message', 'Use `bar` instead.');
      fixture.detectChanges();
      await fixture.whenStable();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });
});

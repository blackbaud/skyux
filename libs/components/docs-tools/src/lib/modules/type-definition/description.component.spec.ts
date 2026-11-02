import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params } from '@angular/router';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyAppWindowRef, SkyLogService } from '@skyux/core';

import { BehaviorSubject } from 'rxjs';

import { SkyDocsTypeDefinitionDescriptionComponent } from './description.component';
import { SkyDocsTypeDefinitionAnchorIdsService } from './type-anchor-ids.service';

describe('Type definition description component', () => {
  let fixture: ComponentFixture<SkyDocsTypeDefinitionDescriptionComponent>;
  let logSvc: jasmine.SpyObj<SkyLogService>;
  let queryParams: BehaviorSubject<Params>;
  let windowLocation: { href: string };

  function getCodeElements(): HTMLElement[] {
    return Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>(
        'sky-code code',
      ),
    );
  }

  async function render(description: string): Promise<void> {
    fixture.componentRef.setInput('definitionName', 'SkyFooComponent');
    fixture.componentRef.setInput('description', description);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(() => {
    logSvc = jasmine.createSpyObj<SkyLogService>('SkyLogService', ['error']);
    queryParams = new BehaviorSubject<Params>({});
    windowLocation = { href: 'https://example.com/docs#top' };

    TestBed.configureTestingModule({
      providers: [
        SkyDocsTypeDefinitionAnchorIdsService,
        { provide: ActivatedRoute, useValue: { queryParams } },
        {
          provide: SkyAppWindowRef,
          useValue: { nativeWindow: { location: windowLocation } },
        },
        { provide: SkyLogService, useValue: logSvc },
      ],
    });

    TestBed.inject(SkyDocsTypeDefinitionAnchorIdsService).updateAnchorIds({
      SkyBarComponent: 'sky-bar-component',
      SkyFooComponent: 'sky-foo-component',
    });

    fixture = TestBed.createComponent(
      SkyDocsTypeDefinitionDescriptionComponent,
    );
  });

  it('should render markdown inline code as code components', async () => {
    await render('Set `foo` to `"bar"`.');

    const codeEls = getCodeElements();

    expect(codeEls.length).toBe(2);
    expect(codeEls[0]).toHaveText('foo');
    expect(codeEls[1]).toHaveText('"bar"');
    expect(
      (fixture.nativeElement as HTMLElement).querySelector(
        'code.sky-docs-codespan',
      ),
    ).toBeNull();
  });

  it('should keep code components across change detection', async () => {
    await render('Set `foo`.');

    const codeEl = getCodeElements()[0];

    fixture.detectChanges();
    await fixture.whenStable();

    expect(getCodeElements()).toEqual([codeEl]);
  });

  it('should upgrade inline code when the description changes', async () => {
    await render('Set `foo`.');
    await render('Set `bar` or `baz`.');

    const codeEls = getCodeElements();

    expect(codeEls.length).toBe(2);
    expect(codeEls[0]).toHaveText('bar');
    expect(codeEls[1]).toHaveText('baz');
  });

  it('should link known types inside code components', async () => {
    await render('Emits a `SkyBarComponent` instance.');

    const link = getCodeElements()[0].querySelector('a');

    expect(link).toHaveText('SkyBarComponent');
    expect(link?.getAttribute('href')).toBe(
      'https://example.com/docs#sky-bar-component',
    );
  });

  it('should not link the type being described', async () => {
    await render('Extends `SkyFooComponent`.');

    expect(getCodeElements()[0].querySelector('a')).toBeNull();
  });

  it('should log an error for an unregistered SKY UX type', async () => {
    await render('Emits a `SkyBazComponent` instance.');

    expect(logSvc.error).toHaveBeenCalledWith(
      jasmine.stringContaining('[[ SkyBazComponent ]]'),
    );
  });

  it('should update type links when the query params change', async () => {
    await render('Emits a `SkyBarComponent` instance.');

    windowLocation.href = 'https://example.com/docs?theme=modern';
    queryParams.next({ theme: 'modern' });
    fixture.detectChanges();
    await fixture.whenStable();

    expect(getCodeElements()[0].querySelector('a')?.getAttribute('href')).toBe(
      'https://example.com/docs?theme=modern#sky-bar-component',
    );
  });

  describe('a11y', () => {
    it('should be accessible', async () => {
      await render('Set `foo` to a `SkyBarComponent`.');

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });
});

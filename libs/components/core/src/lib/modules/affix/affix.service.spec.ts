import { Component, ElementRef, ViewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { SkyAffixService } from './affix.service';
import { SkyAffixer } from './affixer';

@Component({
  selector: 'test-cmp',
  template: '<div #target></div>',
  standalone: false,
})
class TestComponent {
  @ViewChild('target', { static: true })
  public target!: ElementRef;
}

async function setupTest() {
  await TestBed.configureTestingModule({
    declarations: [TestComponent],
  }).compileComponents();

  const fixture = TestBed.createComponent(TestComponent);

  const affixService = TestBed.inject(SkyAffixService);

  return { affixService, fixture };
}

describe('Affix service', () => {
  it('should create an affixer', async () => {
    const { affixService, fixture } = await setupTest();

    fixture.detectChanges();

    const affixer = affixService.createAffixer(
      fixture.componentInstance.target,
    );

    expect(affixer).toEqual(jasmine.any(SkyAffixer));
  });

  it('should handle invalid base element', async () => {
    const { affixService, fixture } = await setupTest();

    fixture.detectChanges();

    const affixer = affixService.createAffixer(
      fixture.componentInstance.target,
    );

    // Use 'any' to force the invalid element through.
    expect(() =>
      affixer.affixTo(undefined as any, { enableAutoFit: true }),
    ).not.toThrow();
  });
});

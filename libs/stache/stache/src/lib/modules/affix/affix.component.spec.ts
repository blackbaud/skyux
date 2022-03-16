import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { SkyAppTestUtility, expect } from '@skyux-sdk/testing';

import { AffixFixtureComponent } from './fixtures/affix.component.fixture';
import { AffixFixtureModule } from './fixtures/affix.module.fixture';

describe('StacheAffixComponent', () => {
  let component: AffixFixtureComponent;
  let fixture: ComponentFixture<AffixFixtureComponent>;

  function detectChanges(): void {
    fixture.detectChanges();
    tick();
  }

  function getAffixElement(): any {
    return fixture.nativeElement.querySelector('.stache-affix');
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AffixFixtureModule],
    });

    fixture = TestBed.createComponent(AffixFixtureComponent);
    component = fixture.componentInstance;
  });

  it('should set defaults', fakeAsync(() => {
    detectChanges();
    const affixComponent = component.affixComponent;
    expect(affixComponent.minHeightFormatted).toEqual(
      `${fixture.nativeElement.offsetHeight}px`
    );
    expect(affixComponent.maxWidthFormatted).toEqual(`${window.innerWidth}px`);
  }));

  it('should set style properties on wrapping DIV', fakeAsync(() => {
    detectChanges();

    const affixElement = getAffixElement();

    expect(affixElement.style.minHeight).toBeDefined();
    expect(affixElement.style.maxWidth).toBeDefined();
    expect(affixElement.style.position).toBeDefined();
  }));

  it('should determine the position property from directive status', fakeAsync(() => {
    detectChanges();

    const affixComponent = component.affixComponent;

    let styles = affixComponent.getStyles();

    expect(styles.position).toEqual('static');

    affixComponent.affixTopDirective.isAffixed = true;
    detectChanges();

    styles = affixComponent.getStyles();

    expect(styles.position).toEqual('relative');
  }));

  it('should wrap transcluded content with the stacheAffixTop directive', fakeAsync(() => {
    detectChanges();

    const affixElement = getAffixElement();

    expect(
      affixElement.children[0].getAttribute('stacheaffixtop')
    ).toBeDefined();
  }));

  it('should set the minHeight and maxWidth on window resize', fakeAsync(() => {
    detectChanges();

    const affixComponent = component.affixComponent;

    expect(affixComponent.minHeightFormatted).toEqual(
      `${fixture.nativeElement.offsetHeight}px`
    );
    expect(affixComponent.maxWidthFormatted).toEqual(`${window.innerWidth}px`);

    spyOnProperty(
      affixComponent.wrapper.nativeElement,
      'offsetHeight',
      'get'
    ).and.returnValue(10);
    spyOnProperty(
      affixComponent.wrapper.nativeElement,
      'offsetWidth',
      'get'
    ).and.returnValue(20);

    SkyAppTestUtility.fireDomEvent(window, 'resize');
    detectChanges();

    expect(affixComponent.minHeightFormatted).toEqual('10px');
    expect(affixComponent.maxWidthFormatted).toEqual('20px');
  }));
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheAffixComponent } from './affix.component';
import { StacheAffixTestComponent } from './fixtures/affix.component.fixture';
import { StacheAffixTopDirective } from './affix-top.directive';

describe('StacheAffixComponent', () => {
  let component: StacheAffixComponent;
  let fixture: ComponentFixture<StacheAffixComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StacheAffixComponent,
        StacheAffixTestComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StacheAffixComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should format the wrapping DIVs minHeight', () => {
    fixture.componentInstance.ngAfterViewInit();
    expect(fixture.componentInstance.minHeightFormatted).toBeDefined();
  });

  it('should format the wrapping DIVs maxWidth', () => {
    fixture.componentInstance.ngAfterViewInit();
    expect(fixture.componentInstance.maxWidthFormatted).toBeDefined();
  });

  it('should transclude content', () => {
    const testFixture = TestBed.createComponent(StacheAffixTestComponent);
    const affixElement = testFixture.debugElement.query(By.css('.stache-affix')).nativeElement;
    expect(affixElement).toHaveText('This will be affixed.');
  });

  it('should add a min-height property to the wrapping DIV', () => {
    const testFixture = TestBed.createComponent(StacheAffixTestComponent);
    const affixElement = testFixture.debugElement.query(By.css('.stache-affix')).nativeElement;
    expect(affixElement.style.minHeight).toBeDefined();
  });

  it('should add a max-width property to the wrapping DIV', () => {
    const testFixture = TestBed.createComponent(StacheAffixTestComponent);
    const affixElement = testFixture.debugElement.query(By.css('.stache-affix')).nativeElement;
    expect(affixElement.style.maxWidth).toBeDefined();
  });

  it('should add a position property to the wrapping DIV', () => {
    const testFixture = TestBed.createComponent(StacheAffixTestComponent);
    const affixElement = testFixture.debugElement.query(By.css('.stache-affix')).nativeElement;
    expect(affixElement.style.position).toBeDefined();
  });

  it('should determine the position property from the directive status', () => {
    fixture.componentInstance.ngAfterViewInit();
    fixture.componentInstance.stacheAffixTop = {
      isAffixed: true
    } as StacheAffixTopDirective;

    fixture.detectChanges();
    let result = fixture.componentInstance.cssPosition();
    expect(result).toEqual('relative');

    fixture.detectChanges();
    fixture.componentInstance.stacheAffixTop.isAffixed = false;
    result = fixture.componentInstance.cssPosition();
    expect(result).toEqual('static');
  });

  it('should wrap transcluded content with the stacheAffixTop directive', () => {
    const testFixture = TestBed.createComponent(StacheAffixTestComponent);
    const affixElement = testFixture.debugElement.query(By.css('.stache-affix')).nativeElement;
    expect(affixElement.children[0].getAttribute('stacheaffixtop')).toBeDefined();
  });
});

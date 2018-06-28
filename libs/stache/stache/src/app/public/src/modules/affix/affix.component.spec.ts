import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheAffixComponent } from './affix.component';
import { StacheAffixTestComponent } from './fixtures/affix.component.fixture';
import { StacheAffixTopDirective } from './affix-top.directive';
import { StacheAffixModule } from './affix.module';
import { StacheWindowRef, StacheOmnibarAdapterService } from '../shared';
import { Subject } from 'rxjs';

class MockOmnibarService {
  public getHeight(): number {
    return 0;
  }
}

class MockWindowRef {
  public onResize$ = new Subject();
  public nativeWindow = {
    document: {
      body: document.createElement('div'),
      querySelector(selector: string) {
        if (selector === '.stache-footer-wrapper') {
          return document.createElement('div');
        }
      }
    }
  };
}

describe('StacheAffixComponent', () => {
  let mockWindowRef: any;
  let component: StacheAffixComponent;
  let fixture: ComponentFixture<StacheAffixComponent>;

  beforeEach(() => {
    mockWindowRef = new MockWindowRef();
    TestBed.configureTestingModule({
      imports: [
        StacheAffixModule
      ],
      declarations: [
        StacheAffixTestComponent
      ],
      providers: [
        { provide: StacheWindowRef, useValue: mockWindowRef },
        { provide: StacheOmnibarAdapterService, useClass: MockOmnibarService }
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
    fixture.detectChanges();
    expect(component.minHeightFormatted).toBeDefined();
  });

  it('should format the wrapping DIVs maxWidth', () => {
    fixture.detectChanges();
    expect(component.maxWidthFormatted).toBeDefined();
  });

  it('should add a min-height property to the wrapping DIV', () => {
    fixture.detectChanges();
    let affixElement = fixture.debugElement.query(By.css('.stache-affix')).nativeElement;
    expect(affixElement.style.minHeight).toBeDefined();
  });

  it('should add a max-width property to the wrapping DIV', () => {
    fixture.detectChanges();
    let affixElement = fixture.debugElement.query(By.css('.stache-affix')).nativeElement;
    expect(affixElement.style.maxWidth).toBeDefined();
  });

  it('should add a position property to the wrapping DIV', () => {
    fixture.detectChanges();
    let affixElement = fixture.debugElement.query(By.css('.stache-affix')).nativeElement;
    expect(affixElement.style.position).toBeDefined();
  });

  it('should determine the position property from the directive status', () => {
    fixture.componentInstance.ngAfterViewInit();
    fixture.componentInstance.affixTopDirective = {
      isAffixed: true
    } as StacheAffixTopDirective;

    fixture.detectChanges();
    let result = fixture.componentInstance.getStyles();
    expect(result.position).toEqual('relative');

    fixture.detectChanges();
    fixture.componentInstance.affixTopDirective.isAffixed = false;
    result = fixture.componentInstance.getStyles();
    expect(result.position).toEqual('static');
  });

  it('should wrap transcluded content with the stacheAffixTop directive', () => {
    fixture.detectChanges();
    let affixElement = fixture.debugElement.query(By.css('.stache-affix')).nativeElement;
    expect(affixElement.children[0].getAttribute('stacheaffixtop')).toBeDefined();
  });

  it('should set the minHeight and maxWidth on window resize', () => {
    component.wrapper = {
      nativeElement: {
        offsetHeight: 10,
        offsetWidth: 20
      }
    };
    mockWindowRef.onResize$.next();
    expect(component.minHeightFormatted).toEqual('10px');
    expect(component.maxWidthFormatted).toEqual('20px');
  });

  it('should not update the minHeight and maxWidth if no wrapper exists', () => {
    component.wrapper = undefined;
    mockWindowRef.onResize$.next();
    expect(component.minHeightFormatted).toEqual(undefined);
    expect(component.maxWidthFormatted).toEqual(undefined);
  });
});

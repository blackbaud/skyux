import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StachePageAnchorTestComponent } from './fixtures/page-anchor.component.fixture';
import { StachePageAnchorComponent } from './page-anchor.component';
import { StacheWindowRef } from '../shared';

describe('StachePageAnchorComponent', () => {
  let component: StachePageAnchorComponent;
  let fixture: ComponentFixture<StachePageAnchorComponent>;
  let debugElement: DebugElement;

  let testDebugElement: DebugElement;
  let testFixture: ComponentFixture<StachePageAnchorTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StachePageAnchorComponent,
        StachePageAnchorTestComponent
      ],
      imports: [
        RouterTestingModule
      ],
      providers: [
        StacheWindowRef
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StachePageAnchorComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    testFixture = TestBed.createComponent(StachePageAnchorTestComponent);
    testDebugElement = testFixture.debugElement;
  });

  it('should display transcluded content', () => {
    testFixture.detectChanges();
    const heading = testDebugElement.nativeElement.querySelector('.stache-page-anchor-heading');
    expect(heading).toHaveText('Test Content');
  });

  it('should add the fragment as an id to the element', () => {
    testFixture.detectChanges();
    const id = testDebugElement.nativeElement
      .querySelector('.stache-page-anchor')
      .getAttribute('id');
    expect(id).toBe('test-content');
  });

  it('should call the addHashToUrl method when the icon is clicked', async(() => {
    spyOn(component, 'addHashToUrl');
    const icon = debugElement.nativeElement.querySelector('.stache-page-anchor-icon');
    icon.click();
    fixture.whenStable()
      .then(() => {
        expect(component.addHashToUrl).toHaveBeenCalled();
      });
  }));

  it('should call scrollIntoView on the heading when clicked', async(() => {
    spyOn(debugElement.nativeElement, 'scrollIntoView');
    component.addHashToUrl();
    fixture.whenStable()
      .then(() => {
        expect(debugElement.nativeElement.scrollIntoView).toHaveBeenCalled();
      });
  }));
});

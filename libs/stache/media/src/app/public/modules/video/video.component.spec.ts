import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
   DebugElement
} from '@angular/core';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyVideoComponent
} from './video.component';

describe('SkyVideoComponent', () => {
  let component: SkyVideoComponent;
  let fixture: ComponentFixture<SkyVideoComponent>;
  let debugElement: DebugElement;
  let videoSource = 'https://google.com';

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SkyVideoComponent
      ]
    });

    fixture = TestBed.createComponent(SkyVideoComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });

  it('should have a videoSource input', () => {
    component.videoSource = videoSource;
    fixture.detectChanges();
    expect(component.videoSource).toBe(videoSource);
  });

  it('should sanitize the source URL on init', () => {
    component.videoSource = videoSource;
    component.ngOnInit();
    fixture.detectChanges();

    const src = debugElement.nativeElement.querySelector('iframe').getAttribute('src');

    expect(src).toBe(videoSource);
  });

});

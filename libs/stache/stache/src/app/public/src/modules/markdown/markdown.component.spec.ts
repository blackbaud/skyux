import { ComponentFixture, TestBed } from '@angular/core/testing';

import { expect } from '@blackbaud/skyux-builder/runtime/testing/browser';

import { StacheMarkdownComponent } from './markdown.component';

describe('StacheMarkdownComponent', () => {
  let component: StacheMarkdownComponent;
  let fixture: ComponentFixture<StacheMarkdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StacheMarkdownComponent
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StacheMarkdownComponent);
    component = fixture.componentInstance;
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });
});

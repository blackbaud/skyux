import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { StacheMarkdownComponent } from './markdown.component';
import { StacheMarkdownModule } from './markdown.module';

describe('StacheMarkdownComponent', () => {
  let fixture: ComponentFixture<StacheMarkdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StacheMarkdownModule],
    }).compileComponents();

    fixture = TestBed.createComponent(StacheMarkdownComponent);
  });

  it('should render the component', () => {
    expect(fixture).toExist();
  });
});

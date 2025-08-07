import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyPageLinksComponent } from './page-links.component';

@Component({
  selector: 'sky-page-links-test',
  imports: [SkyPageLinksComponent],
  template: `<sky-page-links>Links.</sky-page-links>`,
})
class SkyPageLinksTestComponent {}

describe('PageLinksComponent', () => {
  let component: SkyPageLinksTestComponent;
  let fixture: ComponentFixture<SkyPageLinksTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyPageLinksTestComponent],
    });

    fixture = TestBed.createComponent(SkyPageLinksTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should sky-page-links as block element', () => {
    expect(component).toBeTruthy();
    const pageLinksEl = fixture.nativeElement.querySelector('sky-page-links');
    expect(getComputedStyle(pageLinksEl).display).toBe('block');
    expect(pageLinksEl.textContent).toContain('Links.');
  });
});

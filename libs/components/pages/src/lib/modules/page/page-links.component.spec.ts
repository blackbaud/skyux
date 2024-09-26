import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyLayoutHostService } from '@skyux/core';

import { SkyPageLinksComponent } from './page-links.component';

describe('PageLinksComponent', () => {
  let component: SkyPageLinksComponent;
  let fixture: ComponentFixture<SkyPageLinksComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyPageLinksComponent],
      providers: [SkyLayoutHostService],
    });

    fixture = TestBed.createComponent(SkyPageLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

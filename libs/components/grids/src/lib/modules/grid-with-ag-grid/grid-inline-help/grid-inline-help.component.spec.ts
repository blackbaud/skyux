import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyAgGridHeaderInfo } from '@skyux/ag-grid';

import { SkyGridInlineHelpComponent } from './grid-inline-help.component';

describe('SkyGridInlineHelpComponent', () => {
  let component: SkyGridInlineHelpComponent;
  let fixture: ComponentFixture<SkyGridInlineHelpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyGridInlineHelpComponent],
      providers: [
        {
          provide: SkyAgGridHeaderInfo,
          useValue: {
            column: undefined,
            context: undefined,
            displayName: 'Test',
          } as SkyAgGridHeaderInfo,
        },
      ],
    });
    fixture = TestBed.createComponent(SkyGridInlineHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

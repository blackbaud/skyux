import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { expectAsync } from '@skyux-sdk/testing';
import { SkyThemeService } from '@skyux/theme';

import { FieldHeightsComponent } from './field-heights.component';
import { FieldHeightsModule } from './field-heights.module';

describe('FieldHeightsComponent', () => {
  let component: FieldHeightsComponent;
  let fixture: ComponentFixture<FieldHeightsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FieldHeightsModule, NoopAnimationsModule],
      providers: [SkyThemeService],
    });

    fixture = TestBed.createComponent(FieldHeightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
    spyOn(console, 'log').and.stub();
    component.onSubmit();
    expect(console.log).toHaveBeenCalled();
    component.onAddButtonClicked();
    expect(console.log).toHaveBeenCalledWith('Add button clicked');
    expect(
      fixture.debugElement.query(
        By.css('[data-sky-id="character-counter-error"] > sky-status-indicator')
      )
    ).toBeNull();
    component.favoritesForm
      .get('favoriteWord')
      ?.setValue('test with long text');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(
      fixture.debugElement.query(
        By.css('[data-sky-id="character-counter-error"] > sky-status-indicator')
      )
    ).toBeTruthy();
  });

  it('should be accessible', async () => {
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});

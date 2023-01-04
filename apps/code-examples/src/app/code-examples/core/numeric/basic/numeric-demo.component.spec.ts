import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyNumericOptions } from '@skyux/core';

import { NumericDemoComponent } from './numeric-demo.component';
import { NumericDemoModule } from './numeric-demo.module';

describe('Basic numeric options', () => {
  let fixture: ComponentFixture<NumericDemoComponent>;

  async function setupTest(options?: {
    value1?: number;
    value2?: number;
    config?: SkyNumericOptions;
  }): Promise<void> {
    fixture = TestBed.createComponent(NumericDemoComponent);

    if (options?.value1 !== undefined) {
      fixture.componentInstance.defaultValue = options.value1;
    }

    if (options?.value2 !== undefined) {
      fixture.componentInstance.configuredValue = options.value2;
    }

    if (options?.config !== undefined) {
      fixture.componentInstance.numericOptions = options.config;
    }

    fixture.detectChanges();
    return fixture.whenStable().then();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NumericDemoModule],
    });
  });

  it('should show the expected number in the default format', async () => {
    await setupTest({ value1: 123456 });
    fixture.detectChanges();

    expect(
      fixture.debugElement
        .query(By.css('.default-value'))
        .nativeElement.innerText.trim()
    ).toBe('123.5K');
  });

  it('should show the expected number in a specified format', async () => {
    await setupTest({
      value2: 5000000,
      config: { truncate: false },
    });

    expect(
      fixture.debugElement
        .query(By.css('.configured-value'))
        .nativeElement.innerText.trim()
    ).toBe('5,000,000');
  });
});

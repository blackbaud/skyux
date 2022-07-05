import { TestBed } from '@angular/core/testing';

import { LookupHarnessTestModule } from './fixtures/lookup-harness-test.module';

describe('lookup harness', () => {
  async function setupTest() {
    await TestBed.configureTestingModule({
      imports: [LookupHarnessTestModule],
    }).compileComponents();
  }

  it('should', async () => {
    await setupTest();
  });
});

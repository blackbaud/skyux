import { SkyIdService } from './id.service';

describe('SkyIdService', () => {
  function setupTest() {
    const idService = new SkyIdService();
    return { idService };
  }

  it('should generate a unique ID', () => {
    const { idService } = setupTest();

    const id1 = idService.generateId();
    const id2 = idService.generateId();

    expect(id1).not.toEqual(id2);
  });

  it('should include a timestamp in the generated ID to avoid clashes across sessions', () => {
    spyOn(Date.prototype, 'getTime').and.returnValue(12345);

    const { idService } = setupTest();

    const id = idService.generateId();

    expect(id).toMatch(/sky-id-gen__12345__[0-9]+/);
  });
});

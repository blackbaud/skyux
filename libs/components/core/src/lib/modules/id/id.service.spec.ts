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
});

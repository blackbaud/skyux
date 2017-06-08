import { StacheJsonDataService } from './index';

describe('StacheJsonDataService', () => {
  it('should return all data', () => {
    const dataService = new StacheJsonDataService();
    let data = dataService.getAll();
    expect(data.global.productNameLong).toBe('Stache 2');
  });

  it('should return data from a specific name', () => {
    const dataService = new StacheJsonDataService();
    let data = dataService.getByName('global');
    expect(data.productNameLong).toBe('Stache 2');
  });

  it('should return undefined if the name does not exist', () => {
    const dataService = new StacheJsonDataService();
    let data = dataService.getByName('invalid');
    expect(data).not.toBeDefined();
  });
});

export interface DataGridDataManagerRow {
  id: string;
  name: string;
  type: string;
  color: string;
  quantity: number;
}

export const DATA_GRID_DEMO_DATA: DataGridDataManagerRow[] = [
  { id: '1', name: 'Apple', type: 'Pome', color: 'Red', quantity: 12 },
  { id: '2', name: 'Banana', type: 'Berry', color: 'Yellow', quantity: 8 },
  { id: '3', name: 'Cherry', type: 'Drupe', color: 'Red', quantity: 45 },
  { id: '4', name: 'Daikon', type: 'Root', color: 'White', quantity: 3 },
  { id: '5', name: 'Edamame', type: 'Legume', color: 'Green', quantity: 22 },
  { id: '6', name: 'Fig', type: 'Syconium', color: 'Purple', quantity: 17 },
  { id: '7', name: 'Grape', type: 'Berry', color: 'Green', quantity: 60 },
];

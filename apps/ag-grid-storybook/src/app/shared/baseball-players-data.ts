import { SkyCellType } from '@skyux/ag-grid';

import { ColDef } from 'ag-grid-community';

export const columnDefinitions: ColDef[] = [
  {
    field: 'id',
    colId: 'id',
    headerName: 'ID',
    hide: true,
  },
  {
    field: 'name',
    colId: 'name',
    headerName: 'Name',
    sortable: true,
    type: SkyCellType.Text,
    minWidth: 200,
  },
  ...[
    ['seasons_played', 'Seasons Played'],
    ['all-star', 'All-Star'],
    ['triplecrown', 'Triple Crowns'],
    ['mvp', 'MVPs'],
    ['cya', 'CYA'],
  ].map(([field, headerName]) => ({
    field,
    colId: field,
    headerName,
    sortable: true,
    type: SkyCellType.Number,
    minWidth: 100,
  })),
  ...[
    ['3000h', '3000 Hits'],
    ['500hr', '500 Homeruns'],
    ['1500rbi', '1500 RBIs'],
    ['3000k', '3000 Ks'],
    ['300w', '300 Ws'],
    ['300sv', '300 SVs'],
  ].map(([field, headerName]) => ({
    field,
    colId: field,
    headerName,
    sortable: false,
    cellClass: 'booleanType',
    valueFormatter: (params) => (params.value ? 'Yes' : 'No'),
  })),
  {
    field: 'vote%',
    colId: 'vote%',
    headerName: 'Vote %',
    sortable: true,
    type: SkyCellType.Number,
    minWidth: 100,
    valueFormatter: (params) =>
      `${(Number(params.value) * 100).toPrecision(4)}%`,
  },
];

// Data derived from https://github.com/andrew-cui-zz/mlb-players-hof

export const data = [
  {
    id: 'aaronha01',
    name: 'Hank Aaron',
    seasons_played: 23,
    'all-star': 25,
    triplecrown: 0,
    mvp: 1,
    cya: 0,
    '3000h': true,
    '500hr': true,
    '1500rbi': true,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.978313253,
  },
  {
    id: 'alexape01',
    name: 'Pete Alexander',
    seasons_played: 21,
    'all-star': 0,
    triplecrown: 3,
    mvp: 0,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': true,
    '300sv': false,
    'vote%': 0.809160305,
  },
  {
    id: 'alomaro01',
    name: 'Roberto Alomar',
    seasons_played: 19,
    'all-star': 12,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.900172117,
  },
  {
    id: 'aparilu01',
    name: 'Luis Aparicio',
    seasons_played: 18,
    'all-star': 13,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.846153846,
  },
  {
    id: 'bankser01',
    name: 'Ernie Banks',
    seasons_played: 19,
    'all-star': 14,
    triplecrown: 0,
    mvp: 2,
    cya: 0,
    '3000h': false,
    '500hr': true,
    '1500rbi': true,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.838120104,
  },
  {
    id: 'benchjo01',
    name: 'Johnny Bench',
    seasons_played: 17,
    'all-star': 14,
    triplecrown: 0,
    mvp: 2,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.964205817,
  },
  {
    id: 'berrayo01',
    name: 'Yogi Berra',
    seasons_played: 19,
    'all-star': 18,
    triplecrown: 0,
    mvp: 3,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.856060606,
  },
  {
    id: 'biggicr01',
    name: 'Craig Biggio',
    seasons_played: 20,
    'all-star': 7,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': true,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.826958106,
  },
  {
    id: 'blylebe01',
    name: 'Bert Blyleven',
    seasons_played: 24,
    'all-star': 2,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': true,
    '300w': false,
    '300sv': false,
    'vote%': 0.796901893,
  },
  {
    id: 'boggswa01',
    name: 'Wade Boggs',
    seasons_played: 18,
    'all-star': 12,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': true,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.918604651,
  },
  {
    id: 'boudrlo01',
    name: 'Lou Boudreau',
    seasons_played: 15,
    'all-star': 8,
    triplecrown: 0,
    mvp: 1,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.773333333,
  },
  {
    id: 'brettge01',
    name: 'George Brett',
    seasons_played: 21,
    'all-star': 13,
    triplecrown: 0,
    mvp: 1,
    cya: 0,
    '3000h': true,
    '500hr': false,
    '1500rbi': true,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.981891348,
  },
  {
    id: 'brocklo01',
    name: 'Lou Brock',
    seasons_played: 20,
    'all-star': 6,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': true,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.797468354,
  },
  {
    id: 'camparo01',
    name: 'Roy Campanella',
    seasons_played: 10,
    'all-star': 8,
    triplecrown: 0,
    mvp: 3,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.794117647,
  },
  {
    id: 'carewro01',
    name: 'Rod Carew',
    seasons_played: 19,
    'all-star': 18,
    triplecrown: 0,
    mvp: 1,
    cya: 0,
    '3000h': true,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.905191874,
  },
  {
    id: 'carltst01',
    name: 'Steve Carlton',
    seasons_played: 27,
    'all-star': 10,
    triplecrown: 1,
    mvp: 0,
    cya: 4,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': true,
    '300w': true,
    '300sv': false,
    'vote%': 0.956140351,
  },
  {
    id: 'cartega01',
    name: 'Gary Carter',
    seasons_played: 19,
    'all-star': 11,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.780241935,
  },
  {
    id: 'cobbty01',
    name: 'Ty Cobb',
    seasons_played: 24,
    'all-star': 0,
    triplecrown: 1,
    mvp: 1,
    cya: 0,
    '3000h': true,
    '500hr': false,
    '1500rbi': true,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.982300885,
  },
  {
    id: 'cochrmi01',
    name: 'Mickey Cochrane',
    seasons_played: 13,
    'all-star': 2,
    triplecrown: 0,
    mvp: 2,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.795031056,
  },
  {
    id: 'collied01',
    name: 'Eddie Collins',
    seasons_played: 25,
    'all-star': 0,
    triplecrown: 0,
    mvp: 1,
    cya: 0,
    '3000h': true,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.777372263,
  },
  {
    id: 'cronijo01',
    name: 'Joe Cronin',
    seasons_played: 20,
    'all-star': 7,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.787564767,
  },
  {
    id: 'dawsoan01',
    name: 'Andre Dawson',
    seasons_played: 21,
    'all-star': 8,
    triplecrown: 0,
    mvp: 1,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': true,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.779220779,
  },
  {
    id: 'deandi01',
    name: 'Dizzy Dean',
    seasons_played: 12,
    'all-star': 4,
    triplecrown: 0,
    mvp: 1,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.791666667,
  },
  {
    id: 'dickebi01',
    name: 'Bill Dickey',
    seasons_played: 17,
    'all-star': 11,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.801587302,
  },
  {
    id: 'dimagjo01',
    name: 'Joe DiMaggio',
    seasons_played: 13,
    'all-star': 13,
    triplecrown: 0,
    mvp: 3,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': true,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.888446215,
  },
  {
    id: 'drysddo01',
    name: 'Don Drysdale',
    seasons_played: 14,
    'all-star': 9,
    triplecrown: 0,
    mvp: 0,
    cya: 1,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.784119107,
  },
  {
    id: 'eckerde01',
    name: 'Dennis Eckersley',
    seasons_played: 25,
    'all-star': 6,
    triplecrown: 0,
    mvp: 1,
    cya: 1,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': true,
    'vote%': 0.83201581,
  },
  {
    id: 'fellebo01',
    name: 'Bob Feller',
    seasons_played: 18,
    'all-star': 8,
    triplecrown: 1,
    mvp: 0,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.9375,
  },
  {
    id: 'fingero01',
    name: 'Rollie Fingers',
    seasons_played: 17,
    'all-star': 7,
    triplecrown: 0,
    mvp: 1,
    cya: 1,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': true,
    'vote%': 0.811627907,
  },
  {
    id: 'fiskca01',
    name: 'Carlton Fisk',
    seasons_played: 24,
    'all-star': 11,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.795591182,
  },
  {
    id: 'fordwh01',
    name: 'Whitey Ford',
    seasons_played: 16,
    'all-star': 10,
    triplecrown: 0,
    mvp: 0,
    cya: 1,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.778082192,
  },
  {
    id: 'foxxji01',
    name: 'Jimmie Foxx',
    seasons_played: 21,
    'all-star': 9,
    triplecrown: 1,
    mvp: 3,
    cya: 0,
    '3000h': false,
    '500hr': true,
    '1500rbi': true,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.792035398,
  },
  {
    id: 'friscfr01',
    name: 'Frankie Frisch',
    seasons_played: 19,
    'all-star': 3,
    triplecrown: 0,
    mvp: 1,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.844720497,
  },
  {
    id: 'gibsobo01',
    name: 'Bob Gibson',
    seasons_played: 17,
    'all-star': 9,
    triplecrown: 0,
    mvp: 1,
    cya: 2,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': true,
    '300w': false,
    '300sv': false,
    'vote%': 0.840399002,
  },
  {
    id: 'glavito02',
    name: 'Tom Glavine',
    seasons_played: 22,
    'all-star': 10,
    triplecrown: 0,
    mvp: 0,
    cya: 2,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': true,
    '300sv': false,
    'vote%': 0.91943958,
  },
  {
    id: 'gossari01',
    name: 'Rich Gossage',
    seasons_played: 23,
    'all-star': 9,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': true,
    'vote%': 0.858195212,
  },
  {
    id: 'greenha01',
    name: 'Hank Greenberg',
    seasons_played: 13,
    'all-star': 5,
    triplecrown: 0,
    mvp: 2,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.849740933,
  },
  {
    id: 'grovele01',
    name: 'Lefty Grove',
    seasons_played: 17,
    'all-star': 6,
    triplecrown: 2,
    mvp: 1,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': true,
    '300sv': false,
    'vote%': 0.763975155,
  },
  {
    id: 'gwynnto01',
    name: 'Tony Gwynn',
    seasons_played: 20,
    'all-star': 15,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': true,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.976146789,
  },
  {
    id: 'hartnga01',
    name: 'Gabby Hartnett',
    seasons_played: 20,
    'all-star': 6,
    triplecrown: 0,
    mvp: 1,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.77689243,
  },
  {
    id: 'heilmha01',
    name: 'Harry Heilmann',
    seasons_played: 17,
    'all-star': 0,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': true,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.867521368,
  },
  {
    id: 'henderi01',
    name: 'Rickey Henderson',
    seasons_played: 29,
    'all-star': 10,
    triplecrown: 0,
    mvp: 1,
    cya: 0,
    '3000h': true,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.948051948,
  },
  {
    id: 'hornsro01',
    name: 'Rogers Hornsby',
    seasons_played: 24,
    'all-star': 0,
    triplecrown: 2,
    mvp: 2,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': true,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.78111588,
  },
  {
    id: 'hubbeca01',
    name: 'Carl Hubbell',
    seasons_played: 16,
    'all-star': 9,
    triplecrown: 0,
    mvp: 2,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.869565217,
  },
  {
    id: 'hunteca01',
    name: 'Catfish Hunter',
    seasons_played: 15,
    'all-star': 8,
    triplecrown: 0,
    mvp: 0,
    cya: 1,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.762711864,
  },
  {
    id: 'jacksre01',
    name: 'Reggie Jackson',
    seasons_played: 21,
    'all-star': 14,
    triplecrown: 0,
    mvp: 1,
    cya: 0,
    '3000h': false,
    '500hr': true,
    '1500rbi': true,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.936170213,
  },
  {
    id: 'jenkife01',
    name: 'Fergie Jenkins',
    seasons_played: 20,
    'all-star': 3,
    triplecrown: 0,
    mvp: 0,
    cya: 1,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': true,
    '300w': false,
    '300sv': false,
    'vote%': 0.753950339,
  },
  {
    id: 'johnsra05',
    name: 'Randy Johnson',
    seasons_played: 24,
    'all-star': 10,
    triplecrown: 1,
    mvp: 0,
    cya: 5,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': true,
    '300w': true,
    '300sv': false,
    'vote%': 0.972677596,
  },
  {
    id: 'johnswa01',
    name: 'Walter Johnson',
    seasons_played: 21,
    'all-star': 0,
    triplecrown: 3,
    mvp: 2,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': true,
    '300w': true,
    '300sv': false,
    'vote%': 0.836283186,
  },
  {
    id: 'kalinal01',
    name: 'Al Kaline',
    seasons_played: 22,
    'all-star': 18,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': true,
    '500hr': false,
    '1500rbi': true,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.883116883,
  },
  {
    id: 'keelewi01',
    name: 'Willie Keeler',
    seasons_played: 20,
    'all-star': 0,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.755474453,
  },
  {
    id: 'killeha01',
    name: 'Harmon Killebrew',
    seasons_played: 22,
    'all-star': 13,
    triplecrown: 0,
    mvp: 1,
    cya: 0,
    '3000h': false,
    '500hr': true,
    '1500rbi': true,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.831265509,
  },
  {
    id: 'kinerra01',
    name: 'Ralph Kiner',
    seasons_played: 11,
    'all-star': 6,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.754143646,
  },
  {
    id: 'koufasa01',
    name: 'Sandy Koufax',
    seasons_played: 12,
    'all-star': 7,
    triplecrown: 3,
    mvp: 1,
    cya: 3,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.868686869,
  },
  {
    id: 'lajoina01',
    name: 'Nap Lajoie',
    seasons_played: 22,
    'all-star': 0,
    triplecrown: 1,
    mvp: 0,
    cya: 0,
    '3000h': true,
    '500hr': false,
    '1500rbi': true,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.835820896,
  },
  {
    id: 'larkiba01',
    name: 'Barry Larkin',
    seasons_played: 19,
    'all-star': 12,
    triplecrown: 0,
    mvp: 1,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.863874346,
  },
  {
    id: 'lemonbo01',
    name: 'Bob Lemon',
    seasons_played: 15,
    'all-star': 7,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.786082474,
  },
  {
    id: 'lyonste01',
    name: 'Ted Lyons',
    seasons_played: 21,
    'all-star': 1,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.864541833,
  },
  {
    id: 'maddugr01',
    name: 'Greg Maddux',
    seasons_played: 25,
    'all-star': 8,
    triplecrown: 0,
    mvp: 0,
    cya: 4,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': true,
    '300w': true,
    '300sv': false,
    'vote%': 0.971978984,
  },
  {
    id: 'mantlmi01',
    name: 'Mickey Mantle',
    seasons_played: 18,
    'all-star': 20,
    triplecrown: 1,
    mvp: 3,
    cya: 0,
    '3000h': false,
    '500hr': true,
    '1500rbi': true,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.882191781,
  },
  {
    id: 'maranra01',
    name: 'Rabbit Maranville',
    seasons_played: 23,
    'all-star': 0,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.829365079,
  },
  {
    id: 'maricju01',
    name: 'Juan Marichal',
    seasons_played: 16,
    'all-star': 10,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.836898396,
  },
  {
    id: 'martipe02',
    name: 'Pedro Martinez',
    seasons_played: 18,
    'all-star': 8,
    triplecrown: 1,
    mvp: 0,
    cya: 3,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': true,
    '300w': false,
    '300sv': false,
    'vote%': 0.910746812,
  },
  {
    id: 'mathech01',
    name: 'Christy Mathewson',
    seasons_played: 18,
    'all-star': 0,
    triplecrown: 2,
    mvp: 0,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': true,
    '300sv': false,
    'vote%': 0.907079646,
  },
  {
    id: 'matheed01',
    name: 'Eddie Mathews',
    seasons_played: 18,
    'all-star': 12,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': false,
    '500hr': true,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.794195251,
  },
  {
    id: 'mayswi01',
    name: 'Willie Mays',
    seasons_played: 23,
    'all-star': 24,
    triplecrown: 0,
    mvp: 2,
    cya: 0,
    '3000h': true,
    '500hr': true,
    '1500rbi': true,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.946759259,
  },
  {
    id: 'mccovwi01',
    name: 'Willie McCovey',
    seasons_played: 23,
    'all-star': 6,
    triplecrown: 0,
    mvp: 1,
    cya: 0,
    '3000h': false,
    '500hr': true,
    '1500rbi': true,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.814117647,
  },
  {
    id: 'medwijo01',
    name: 'Joe Medwick',
    seasons_played: 20,
    'all-star': 10,
    triplecrown: 1,
    mvp: 1,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.848056537,
  },
  {
    id: 'molitpa01',
    name: 'Paul Molitor',
    seasons_played: 21,
    'all-star': 7,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': true,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.851778656,
  },
  {
    id: 'morgajo02',
    name: 'Joe Morgan',
    seasons_played: 22,
    'all-star': 10,
    triplecrown: 0,
    mvp: 2,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.817567568,
  },
  {
    id: 'murraed02',
    name: 'Eddie Murray',
    seasons_played: 23,
    'all-star': 8,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': true,
    '500hr': true,
    '1500rbi': true,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.852822581,
  },
  {
    id: 'musiast01',
    name: 'Stan Musial',
    seasons_played: 22,
    'all-star': 24,
    triplecrown: 0,
    mvp: 3,
    cya: 0,
    '3000h': true,
    '500hr': false,
    '1500rbi': true,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.932352941,
  },
  {
    id: 'niekrph01',
    name: 'Phil Niekro',
    seasons_played: 26,
    'all-star': 5,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': true,
    '300w': true,
    '300sv': false,
    'vote%': 0.803382664,
  },
  {
    id: 'ottme01',
    name: 'Mel Ott',
    seasons_played: 22,
    'all-star': 12,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': false,
    '500hr': true,
    '1500rbi': true,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.871681416,
  },
  {
    id: 'palmeji01',
    name: 'Jim Palmer',
    seasons_played: 19,
    'all-star': 6,
    triplecrown: 0,
    mvp: 0,
    cya: 3,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.925675676,
  },
  {
    id: 'pennohe01',
    name: 'Herb Pennock',
    seasons_played: 23,
    'all-star': 0,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.776859504,
  },
  {
    id: 'perezto01',
    name: 'Tony Perez',
    seasons_played: 23,
    'all-star': 7,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': true,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.771543086,
  },
  {
    id: 'perryga01',
    name: 'Gaylord Perry',
    seasons_played: 25,
    'all-star': 5,
    triplecrown: 0,
    mvp: 0,
    cya: 2,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': true,
    '300w': true,
    '300sv': false,
    'vote%': 0.772009029,
  },
  {
    id: 'piazzmi01',
    name: 'Mike Piazza',
    seasons_played: 18,
    'all-star': 12,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.829545455,
  },
  {
    id: 'puckeki01',
    name: 'Kirby Puckett',
    seasons_played: 12,
    'all-star': 10,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.821359223,
  },
  {
    id: 'riceji01',
    name: 'Jim Rice',
    seasons_played: 16,
    'all-star': 8,
    triplecrown: 0,
    mvp: 1,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.764378479,
  },
  {
    id: 'ripkeca01',
    name: 'Cal Ripken',
    seasons_played: 21,
    'all-star': 19,
    triplecrown: 0,
    mvp: 2,
    cya: 0,
    '3000h': true,
    '500hr': false,
    '1500rbi': true,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.985321101,
  },
  {
    id: 'roberro01',
    name: 'Robin Roberts',
    seasons_played: 21,
    'all-star': 7,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.868556701,
  },
  {
    id: 'robinbr01',
    name: 'Brooks Robinson',
    seasons_played: 23,
    'all-star': 18,
    triplecrown: 0,
    mvp: 1,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.919786096,
  },
  {
    id: 'robinfr02',
    name: 'Frank Robinson',
    seasons_played: 22,
    'all-star': 14,
    triplecrown: 1,
    mvp: 2,
    cya: 0,
    '3000h': false,
    '500hr': true,
    '1500rbi': true,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.891566265,
  },
  {
    id: 'robinja02',
    name: 'Jackie Robinson',
    seasons_played: 10,
    'all-star': 6,
    triplecrown: 0,
    mvp: 1,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.775,
  },
  {
    id: 'ruthba01',
    name: 'Babe Ruth',
    seasons_played: 22,
    'all-star': 2,
    triplecrown: 0,
    mvp: 1,
    cya: 0,
    '3000h': false,
    '500hr': true,
    '1500rbi': true,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.951327434,
  },
  {
    id: 'ryanno01',
    name: 'Nolan Ryan',
    seasons_played: 27,
    'all-star': 8,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': true,
    '300w': true,
    '300sv': false,
    'vote%': 0.987927565,
  },
  {
    id: 'sandbry01',
    name: 'Ryne Sandberg',
    seasons_played: 16,
    'all-star': 10,
    triplecrown: 0,
    mvp: 1,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.761627907,
  },
  {
    id: 'schmimi01',
    name: 'Mike Schmidt',
    seasons_played: 18,
    'all-star': 12,
    triplecrown: 0,
    mvp: 3,
    cya: 0,
    '3000h': false,
    '500hr': true,
    '1500rbi': true,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.965217391,
  },
  {
    id: 'seaveto01',
    name: 'Tom Seaver',
    seasons_played: 22,
    'all-star': 12,
    triplecrown: 0,
    mvp: 0,
    cya: 3,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': true,
    '300w': true,
    '300sv': false,
    'vote%': 0.988372093,
  },
  {
    id: 'simmoal01',
    name: 'Al Simmons',
    seasons_played: 21,
    'all-star': 3,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': true,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.753787879,
  },
  {
    id: 'sislege01',
    name: 'George Sisler',
    seasons_played: 16,
    'all-star': 0,
    triplecrown: 0,
    mvp: 1,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.857664234,
  },
  {
    id: 'smithoz01',
    name: 'Ozzie Smith',
    seasons_played: 19,
    'all-star': 15,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.917372881,
  },
  {
    id: 'smoltjo01',
    name: 'John Smoltz',
    seasons_played: 22,
    'all-star': 8,
    triplecrown: 0,
    mvp: 0,
    cya: 1,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': true,
    '300w': false,
    '300sv': false,
    'vote%': 0.828779599,
  },
  {
    id: 'snidedu01',
    name: 'Duke Snider',
    seasons_played: 18,
    'all-star': 8,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.864935065,
  },
  {
    id: 'spahnwa01',
    name: 'Warren Spahn',
    seasons_played: 22,
    'all-star': 17,
    triplecrown: 0,
    mvp: 0,
    cya: 1,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': true,
    '300sv': false,
    'vote%': 0.831578947,
  },
  {
    id: 'speaktr01',
    name: 'Tris Speaker',
    seasons_played: 22,
    'all-star': 0,
    triplecrown: 0,
    mvp: 1,
    cya: 0,
    '3000h': true,
    '500hr': false,
    '1500rbi': true,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.820895522,
  },
  {
    id: 'stargwi01',
    name: 'Willie Stargell',
    seasons_played: 21,
    'all-star': 7,
    triplecrown: 0,
    mvp: 1,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': true,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.824355972,
  },
  {
    id: 'suttebr01',
    name: 'Bruce Sutter',
    seasons_played: 12,
    'all-star': 6,
    triplecrown: 0,
    mvp: 0,
    cya: 1,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': true,
    'vote%': 0.769230769,
  },
  {
    id: 'suttodo01',
    name: 'Don Sutton',
    seasons_played: 25,
    'all-star': 4,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': true,
    '300w': true,
    '300sv': false,
    'vote%': 0.816067653,
  },
  {
    id: 'terrybi01',
    name: 'Bill Terry',
    seasons_played: 14,
    'all-star': 3,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.773809524,
  },
  {
    id: 'thomafr04',
    name: 'Frank Thomas',
    seasons_played: 20,
    'all-star': 5,
    triplecrown: 0,
    mvp: 2,
    cya: 0,
    '3000h': false,
    '500hr': true,
    '1500rbi': true,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.837127846,
  },
  {
    id: 'traynpi01',
    name: 'Pie Traynor',
    seasons_played: 17,
    'all-star': 2,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.768595041,
  },
  {
    id: 'vanceda01',
    name: 'Dazzy Vance',
    seasons_played: 18,
    'all-star': 0,
    triplecrown: 1,
    mvp: 1,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.816733068,
  },
  {
    id: 'wagneho01',
    name: 'Honus Wagner',
    seasons_played: 21,
    'all-star': 0,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': true,
    '500hr': false,
    '1500rbi': true,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.951327434,
  },
  {
    id: 'wanerpa01',
    name: 'Paul Waner',
    seasons_played: 22,
    'all-star': 4,
    triplecrown: 0,
    mvp: 1,
    cya: 0,
    '3000h': true,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.833333333,
  },
  {
    id: 'wilheho01',
    name: 'Hoyt Wilhelm',
    seasons_played: 26,
    'all-star': 8,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.837974684,
  },
  {
    id: 'willibi01',
    name: 'Billy Williams',
    seasons_played: 18,
    'all-star': 6,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.857142857,
  },
  {
    id: 'willite01',
    name: 'Ted Williams',
    seasons_played: 19,
    'all-star': 19,
    triplecrown: 2,
    mvp: 2,
    cya: 0,
    '3000h': false,
    '500hr': true,
    '1500rbi': true,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.933774834,
  },
  {
    id: 'winfida01',
    name: 'Dave Winfield',
    seasons_played: 23,
    'all-star': 12,
    triplecrown: 0,
    mvp: 0,
    cya: 0,
    '3000h': true,
    '500hr': false,
    '1500rbi': true,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.844660194,
  },
  {
    id: 'wynnea01',
    name: 'Early Wynn',
    seasons_played: 23,
    'all-star': 8,
    triplecrown: 0,
    mvp: 0,
    cya: 1,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': true,
    '300sv': false,
    'vote%': 0.76010101,
  },
  {
    id: 'yastrca01',
    name: 'Carl Yastrzemski',
    seasons_played: 23,
    'all-star': 18,
    triplecrown: 1,
    mvp: 1,
    cya: 0,
    '3000h': true,
    '500hr': false,
    '1500rbi': true,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.946308725,
  },
  {
    id: 'youngcy01',
    name: 'Cy Young',
    seasons_played: 23,
    'all-star': 0,
    triplecrown: 1,
    mvp: 0,
    cya: 0,
    '3000h': false,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': true,
    '300sv': false,
    'vote%': 0.76119403,
  },
  {
    id: 'yountro01',
    name: 'Robin Yount',
    seasons_played: 20,
    'all-star': 3,
    triplecrown: 0,
    mvp: 2,
    cya: 0,
    '3000h': true,
    '500hr': false,
    '1500rbi': false,
    '3000k': false,
    '300w': false,
    '300sv': false,
    'vote%': 0.774647887,
  },
];

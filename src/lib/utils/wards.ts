// ─── Okhla Wards and Colonies Data ───────────────────────────

export interface Colony {
  id: string;
  name: string;
}

export interface Ward {
  id: string;
  name: string;
  number: string;
  description: string;
  center: [number, number];
  colonies: Colony[];
}

export const OKHLA_WARDS: Ward[] = [
  {
    id: 'sarita_vihar',
    name: 'Sarita Vihar',
    number: '187',
    description: 'Planned DDA pockets and adjacent villages near Mathura Road.',
    center: [28.5292, 77.2874],
    colonies: [
      { id: 'sarita_vihar_dda', name: 'Sarita Vihar (Pockets A-M)' },
      { id: 'ghaffar_manzil', name: 'Ghaffar Manzil (Incl. Ext I & II)' },
      { id: 'jasola_vihar', name: 'Jasola Village and Jasola Vihar' },
      { id: 'khizrabad', name: 'Khizrabad Village' },
      { id: 'taimoor_nagar', name: 'Taimoor Nagar' },
      { id: 'kalindi_colony', name: 'Kalindi Colony' },
    ],
  },
  {
    id: 'zakir_nagar',
    name: 'Zakir Nagar',
    number: '189',
    description: 'Older, densely populated sections bordering Jamia Millia Islamia.',
    center: [28.5633, 77.2828],
    colonies: [
      { id: 'zakir_nagar_main', name: 'Zakir Nagar (Main, West, Ext)' },
      { id: 'batla_house', name: 'Batla House' },
      { id: 'jogabai_ext', name: 'Jogabai Extension' },
      { id: 'okhla_village', name: 'Okhla Main Village' },
      { id: 'noor_nagar', name: 'Noor Nagar' },
    ],
  },
  {
    id: 'abul_fazal',
    name: 'Abul Fazal Enclave',
    number: '188',
    description: 'Residential enclaves along the Yamuna riverbank.',
    center: [28.5516, 77.2917],
    colonies: [
      { id: 'afe_p1_p2', name: 'Abul Fazal Enclave (Part I & II)' },
      { id: 'shaheen_bagh', name: 'Shaheen Bagh' },
      { id: 'okhla_vihar', name: 'Okhla Vihar' },
      { id: 'haji_colony', name: 'Haji Colony' },
      { id: 'taj_enclave', name: 'Taj Enclave' },
    ],
  },
  {
    id: 'madanpur_khadar_west',
    name: 'Madanpur Khadar West',
    number: '186',
    description: 'Original village settlements west of Kalindi Kunj bypass.',
    center: [28.5255, 77.3012],
    colonies: [
      { id: 'mk_village', name: 'Madanpur Khadar Village' },
      { id: 'aali_village', name: 'Aali Village and Extension' },
      { id: 'saurabh_vihar', name: 'Saurabh Vihar' },
      { id: 'harsh_vihar', name: 'Harsh Vihar' },
    ],
  },
  {
    id: 'madanpur_khadar_east',
    name: 'Madanpur Khadar East',
    number: '185',
    description: 'Organized resettlement colonies and JJ clusters near the riverbank.',
    center: [28.5122, 77.3155],
    colonies: [
      { id: 'mk_jj_colony', name: 'Madanpur Khadar JJ Colony (I, II, III)' },
      { id: 'mk_janta_flats', name: 'Madanpur Khadar Janta Flats' },
      { id: 'kanchan_kunj', name: 'Kanchan Kunj' },
      { id: 'srirampuri', name: 'Srirampuri' },
      { id: 'priyanka_camp', name: 'Priyanka Camp' },
    ],
  },
];

// Colombian departments and major cities with DANE codes
// DANE codes are required by Envia.com for shipping quotes in Colombia
// Format: { name: 'City Name', dane: 'DANE_CODE', department: 'DEPT_CODE' }

export const departments = [
  { code: 'AM', name: 'Amazonas' },
  { code: 'AN', name: 'Antioquia' },
  { code: 'AR', name: 'Arauca' },
  { code: 'AT', name: 'Atlántico' },
  { code: 'BO', name: 'Bolívar' },
  { code: 'BY', name: 'Boyacá' },
  { code: 'CL', name: 'Caldas' },
  { code: 'CQ', name: 'Caquetá' },
  { code: 'CS', name: 'Casanare' },
  { code: 'CA', name: 'Cauca' },
  { code: 'CE', name: 'Cesar' },
  { code: 'CH', name: 'Chocó' },
  { code: 'CO', name: 'Córdoba' },
  { code: 'CU', name: 'Cundinamarca' },
  { code: 'DC', name: 'Bogotá D.C.' },
  { code: 'GN', name: 'Guainía' },
  { code: 'GV', name: 'Guaviare' },
  { code: 'HU', name: 'Huila' },
  { code: 'LG', name: 'La Guajira' },
  { code: 'MA', name: 'Magdalena' },
  { code: 'ME', name: 'Meta' },
  { code: 'NA', name: 'Nariño' },
  { code: 'NS', name: 'Norte de Santander' },
  { code: 'PU', name: 'Putumayo' },
  { code: 'QD', name: 'Quindío' },
  { code: 'RI', name: 'Risaralda' },
  { code: 'SA', name: 'San Andrés y Providencia' },
  { code: 'SN', name: 'Santander' },
  { code: 'SU', name: 'Sucre' },
  { code: 'TO', name: 'Tolima' },
  { code: 'VC', name: 'Valle del Cauca' },
  { code: 'VP', name: 'Vaupés' },
  { code: 'VD', name: 'Vichada' }
]

// Major cities per department with DANE codes
// This covers the most common shipping destinations
// For a complete list, use Envia's Queries API: GET /city?country_code=CO&state_code=XX
export const citiesByDepartment = {
  DC: [
    { name: 'Bogotá', dane: '11001' }
  ],
  AN: [
    { name: 'Medellín', dane: '05001' },
    { name: 'Bello', dane: '05088' },
    { name: 'Itagüí', dane: '05360' },
    { name: 'Envigado', dane: '05266' },
    { name: 'Sabaneta', dane: '05631' },
    { name: 'Rionegro', dane: '05615' },
    { name: 'Apartadó', dane: '05045' },
    { name: 'Turbo', dane: '05837' },
    { name: 'Caucasia', dane: '05154' },
    { name: 'La Estrella', dane: '05380' },
    { name: 'Copacabana', dane: '05212' },
    { name: 'Caldas', dane: '05129' },
    { name: 'Marinilla', dane: '05440' },
    { name: 'La Ceja', dane: '05376' },
    { name: 'El Carmen de Viboral', dane: '05148' }
  ],
  AT: [
    { name: 'Barranquilla', dane: '08001' },
    { name: 'Soledad', dane: '08758' },
    { name: 'Malambo', dane: '08433' },
    { name: 'Sabanalarga', dane: '08638' }
  ],
  BO: [
    { name: 'Cartagena', dane: '13001' },
    { name: 'Magangué', dane: '13430' },
    { name: 'Turbaco', dane: '13836' }
  ],
  BY: [
    { name: 'Tunja', dane: '15001' },
    { name: 'Duitama', dane: '15238' },
    { name: 'Sogamoso', dane: '15759' },
    { name: 'Chiquinquirá', dane: '15176' }
  ],
  CL: [
    { name: 'Manizales', dane: '17001' },
    { name: 'La Dorada', dane: '17380' },
    { name: 'Chinchiná', dane: '17174' }
  ],
  CQ: [
    { name: 'Florencia', dane: '18001' }
  ],
  CS: [
    { name: 'Yopal', dane: '85001' },
    { name: 'Aguazul', dane: '85010' }
  ],
  CA: [
    { name: 'Popayán', dane: '19001' },
    { name: 'Santander de Quilichao', dane: '19698' }
  ],
  CE: [
    { name: 'Valledupar', dane: '20001' },
    { name: 'Aguachica', dane: '20011' }
  ],
  CO: [
    { name: 'Montería', dane: '23001' },
    { name: 'Lorica', dane: '23417' },
    { name: 'Cereté', dane: '23162' }
  ],
  CU: [
    { name: 'Soacha', dane: '25754' },
    { name: 'Facatativá', dane: '25269' },
    { name: 'Zipaquirá', dane: '25899' },
    { name: 'Chía', dane: '25175' },
    { name: 'Fusagasugá', dane: '25290' },
    { name: 'Mosquera', dane: '25473' },
    { name: 'Madrid', dane: '25430' },
    { name: 'Funza', dane: '25286' },
    { name: 'Cajicá', dane: '25126' },
    { name: 'Girardot', dane: '25307' }
  ],
  HU: [
    { name: 'Neiva', dane: '41001' },
    { name: 'Pitalito', dane: '41551' },
    { name: 'Garzón', dane: '41298' }
  ],
  LG: [
    { name: 'Riohacha', dane: '44001' },
    { name: 'Maicao', dane: '44430' }
  ],
  MA: [
    { name: 'Santa Marta', dane: '47001' },
    { name: 'Ciénaga', dane: '47189' }
  ],
  ME: [
    { name: 'Villavicencio', dane: '50001' },
    { name: 'Acacías', dane: '50006' },
    { name: 'Granada', dane: '50313' }
  ],
  NA: [
    { name: 'Pasto', dane: '52001' },
    { name: 'Tumaco', dane: '52835' },
    { name: 'Ipiales', dane: '52356' }
  ],
  NS: [
    { name: 'Cúcuta', dane: '54001' },
    { name: 'Ocaña', dane: '54498' },
    { name: 'Pamplona', dane: '54518' }
  ],
  QD: [
    { name: 'Armenia', dane: '63001' },
    { name: 'Calarcá', dane: '63130' },
    { name: 'La Tebaida', dane: '63401' }
  ],
  RI: [
    { name: 'Pereira', dane: '66001' },
    { name: 'Dosquebradas', dane: '66170' },
    { name: 'Santa Rosa de Cabal', dane: '66682' }
  ],
  SN: [
    { name: 'Bucaramanga', dane: '68001' },
    { name: 'Floridablanca', dane: '68276' },
    { name: 'Girón', dane: '68307' },
    { name: 'Piedecuesta', dane: '68547' },
    { name: 'Barrancabermeja', dane: '68081' }
  ],
  SU: [
    { name: 'Sincelejo', dane: '70001' }
  ],
  TO: [
    { name: 'Ibagué', dane: '73001' },
    { name: 'Espinal', dane: '73268' },
    { name: 'Melgar', dane: '73449' }
  ],
  VC: [
    { name: 'Cali', dane: '76001' },
    { name: 'Buenaventura', dane: '76109' },
    { name: 'Palmira', dane: '76520' },
    { name: 'Tuluá', dane: '76834' },
    { name: 'Cartago', dane: '76147' },
    { name: 'Buga', dane: '76111' },
    { name: 'Yumbo', dane: '76892' },
    { name: 'Jamundí', dane: '76364' }
  ]
}

// Helper: get cities for a department code
export function getCitiesForDepartment(deptCode) {
  return citiesByDepartment[deptCode] || []
}

// Helper: find DANE code by city name and department
export function getDaneCode(cityName, deptCode) {
  const cities = citiesByDepartment[deptCode] || []
  const city = cities.find(c => c.name.toLowerCase() === cityName.toLowerCase())
  return city ? city.dane : null
}
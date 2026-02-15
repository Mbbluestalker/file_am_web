import clientLogo1 from '../assets/clientlogo1.png';
import clientLogo2 from '../assets/clientlogo2.png';
import clientLogo3 from '../assets/clientlogo3.png';

// Client logos array
const logos = [clientLogo1, clientLogo2, clientLogo3];

// Sample client data
export const clients = [
  {
    id: 1,
    name: 'Blossom Foods Ltd.',
    registrationNumber: 'RC 1234567',
    logo: logos[0],
    approvalStatus: 'active',
    vatStatus: 'Registered',
    vatRequired: true,
    nextFiling: 'Feb 21, 2026 (VAT)',
  },
  {
    id: 2,
    name: 'TechHub Nigeria',
    registrationNumber: 'RC 1234567',
    logo: logos[1],
    approvalStatus: 'pending',
    vatStatus: 'Pending',
    vatRequired: true,
    nextFiling: 'Feb 21, 2026 (CIT)',
  },
  {
    id: 3,
    name: 'Bright Future Consulting',
    registrationNumber: 'BN 6789012',
    logo: logos[2],
    approvalStatus: 'active',
    vatStatus: 'Not Required',
    vatRequired: false,
    nextFiling: null,
  },
  {
    id: 4,
    name: 'TechHub Nigeria',
    registrationNumber: 'RC 1234567',
    logo: logos[1],
    approvalStatus: 'pending',
    vatStatus: 'Pending',
    vatRequired: true,
    nextFiling: 'Feb 21, 2026 (CIT)',
  },
  {
    id: 5,
    name: 'Bright Future Consulting',
    registrationNumber: 'BN 6789012',
    logo: logos[2],
    approvalStatus: 'active',
    vatStatus: 'Not Required',
    vatRequired: false,
    nextFiling: null,
  },
  {
    id: 6,
    name: 'Blossom Foods Ltd.',
    registrationNumber: 'RC 1234567',
    logo: logos[0],
    approvalStatus: 'active',
    vatStatus: 'Registered',
    vatRequired: true,
    nextFiling: 'Feb 21, 2026 (VAT)',
  },
  {
    id: 7,
    name: 'Blossom Foods Ltd.',
    registrationNumber: 'RC 1234567',
    logo: logos[0],
    approvalStatus: 'active',
    vatStatus: 'Registered',
    vatRequired: true,
    nextFiling: 'Feb 21, 2026 (VAT)',
  },
  {
    id: 8,
    name: 'TechHub Nigeria',
    registrationNumber: 'RC 1234567',
    logo: logos[1],
    approvalStatus: 'pending',
    vatStatus: 'Pending',
    vatRequired: true,
    nextFiling: 'Feb 21, 2026 (CIT)',
  },
  {
    id: 9,
    name: 'Bright Future Consulting',
    registrationNumber: 'BN 6789012',
    logo: logos[2],
    approvalStatus: 'active',
    vatStatus: 'Not Required',
    vatRequired: false,
    nextFiling: null,
  },
];

// Helper function to get client by ID
export const getClientById = (id) => {
  return clients.find((client) => client.id === parseInt(id));
};

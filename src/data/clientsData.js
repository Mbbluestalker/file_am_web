import clientLogo1 from '../assets/clientlogo1.png';
import clientLogo2 from '../assets/clientlogo2.png';
import clientLogo3 from '../assets/clientlogo3.png';

// Client logos array
const logos = [clientLogo1, clientLogo2, clientLogo3];

// Sample client data with different VAT computation states
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
    // Tax Computation: Above VAT Threshold
    taxComputationStatus: 'above',
    annualTurnover: 104200000, // N104.2M (104.2% of threshold)
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
    // Tax Computation: Approaching VAT Threshold
    taxComputationStatus: 'approaching',
    annualTurnover: 95200000, // N95.2M (95.2% of threshold)
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
    // Tax Computation: Below VAT Threshold with Chart
    taxComputationStatus: 'below-with-chart',
    annualTurnover: 43800000, // N43.8M (43.8% of threshold)
  },
  {
    id: 4,
    name: 'Metro Traders Ltd.',
    registrationNumber: 'RC 8901234',
    logo: logos[1],
    approvalStatus: 'active',
    vatStatus: 'Not Required',
    vatRequired: false,
    nextFiling: null,
    // Tax Computation: Below VAT Threshold (simple)
    taxComputationStatus: 'below-threshold',
    annualTurnover: 25000000, // N25M
  },
  {
    id: 5,
    name: 'Global Ventures Inc.',
    registrationNumber: 'RC 5678901',
    logo: logos[0],
    approvalStatus: 'active',
    vatStatus: 'Registered',
    vatRequired: false,
    nextFiling: null,
    // Tax Computation: VAT Eligible - No Filing Yet
    taxComputationStatus: 'no-filing',
    annualTurnover: 120000000, // N120M
  },
  {
    id: 6,
    name: 'StartUp Hub',
    registrationNumber: 'BN 3456789',
    logo: logos[2],
    approvalStatus: 'pending',
    vatStatus: 'Not Required',
    vatRequired: false,
    nextFiling: null,
    // Tax Computation: VAT Status Not Determined
    taxComputationStatus: 'not-determined',
    annualTurnover: null,
  },
  {
    id: 7,
    name: 'Premium Services Co.',
    registrationNumber: 'RC 2345678',
    logo: logos[0],
    approvalStatus: 'active',
    vatStatus: 'Registered',
    vatRequired: true,
    nextFiling: 'Feb 21, 2026 (VAT)',
    // Tax Computation: Above VAT Threshold
    taxComputationStatus: 'above',
    annualTurnover: 153800000, // N153.8M
  },
  {
    id: 8,
    name: 'Innovative Solutions',
    registrationNumber: 'RC 7890123',
    logo: logos[1],
    approvalStatus: 'active',
    vatStatus: 'Pending',
    vatRequired: false,
    nextFiling: null,
    // Tax Computation: Approaching VAT Threshold
    taxComputationStatus: 'approaching',
    annualTurnover: 98300000, // N98.3M (98.3% of threshold)
  },
  {
    id: 9,
    name: 'Creative Agency Ltd.',
    registrationNumber: 'RC 4567890',
    logo: logos[2],
    approvalStatus: 'active',
    vatStatus: 'Not Required',
    vatRequired: false,
    nextFiling: null,
    // Tax Computation: Below VAT Threshold with Chart
    taxComputationStatus: 'below-with-chart',
    annualTurnover: 65200000, // N65.2M (65.2% of threshold)
  },
];

// Helper function to get client by ID
export const getClientById = (id) => {
  return clients.find((client) => client.id === parseInt(id));
};

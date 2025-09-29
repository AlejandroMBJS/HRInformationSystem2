import { EmployeeBenefitEnrollment, BenefitPlan, Dependent } from '../types/benefits';

const mockBenefitPlans: BenefitPlan[] = [
  {
    id: 'plan-001',
    name: 'Standard Medical Plan',
    description: 'Comprehensive medical coverage with a moderate deductible.',
    type: 'medical',
    premium: 350.00,
    deductible: 1500,
    outOfPocketMax: 5000,
    coverageDetails: ['Primary Care Visits: $20 copay', 'Specialist Visits: $40 copay', 'Prescription Drugs: Tiered copay'],
    isActive: true,
  },
  {
    id: 'plan-002',
    name: 'Premium Medical Plan',
    description: 'Enhanced medical coverage with a low deductible and extensive network.',
    type: 'medical',
    premium: 550.00,
    deductible: 500,
    outOfPocketMax: 2500,
    coverageDetails: ['Primary Care Visits: $10 copay', 'Specialist Visits: $25 copay', 'Prescription Drugs: Low copay'],
    isActive: true,
  },
  {
    id: 'plan-003',
    name: 'Basic Dental Plan',
    description: 'Covers preventative care and basic procedures.',
    type: 'dental',
    premium: 45.00,
    deductible: 50,
    outOfPocketMax: 1000,
    coverageDetails: ['2 cleanings per year: 100% covered', 'Fillings: 80% covered'],
    isActive: true,
  },
  {
    id: 'plan-004',
    name: 'Vision Essentials Plan',
    description: 'Covers annual eye exams and a portion of glasses/contacts.',
    type: 'vision',
    premium: 20.00,
    deductible: 0,
    outOfPocketMax: 200,
    coverageDetails: ['Annual eye exam: $10 copay', 'Glasses/Contacts: $150 allowance'],
    isActive: true,
  },
  {
    id: 'plan-005',
    name: 'Group Life Insurance',
    description: 'Term life insurance policy.',
    type: 'life',
    premium: 30.00,
    deductible: 0,
    outOfPocketMax: 0,
    coverageDetails: ['Coverage amount: $50,000'],
    isActive: true,
  },
];

const mockDependents: Dependent[] = [
  {
    id: 'dep-001',
    firstName: 'Alice',
    lastName: 'Smith',
    relationship: 'spouse',
    dateOfBirth: '1990-05-15',
    isEnrolled: true,
  },
  {
    id: 'dep-002',
    firstName: 'Bob',
    lastName: 'Smith',
    relationship: 'child',
    dateOfBirth: '2018-11-22',
    isEnrolled: true,
  },
  {
    id: 'dep-003',
    firstName: 'Charlie',
    lastName: 'Smith',
    relationship: 'child',
    dateOfBirth: '2022-03-10',
    isEnrolled: false,
  },
];

export const mockEmployeeEnrollments: EmployeeBenefitEnrollment[] = [
  {
    id: 'enroll-001',
    employeeId: 'emp-001',
    enrollmentDate: '2024-01-01',
    selectedPlans: [mockBenefitPlans[0], mockBenefitPlans[2]],
    dependents: [mockDependents[0], mockDependents[1]],
    totalMonthlyCost: 350.00 + 45.00 + (mockBenefitPlans[0].premium * 0.5) + (mockBenefitPlans[2].premium * 0.5),
    status: 'submitted',
    lastUpdated: '2024-01-05T10:30:00Z',
  },
  {
    id: 'enroll-002',
    employeeId: 'emp-002',
    enrollmentDate: '2024-02-10',
    selectedPlans: [mockBenefitPlans[1], mockBenefitPlans[3], mockBenefitPlans[4]],
    dependents: [mockDependents[0]],
    totalMonthlyCost: 550.00 + 20.00 + 30.00 + (mockBenefitPlans[1].premium * 0.5) + (mockBenefitPlans[3].premium * 0.5) + (mockBenefitPlans[4].premium * 0.5),
    status: 'draft',
    lastUpdated: '2024-02-12T14:00:00Z',
  },
];

export const allMockBenefitPlans = mockBenefitPlans;
export { mockDependents };
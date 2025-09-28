export interface BenefitPlan {
  id: string;
  name: string;
  description: string;
  type: 'medical' | 'dental' | 'vision' | 'life';
  premium: number;
  deductible: number;
  outOfPocketMax: number;
  coverageDetails: string[];
  isActive: boolean;
}

export interface Dependent {
  id: string;
  firstName: string;
  lastName: string;
  relationship: 'spouse' | 'child' | 'other';
  dateOfBirth: string; // YYYY-MM-DD
  isEnrolled: boolean;
}

export interface EmployeeBenefitEnrollment {
  id: string;
  employeeId: string;
  enrollmentDate: string; // YYYY-MM-DD
  selectedPlans: BenefitPlan[];
  dependents: Dependent[];
  totalMonthlyCost: number;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  lastUpdated: string; // YYYY-MM-DDTHH:mm:ssZ
}

export interface BenefitsFilterOptions {
  planType?: 'medical' | 'dental' | 'vision' | 'life' | 'all';
  status?: 'draft' | 'submitted' | 'approved' | 'rejected' | 'all';
  searchQuery?: string;
}

export interface SortOptions {
  key: 'name' | 'premium' | 'enrollmentDate' | 'totalMonthlyCost';
  direction: 'asc' | 'desc';
}

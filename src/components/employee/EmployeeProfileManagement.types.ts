export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string; // YYYY-MM-DD
  hireDate: string; // YYYY-MM-DD
  department: string;
  position: string;
  salary: number;
  status: 'active' | 'inactive' | 'on_leave';
  photoUrl: string | null;
  skills: Skill[];
  certifications: Certification[];
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsOfExperience: number;
}

export interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string; // YYYY-MM-DD
  expirationDate: string | null; // YYYY-MM-DD
  credentialId: string | null;
}

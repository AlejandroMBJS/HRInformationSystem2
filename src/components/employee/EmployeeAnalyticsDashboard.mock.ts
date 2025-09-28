import { Employee, PerformanceMetric, EmployeePerformanceSummary, PerformanceTrend } from './types';

const generateRandomDate = (start: Date, end: Date): string => {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
};

const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const departments = ['Engineering', 'Marketing', 'Sales', 'Human Resources', 'Finance'];
const roles = ['Software Engineer', 'Marketing Specialist', 'Sales Manager', 'HR Generalist', 'Accountant', 'Team Lead', 'Product Manager'];
const statuses = ['active', 'inactive', 'on_leave'];

export const mockEmployees: Employee[] = Array.from({ length: 50 }).map((_, i) => {
  const id = generateUUID();
  const firstName = `Employee${i + 1}FN`;
  const lastName = `Employee${i + 1}LN`;
  const email = `employee${i + 1}@example.com`;
  const department = departments[Math.floor(Math.random() * departments.length)];
  const role = roles[Math.floor(Math.random() * roles.length)];
  const hireDate = generateRandomDate(new Date(2018, 0, 1), new Date(2023, 11, 31));
  const status = statuses[Math.floor(Math.random() * statuses.length)] as 'active' | 'inactive' | 'on_leave';
  const performanceScore = Math.floor(Math.random() * 50) + 50; // 50-100
  const managerId = i > 0 && Math.random() > 0.3 ? mockEmployees[Math.floor(Math.random() * i)].id : undefined;

  return {
    id,
    firstName,
    lastName,
    email,
    department,
    role,
    hireDate,
    status,
    performanceScore,
    managerId,
  };
});

export const mockPerformanceMetrics: PerformanceMetric[] = [];
mockEmployees.forEach(employee => {
  for (let i = 0; i < 10; i++) { // 10 metrics per employee
    const date = generateRandomDate(new Date(2024, 0, 1), new Date(2025, 8, 28));
    const metricName = Math.random() > 0.5 ? 'Project Completion Rate' : 'Customer Satisfaction Score';
    const value = Math.floor(Math.random() * 40) + 60; // 60-100
    const unit = metricName.includes('Rate') ? '%' : 'score';
    mockPerformanceMetrics.push({
      id: generateUUID(),
      employeeId: employee.id,
      date,
      metricName,
      value,
      unit,
      notes: Math.random() > 0.7 ? `Notes for ${metricName} on ${date}` : undefined,
    });
  }
});

export const mockEmployeeSummaries: EmployeePerformanceSummary[] = mockEmployees.map(employee => {
  const employeeMetrics = mockPerformanceMetrics.filter(m => m.employeeId === employee.id);
  const scores = employeeMetrics.map(m => m.value);
  const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  const totalReviews = employeeMetrics.length;
  const lastReviewDate = employeeMetrics.length > 0
    ? employeeMetrics.reduce((latest, current) => (current.date > latest.date ? current : latest)).date
    : employee.hireDate;

  const trends: PerformanceTrend[] = [];
  // Generate some trend data for the last 12 months
  for (let i = 0; i < 12; i++) {
    const date = new Date(2024, i, 1);
    const score = Math.floor(Math.random() * 30) + 65; // 65-95
    trends.push({ date: date.toISOString().split('T')[0], score });
  }

  return {
    employeeId: employee.id,
    averageScore: parseFloat(averageScore.toFixed(2)),
    totalReviews,
    lastReviewDate,
    trends: trends.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
  };
});

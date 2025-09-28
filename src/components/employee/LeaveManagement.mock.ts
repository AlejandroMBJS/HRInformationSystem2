import { Employee, LeaveStatus, ApprovalStatus, LeaveType, LeaveRequest, LeaveBalance, LeaveCalendarEvent } from '../types/leaveManagement';

export const mockEmployees: Employee[] = [
  { id: 'emp1', name: 'Alice Smith', email: 'alice.smith@example.com' },
  { id: 'emp2', name: 'Bob Johnson', email: 'bob.johnson@example.com' },
  { id: 'emp3', name: 'Charlie Brown', email: 'charlie.brown@example.com' },
  { id: 'emp4', name: 'Diana Prince', email: 'diana.prince@example.com' },
];

export const mockLeaveTypes: LeaveType[] = [
  { id: 'lt1', name: 'Annual Leave', description: 'Paid time off for vacation and personal time.', maxDays: 20 },
  { id: 'lt2', name: 'Sick Leave', description: 'Paid time off for illness or medical appointments.', maxDays: 10 },
  { id: 'lt3', name: 'Unpaid Leave', description: 'Unpaid time off for various reasons.', maxDays: 30 },
  { id: 'lt4', name: 'Maternity Leave', description: 'Paid leave for new mothers.', maxDays: 90 },
];

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: 'lr1',
    employeeId: 'emp1',
    employeeName: 'Alice Smith',
    leaveTypeId: 'lt1',
    leaveTypeName: 'Annual Leave',
    startDate: '2025-10-01',
    endDate: '2025-10-05',
    reason: 'Family vacation',
    status: LeaveStatus.Approved,
    requestedDays: 5,
    approverId: 'emp2',
    approverName: 'Bob Johnson',
    approvalDate: '2025-09-20',
    approvalStatus: ApprovalStatus.Approved,
    comments: 'Enjoy your trip!',
  },
  {
    id: 'lr2',
    employeeId: 'emp2',
    employeeName: 'Bob Johnson',
    leaveTypeId: 'lt2',
    leaveTypeName: 'Sick Leave',
    startDate: '2025-10-10',
    endDate: '2025-10-10',
    reason: 'Flu symptoms',
    status: LeaveStatus.Pending,
    requestedDays: 1,
    approvalStatus: ApprovalStatus.Pending,
  },
  {
    id: 'lr3',
    employeeId: 'emp1',
    employeeName: 'Alice Smith',
    leaveTypeId: 'lt3',
    leaveTypeName: 'Unpaid Leave',
    startDate: '2025-11-01',
    endDate: '2025-11-07',
    reason: 'Personal matters',
    status: LeaveStatus.Rejected,
    requestedDays: 7,
    approverId: 'emp2',
    approverName: 'Bob Johnson',
    approvalDate: '2025-10-25',
    approvalStatus: ApprovalStatus.Rejected,
    comments: 'Staffing issues during that period.',
  },
  {
    id: 'lr4',
    employeeId: 'emp3',
    employeeName: 'Charlie Brown',
    leaveTypeId: 'lt1',
    leaveTypeName: 'Annual Leave',
    startDate: '2025-12-15',
    endDate: '2025-12-20',
    reason: 'Holiday break',
    status: LeaveStatus.Pending,
    requestedDays: 5,
    approvalStatus: ApprovalStatus.Pending,
  },
  {
    id: 'lr5',
    employeeId: 'emp4',
    employeeName: 'Diana Prince',
    leaveTypeId: 'lt4',
    leaveTypeName: 'Maternity Leave',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    reason: 'Expecting a baby',
    status: LeaveStatus.Approved,
    requestedDays: 90,
    approverId: 'emp1',
    approverName: 'Alice Smith',
    approvalDate: '2025-09-01',
    approvalStatus: ApprovalStatus.Approved,
  },
];

export const mockLeaveBalances: LeaveBalance[] = [
  { employeeId: 'emp1', employeeName: 'Alice Smith', leaveTypeId: 'lt1', leaveTypeName: 'Annual Leave', totalDays: 20, usedDays: 5, remainingDays: 15 },
  { employeeId: 'emp1', employeeName: 'Alice Smith', leaveTypeId: 'lt2', leaveTypeName: 'Sick Leave', totalDays: 10, usedDays: 0, remainingDays: 10 },
  { employeeId: 'emp1', employeeName: 'Alice Smith', leaveTypeId: 'lt3', leaveTypeName: 'Unpaid Leave', totalDays: 30, usedDays: 7, remainingDays: 23 },
  { employeeId: 'emp2', employeeName: 'Bob Johnson', leaveTypeId: 'lt1', leaveTypeName: 'Annual Leave', totalDays: 20, usedDays: 0, remainingDays: 20 },
  { employeeId: 'emp2', employeeName: 'Bob Johnson', leaveTypeId: 'lt2', leaveTypeName: 'Sick Leave', totalDays: 10, usedDays: 1, remainingDays: 9 },
  { employeeId: 'emp3', employeeName: 'Charlie Brown', leaveTypeId: 'lt1', leaveTypeName: 'Annual Leave', totalDays: 20, usedDays: 0, remainingDays: 20 },
  { employeeId: 'emp4', employeeName: 'Diana Prince', leaveTypeId: 'lt4', leaveTypeName: 'Maternity Leave', totalDays: 90, usedDays: 0, remainingDays: 90 },
];

export const mockCalendarEvents: LeaveCalendarEvent[] = mockLeaveRequests
  .filter(req => req.status === LeaveStatus.Approved)
  .map(req => ({
    id: req.id,
    title: `${req.employeeName} - ${req.leaveTypeName}`,
    start: req.startDate,
    end: req.endDate,
    allDay: true,
    employeeId: req.employeeId,
    leaveStatus: req.status,
    leaveTypeName: req.leaveTypeName,
  }));

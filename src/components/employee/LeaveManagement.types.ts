export interface Employee {
  id: string;
  name: string;
  email: string;
}

export enum LeaveStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Cancelled = 'Cancelled',
}

export enum ApprovalStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export interface LeaveType {
  id: string;
  name: string;
  description: string;
  maxDays: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveTypeId: string;
  leaveTypeName: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  reason: string;
  status: LeaveStatus;
  requestedDays: number;
  approverId?: string;
  approverName?: string;
  approvalDate?: string; // ISO date string
  approvalStatus: ApprovalStatus;
  comments?: string;
}

export interface LeaveBalance {
  employeeId: string;
  employeeName: string;
  leaveTypeId: string;
  leaveTypeName: string;
  totalDays: number;
  usedDays: number;
  remainingDays: number;
}

export interface LeaveCalendarEvent {
  id: string;
  title: string;
  start: string; // ISO date string
  end: string; // ISO date string
  allDay: boolean;
  employeeId: string;
  leaveStatus: LeaveStatus;
  leaveTypeName: string;
}

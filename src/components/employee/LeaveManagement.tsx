import React, { useState, useEffect } from 'react';
import { Employee, LeaveStatus, ApprovalStatus, LeaveType, LeaveRequest, LeaveBalance, LeaveCalendarEvent } from '../types/leaveManagement';
import { mockEmployees, mockLeaveTypes, mockLeaveRequests, mockLeaveBalances, mockCalendarEvents } from '../data/mockData';

// Radix UI components (using shadcn/ui for convenience)
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

import { format, addDays, isSameDay, parseISO } from 'date-fns';
import { CalendarIcon, PlusCircle, Search, Edit, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

const LeaveManagement: React.FC = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>(mockLeaveBalances);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>(mockLeaveTypes);
  const [calendarEvents, setCalendarEvents] = useState<LeaveCalendarEvent[]>(mockCalendarEvents);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // State for filters and search
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<LeaveStatus | 'all'>('all');
  const [filterEmployee, setFilterEmployee] = useState<string | 'all'>('all');

  // State for new/edit leave request form
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [currentRequest, setCurrentRequest] = useState<Partial<LeaveRequest> | null>(null);

  // State for calendar view
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());

  const filteredLeaveRequests = leaveRequests.filter(request => {
    const matchesSearch = request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          request.leaveTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          request.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesEmployee = filterEmployee === 'all' || request.employeeId === filterEmployee;
    return matchesSearch && matchesStatus && matchesEmployee;
  });

  // CRUD Operations (mocked)
  const addLeaveRequest = (newRequest: Omit<LeaveRequest, 'id' | 'status' | 'approvalStatus'>) => {
    setLoading(true);
    setError(null);
    try {
      const id = `lr${leaveRequests.length + 1}`;
      const employee = employees.find(emp => emp.id === newRequest.employeeId);
      const leaveType = leaveTypes.find(lt => lt.id === newRequest.leaveTypeId);
      if (!employee || !leaveType) throw new Error('Invalid employee or leave type');

      const newLeaveRequest: LeaveRequest = {
        ...newRequest,
        id,
        employeeName: employee.name,
        leaveTypeName: leaveType.name,
        status: LeaveStatus.Pending, // New requests are always pending
        approvalStatus: ApprovalStatus.Pending,
      };
      setLeaveRequests(prev => [...prev, newLeaveRequest]);
      // Update calendar events if approved (though new requests are pending)
      // For now, only approved requests show on calendar, so no update here.
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
      setIsFormOpen(false);
    }
  };

  const updateLeaveRequest = (updatedRequest: LeaveRequest) => {
    setLoading(true);
    setError(null);
    try {
      setLeaveRequests(prev =>
        prev.map(req => (req.id === updatedRequest.id ? updatedRequest : req))
      );
      // Update calendar events if status changes to approved
      if (updatedRequest.status === LeaveStatus.Approved) {
        setCalendarEvents(prev => {
          const existingEvent = prev.find(event => event.id === updatedRequest.id);
          if (existingEvent) {
            return prev.map(event => event.id === updatedRequest.id ? {
              ...event,
              title: `${updatedRequest.employeeName} - ${updatedRequest.leaveTypeName}`,
              start: updatedRequest.startDate,
              end: updatedRequest.endDate,
              leaveStatus: updatedRequest.status,
              leaveTypeName: updatedRequest.leaveTypeName,
            } : event);
          } else {
            return [...prev, {
              id: updatedRequest.id,
              title: `${updatedRequest.employeeName} - ${updatedRequest.leaveTypeName}`,
              start: updatedRequest.startDate,
              end: updatedRequest.endDate,
              allDay: true,
              employeeId: updatedRequest.employeeId,
              leaveStatus: updatedRequest.status,
              leaveTypeName: updatedRequest.leaveTypeName,
            }];
          }
        });
      } else {
        // Remove from calendar if no longer approved
        setCalendarEvents(prev => prev.filter(event => event.id !== updatedRequest.id));
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
      setIsFormOpen(false);
    }
  };

  const deleteLeaveRequest = (id: string) => {
    setLoading(true);
    setError(null);
    try {
      setLeaveRequests(prev => prev.filter(req => req.id !== id));
      setCalendarEvents(prev => prev.filter(event => event.id !== id));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReject = (requestId: string, status: ApprovalStatus, approverId: string) => {
    setLoading(true);
    setError(null);
    try {
      const approver = employees.find(emp => emp.id === approverId);
      if (!approver) throw new Error('Approver not found');

      setLeaveRequests(prev =>
        prev.map(req =>
          req.id === requestId
            ? {
                ...req,
                status: status === ApprovalStatus.Approved ? LeaveStatus.Approved : LeaveStatus.Rejected,
                approvalStatus: status,
                approverId: approverId,
                approverName: approver.name,
                approvalDate: new Date().toISOString().split('T')[0],
              }
            : req
        )
      );
      // Re-trigger calendar event update logic
      const updatedReq = leaveRequests.find(req => req.id === requestId);
      if (updatedReq) {
        updateLeaveRequest({ ...updatedReq, status: status === ApprovalStatus.Approved ? LeaveStatus.Approved : LeaveStatus.Rejected, approvalStatus: status });
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentRequest) return;

    // Basic validation
    if (!currentRequest.employeeId || !currentRequest.leaveTypeId || !currentRequest.startDate || !currentRequest.endDate || !currentRequest.reason) {
      setError('Please fill in all required fields.');
      return;
    }

    const start = parseISO(currentRequest.startDate);
    const end = parseISO(currentRequest.endDate);
    if (start > end) {
      setError('End date cannot be before start date.');
      return;
    }

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const requestedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include start day

    if (currentRequest.id) {
      updateLeaveRequest(currentRequest as LeaveRequest);
    } else {
      addLeaveRequest({ ...currentRequest, requestedDays } as Omit<LeaveRequest, 'id' | 'status' | 'approvalStatus'>);
    }
    setCurrentRequest(null);
  };

  const getDayEvents = (date: Date) => {
    return calendarEvents.filter(event => {
      const start = parseISO(event.start);
      const end = parseISO(event.end);
      return date >= start && date <= end;
    });
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <Card className="w-full max-w-6xl mx-auto shadow-lg rounded-lg">
        <CardHeader className="border-b">
          <CardTitle className="text-3xl font-bold text-gray-800">Leave Management</CardTitle>
          <CardDescription className="text-gray-600">Manage employee leave requests, balances, and approvals.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <Tabs defaultValue="requests" className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:w-auto md:flex mb-4">
              <TabsTrigger value="requests" className="flex-1">Leave Requests</TabsTrigger>
              <TabsTrigger value="balances" className="flex-1">Leave Balances</TabsTrigger>
              <TabsTrigger value="calendar" className="flex-1">Calendar View</TabsTrigger>
            </TabsList>

            {/* Leave Requests Tab */}
            <TabsContent value="requests">
              <Card className="mb-6">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-2xl font-semibold">All Leave Requests</CardTitle>
                  <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => setCurrentRequest({})} className="flex items-center gap-2">
                        <PlusCircle className="h-4 w-4" /> New Request
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>{currentRequest?.id ? 'Edit Leave Request' : 'Create New Leave Request'}</DialogTitle>
                        <DialogDescription>
                          Fill in the details for the leave request.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleFormSubmit} className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="employeeId" className="text-right">Employee</Label>
                          <Select onValueChange={(value) => setCurrentRequest(prev => ({ ...prev, employeeId: value }))} value={currentRequest?.employeeId || ''}>
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select an employee" />
                            </SelectTrigger>
                            <SelectContent>
                              {employees.map(emp => (
                                <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="leaveTypeId" className="text-right">Leave Type</Label>
                          <Select onValueChange={(value) => setCurrentRequest(prev => ({ ...prev, leaveTypeId: value }))} value={currentRequest?.leaveTypeId || ''}>
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select leave type" />
                            </SelectTrigger>
                            <SelectContent>
                              {leaveTypes.map(lt => (
                                <SelectItem key={lt.id} value={lt.id}>{lt.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="startDate" className="text-right">Start Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "col-span-3 justify-start text-left font-normal",
                                  !currentRequest?.startDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {currentRequest?.startDate ? format(parseISO(currentRequest.startDate), "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={currentRequest?.startDate ? parseISO(currentRequest.startDate) : undefined}
                                onSelect={(date) => setCurrentRequest(prev => ({ ...prev, startDate: date ? format(date, "yyyy-MM-dd") : '' }))}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="endDate" className="text-right">End Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "col-span-3 justify-start text-left font-normal",
                                  !currentRequest?.endDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {currentRequest?.endDate ? format(parseISO(currentRequest.endDate), "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={currentRequest?.endDate ? parseISO(currentRequest.endDate) : undefined}
                                onSelect={(date) => setCurrentRequest(prev => ({ ...prev, endDate: date ? format(date, "yyyy-MM-dd") : '' }))}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="reason" className="text-right">Reason</Label>
                          <Input
                            id="reason"
                            value={currentRequest?.reason || ''}
                            onChange={(e) => setCurrentRequest(prev => ({ ...prev, reason: e.target.value }))}
                            className="col-span-3"
                          />
                        </div>
                        {error && <p className="text-red-500 col-span-4 text-center">{error}</p>}
                        <DialogFooter>
                          <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Request'}</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                    <div className="relative w-full sm:w-1/3">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search requests..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    <Select onValueChange={(value: LeaveStatus | 'all') => setFilterStatus(value)} value={filterStatus}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {Object.values(LeaveStatus).map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select onValueChange={(value: string | 'all') => setFilterEmployee(value)} value={filterEmployee}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by Employee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Employees</SelectItem>
                        {employees.map(emp => (
                          <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {loading && <p className="text-center text-blue-500">Loading...</p>}
                  {error && <p className="text-center text-red-500">Error: {error}</p>}

                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee</TableHead>
                          <TableHead>Leave Type</TableHead>
                          <TableHead>Dates</TableHead>
                          <TableHead>Days</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Approver</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLeaveRequests.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center">No leave requests found.</TableCell>
                          </TableRow>
                        )}
                        {filteredLeaveRequests.map(request => (
                          <TableRow key={request.id}>
                            <TableCell className="font-medium">{request.employeeName}</TableCell>
                            <TableCell>{request.leaveTypeName}</TableCell>
                            <TableCell>{format(parseISO(request.startDate), 'MMM d, yyyy')} - {format(parseISO(request.endDate), 'MMM d, yyyy')}</TableCell>
                            <TableCell>{request.requestedDays}</TableCell>
                            <TableCell className="max-w-[150px] truncate">{request.reason}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold\n                                ${request.status === LeaveStatus.Approved ? 'bg-green-100 text-green-800'
                                : request.status === LeaveStatus.Pending ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'}`}>
                                {request.status}
                              </span>
                            </TableCell>
                            <TableCell>{request.approverName || 'N/A'}</TableCell>
                            <TableCell className="text-right flex gap-2 justify-end">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => {
                                  setCurrentRequest(request);
                                  setIsFormOpen(true);
                                }}
                                aria-label="Edit request"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => deleteLeaveRequest(request.id)}
                                aria-label="Delete request"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              {request.status === LeaveStatus.Pending && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleApproveReject(request.id, ApprovalStatus.Approved, employees[0].id)} // Mock approver
                                    aria-label="Approve request"
                                  >
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleApproveReject(request.id, ApprovalStatus.Rejected, employees[0].id)} // Mock approver
                                    aria-label="Reject request"
                                  >
                                    <XCircle className="h-4 w-4 text-red-600" />
                                  </Button>
                                </>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Leave Balances Tab */}
            <TabsContent value="balances">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold">Employee Leave Balances</CardTitle>
                  <CardDescription>Overview of available and used leave days per employee.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee</TableHead>
                          <TableHead>Leave Type</TableHead>
                          <TableHead>Total Days</TableHead>
                          <TableHead>Used Days</TableHead>
                          <TableHead>Remaining Days</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leaveBalances.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center">No leave balances found.</TableCell>
                          </TableRow>
                        )}
                        {leaveBalances.map((balance, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{balance.employeeName}</TableCell>
                            <TableCell>{balance.leaveTypeName}</TableCell>
                            <TableCell>{balance.totalDays}</TableCell>
                            <TableCell>{balance.usedDays}</TableCell>
                            <TableCell>{balance.remainingDays}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Calendar View Tab */}
            <TabsContent value="calendar">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold">Leave Calendar</CardTitle>
                  <CardDescription>View approved leave requests on a calendar.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center mb-4">
                    <Calendar
                      mode="single"
                      month={calendarMonth}
                      onMonthChange={setCalendarMonth}
                      selected={undefined} // No single day selection for now, just display events
                      className="rounded-md border shadow"
                      components={{
                        DayContent: ({ date }) => {
                          const events = getDayEvents(date);
                          return (
                            <div className="relative text-center">
                              <span className="text-sm">{format(date, "d")}</span>
                              {events.length > 0 && (
                                <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                                  {events.map((event, index) => (
                                    <span key={index} className="h-1 w-1 rounded-full bg-blue-500 mx-[0.5px]" title={event.title}></span>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        },
                      }}
                    />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Upcoming Approved Leaves:</h3>
                    {calendarEvents.length === 0 && <p className="text-gray-600">No approved leaves found for the calendar.</p>}
                    <ul className="space-y-2">
                      {calendarEvents
                        .sort((a, b) => parseISO(a.start).getTime() - parseISO(b.start).getTime())
                        .map(event => (
                          <li key={event.id} className="flex items-center gap-2 p-2 bg-blue-50 rounded-md shadow-sm">
                            <CalendarIcon className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">{event.title}</span>
                            <span className="text-sm text-gray-600">({format(parseISO(event.start), 'MMM d')} - {format(parseISO(event.end), 'MMM d, yyyy')})</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveManagement;

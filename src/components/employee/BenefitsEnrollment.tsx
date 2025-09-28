import React, { useState, useEffect, useMemo } from 'react';
import { EmployeeBenefitEnrollment, BenefitPlan, Dependent, BenefitsFilterOptions, SortOptions } from '../types/benefits';
import { allMockBenefitPlans, mockEmployeeEnrollments } from '../data/mockBenefitsData';

// Radix UI components (shadcn/ui)
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { useToast } from './ui/use-toast';
import { ToastAction } from './ui/toast';
import { ScrollArea } from './ui/scroll-area';

// Lucide icons
import { PlusCircle, Edit, Trash2, Search, ArrowUpDown, Loader2 } from 'lucide-react';

const BenefitsEnrollment: React.FC = () => {
  const [enrollments, setEnrollments] = useState<EmployeeBenefitEnrollment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentEnrollment, setCurrentEnrollment] = useState<EmployeeBenefitEnrollment | null>(null);
  const [filters, setFilters] = useState<BenefitsFilterOptions>({ planType: 'all', status: 'all', searchQuery: '' });
  const [sort, setSort] = useState<SortOptions>({ key: 'enrollmentDate', direction: 'desc' });

  const { toast } = useToast();

  // Simulate API call to fetch data
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setEnrollments(mockEmployeeEnrollments);
        toast({
          title: "Benefits Data Loaded",
          description: "Mock employee benefits enrollment data has been loaded.",
        });
      } catch (err) {
        setError("Failed to load benefits data.");
        toast({
          title: "Error",
          description: "Failed to load benefits data.",
          variant: "destructive",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, [toast]);

  const filteredAndSortedEnrollments = useMemo(() => {
    let filtered = enrollments;

    // Apply search query
    if (filters.searchQuery) {
      filtered = filtered.filter(enrollment =>
        enrollment.employeeId.toLowerCase().includes(filters.searchQuery!.toLowerCase()) ||
        enrollment.selectedPlans.some(plan => plan.name.toLowerCase().includes(filters.searchQuery!.toLowerCase()))
      );
    }

    // Apply plan type filter
    if (filters.planType && filters.planType !== 'all') {
      filtered = filtered.filter(enrollment =>
        enrollment.selectedPlans.some(plan => plan.type === filters.planType)
      );
    }

    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(enrollment => enrollment.status === filters.status);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sort.key as keyof EmployeeBenefitEnrollment];
      const bValue = b[sort.key as keyof EmployeeBenefitEnrollment];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sort.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sort.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });

    return filtered;
  }, [enrollments, filters, sort]);

  const handleAddEnrollment = () => {
    setCurrentEnrollment({
      id: `enroll-${Date.now()}`,
      employeeId: '',
      enrollmentDate: new Date().toISOString().split('T')[0],
      selectedPlans: [],
      dependents: [],
      totalMonthlyCost: 0,
      status: 'draft',
      lastUpdated: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleEditEnrollment = (enrollment: EmployeeBenefitEnrollment) => {
    setCurrentEnrollment({ ...enrollment });
    setIsModalOpen(true);
  };

  const handleDeleteEnrollment = async (id: string) => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
      setEnrollments(prev => prev.filter(e => e.id !== id));
      toast({
        title: "Enrollment Deleted",
        description: `Enrollment ${id} has been successfully deleted.`, 
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete enrollment.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEnrollment = async () => {
    if (!currentEnrollment) return;

    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

      const updatedEnrollment = { ...currentEnrollment, lastUpdated: new Date().toISOString() };
      const calculatedCost = updatedEnrollment.selectedPlans.reduce((sum, plan) => sum + plan.premium, 0);
      updatedEnrollment.totalMonthlyCost = calculatedCost;

      if (enrollments.find(e => e.id === updatedEnrollment.id)) {
        setEnrollments(prev => prev.map(e => (e.id === updatedEnrollment.id ? updatedEnrollment : e)));
        toast({
          title: "Enrollment Updated",
          description: `Enrollment for ${updatedEnrollment.employeeId} has been updated.`, 
        });
      } else {
        setEnrollments(prev => [...prev, updatedEnrollment]);
        toast({
          title: "Enrollment Added",
          description: `New enrollment for ${updatedEnrollment.employeeId} has been added.`, 
        });
      }
      setIsModalOpen(false);
      setCurrentEnrollment(null);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save enrollment.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelection = (plan: BenefitPlan, isSelected: boolean) => {
    if (!currentEnrollment) return;
    setCurrentEnrollment(prev => {
      if (!prev) return null;
      const selectedPlans = isSelected
        ? [...prev.selectedPlans, plan]
        : prev.selectedPlans.filter(p => p.id !== plan.id);
      return { ...prev, selectedPlans };
    });
  };

  const handleDependentUpdate = (dependent: Dependent, isEnrolled: boolean) => {
    if (!currentEnrollment) return;
    setCurrentEnrollment(prev => {
      if (!prev) return null;
      const updatedDependents = prev.dependents.map(dep =>
        dep.id === dependent.id ? { ...dep, isEnrolled } : dep
      );
      // If dependent is not in the list, add it (e.g., for new dependents)
      if (isEnrolled && !prev.dependents.some(dep => dep.id === dependent.id)) {
        updatedDependents.push({ ...dependent, isEnrolled: true });
      }
      return { ...prev, dependents: updatedDependents };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" aria-label="Loading benefits data" />
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <p role="alert">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Benefits Enrollment Management</CardTitle>
          <CardDescription>Manage employee benefit plans and dependent enrollments.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <div className="flex w-full sm:w-auto space-x-2">
              <Input
                type="text"
                placeholder="Search by Employee ID or Plan Name..."
                className="max-w-sm"
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                aria-label="Search enrollments"
              />
              <Button onClick={() => setFilters(prev => ({ ...prev, searchQuery: '' }))} variant="outline" aria-label="Clear search">
                Clear
              </Button>
            </div>
            <div className="flex w-full sm:w-auto space-x-2">
              <Select
                value={filters.planType}
                onValueChange={(value: 'medical' | 'dental' | 'vision' | 'life' | 'all') => setFilters(prev => ({ ...prev, planType: value }))}
              >
                <SelectTrigger className="w-[180px]" aria-label="Filter by plan type">
                  <SelectValue placeholder="Filter by Plan Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plan Types</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="dental">Dental</SelectItem>
                  <SelectItem value="vision">Vision</SelectItem>
                  <SelectItem value="life">Life</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filters.status}
                onValueChange={(value: 'draft' | 'submitted' | 'approved' | 'rejected' | 'all') => setFilters(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="w-[180px]" aria-label="Filter by status">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddEnrollment} className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Enrollment
            </Button>
          </div>

          <ScrollArea className="h-[600px] w-full rounded-md border">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">
                    <Button
                      variant="ghost"
                      onClick={() => setSort(prev => ({ key: 'employeeId', direction: prev.direction === 'asc' && prev.key === 'employeeId' ? 'desc' : 'asc' }))}
                      aria-sort={sort.key === 'employeeId' ? sort.direction : 'none'}
                    >
                      Employee ID
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => setSort(prev => ({ key: 'enrollmentDate', direction: prev.direction === 'asc' && prev.key === 'enrollmentDate' ? 'desc' : 'asc' }))}
                      aria-sort={sort.key === 'enrollmentDate' ? sort.direction : 'none'}
                    >
                      Enrollment Date
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Selected Plans</TableHead>
                  <TableHead>Dependents</TableHead>
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      onClick={() => setSort(prev => ({ key: 'totalMonthlyCost', direction: prev.direction === 'asc' && prev.key === 'totalMonthlyCost' ? 'desc' : 'asc' }))}
                      aria-sort={sort.key === 'totalMonthlyCost' ? sort.direction : 'none'}
                    >
                      Total Cost
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedEnrollments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No enrollments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedEnrollments.map((enrollment) => (
                    <TableRow key={enrollment.id}>
                      <TableCell className="font-medium">{enrollment.employeeId}</TableCell>
                      <TableCell>{enrollment.enrollmentDate}</TableCell>
                      <TableCell>
                        {enrollment.selectedPlans.map(plan => plan.name).join(', ') || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {enrollment.dependents.filter(dep => dep.isEnrolled).map(dep => `${dep.firstName} ${dep.lastName}`).join(', ') || 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">${enrollment.totalMonthlyCost.toFixed(2)}</TableCell>
                      <TableCell>{enrollment.status}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditEnrollment(enrollment)}
                          className="mr-2"
                          aria-label={`Edit enrollment for ${enrollment.employeeId}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEnrollment(enrollment.id)}
                          aria-label={`Delete enrollment for ${enrollment.employeeId}`}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{currentEnrollment?.id ? 'Edit Enrollment' : 'Add New Enrollment'}</DialogTitle>
            <DialogDescription>
              {currentEnrollment?.id ? `Edit details for enrollment ${currentEnrollment.employeeId}.` : 'Create a new employee benefits enrollment.'}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="grid gap-4 py-4 flex-grow pr-6">
            {currentEnrollment && (
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="employeeId" className="text-right">Employee ID</Label>
                  <Input
                    id="employeeId"
                    value={currentEnrollment.employeeId}
                    onChange={(e) => setCurrentEnrollment(prev => prev ? { ...prev, employeeId: e.target.value } : null)}
                    className="col-span-3"
                    aria-required="true"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="enrollmentDate" className="text-right">Enrollment Date</Label>
                  <Input
                    id="enrollmentDate"
                    type="date"
                    value={currentEnrollment.enrollmentDate}
                    onChange={(e) => setCurrentEnrollment(prev => prev ? { ...prev, enrollmentDate: e.target.value } : null)}
                    className="col-span-3"
                    aria-required="true"
                  />
                </div>

                <h3 className="text-lg font-semibold mt-4">Select Plans</h3>
                <div className="grid gap-2">
                  {allMockBenefitPlans.map(plan => (
                    <div key={plan.id} className="flex items-center space-x-2 p-2 border rounded-md">
                      <Checkbox
                        id={`plan-${plan.id}`}
                        checked={currentEnrollment.selectedPlans.some(p => p.id === plan.id)}
                        onCheckedChange={(checked) => handlePlanSelection(plan, checked as boolean)}
                        aria-labelledby={`plan-label-${plan.id}`}
                      />
                      <Label htmlFor={`plan-${plan.id}`} className="flex-1 cursor-pointer" id={`plan-label-${plan.id}`}>
                        <span className="font-medium">{plan.name}</span> - ${plan.premium.toFixed(2)}/month ({plan.type})
                        <p className="text-sm text-gray-500">{plan.description}</p>
                      </Label>
                    </div>
                  ))}
                </div>

                <h3 className="text-lg font-semibold mt-4">Manage Dependents</h3>
                <div className="grid gap-2">
                  {mockDependents.map(dependent => (
                    <div key={dependent.id} className="flex items-center space-x-2 p-2 border rounded-md">
                      <Checkbox
                        id={`dependent-${dependent.id}`}
                        checked={currentEnrollment.dependents.some(d => d.id === dependent.id && d.isEnrolled)}
                        onCheckedChange={(checked) => handleDependentUpdate(dependent, checked as boolean)}
                        aria-labelledby={`dependent-label-${dependent.id}`}
                      />
                      <Label htmlFor={`dependent-${dependent.id}`} className="flex-1 cursor-pointer" id={`dependent-label-${dependent.id}`}>
                        <span className="font-medium">{dependent.firstName} {dependent.lastName}</span> ({dependent.relationship})
                      </Label>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-4 items-center gap-4 mt-4">
                  <Label className="text-right font-bold">Calculated Monthly Cost</Label>
                  <div className="col-span-3 text-lg font-bold">
                    ${currentEnrollment.selectedPlans.reduce((sum, plan) => sum + plan.premium, 0).toFixed(2)}
                  </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">Status</Label>
                  <Select
                    value={currentEnrollment.status}
                    onValueChange={(value: 'draft' | 'submitted' | 'approved' | 'rejected') => setCurrentEnrollment(prev => prev ? { ...prev, status: value } : null)}
                  >
                    <SelectTrigger className="col-span-3" aria-label="Enrollment status">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEnrollment}>Save Enrollment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BenefitsEnrollment;

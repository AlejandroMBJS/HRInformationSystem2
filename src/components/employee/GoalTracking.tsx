import React, { useState, useEffect, useMemo } from 'react';
import { mockGoals } from '../lib/mockData';
import { Goal, GoalStatus as GoalStatusEnum, GoalPriority as GoalPriorityEnum } from '../lib/goalTracking.d';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { ChevronLeft, ChevronRight, PlusCircle, Edit, Trash2, Eye, Search, Filter, SortAsc, SortDesc } from 'lucide-react';

const GoalTracking: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<keyof typeof GoalStatusEnum | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<keyof typeof GoalPriorityEnum | 'all'>('all');
  const [sortField, setSortField] = useState<keyof Goal>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [goalsPerPage, setGoalsPerPage] = useState<number>(6);
  const [isAddGoalDialogOpen, setIsAddGoalDialogOpen] = useState<boolean>(false);
  const [isEditGoalDialogOpen, setIsEditGoalDialogOpen] = useState<boolean>(false);
  const [isViewGoalDialogOpen, setIsViewGoalDialogOpen] = useState<boolean>(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [viewingGoal, setViewingGoal] = useState<Goal | null>(null);

  // State for new goal form
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    status: GoalStatusEnum.NOT_STARTED,
    priority: GoalPriorityEnum.MEDIUM,
    category: '',
    smartCriteria: {
      specific: false,
      measurable: false,
      achievable: false,
      relevant: false,
      timeBound: false,
    },
    milestones: [],
    progressUpdates: [],
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      setGoals(mockGoals);
    } catch (err: any) {
      setError('Failed to load goals: ' + err.message);
      toast({
        title: 'Error',
        description: 'Failed to load goals.',
        variant: 'destructive',
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    if (isEditGoalDialogOpen && editingGoal) {
      setEditingGoal(prev => ({ ...prev!, [id]: value }));
    } else {
      setNewGoal(prev => ({ ...prev!, [id]: value }));
    }
  };

  const handleSelectChange = (id: keyof Goal, value: string) => {
    if (isEditGoalDialogOpen && editingGoal) {
      setEditingGoal(prev => ({ ...prev!, [id]: value }));
    } else {
      setNewGoal(prev => ({ ...prev!, [id]: value }));
    }
  };

  const handleSmartCriteriaChange = (key: keyof Goal['smartCriteria'], checked: boolean) => {
    if (isEditGoalDialogOpen && editingGoal) {
      setEditingGoal(prev => ({
        ...prev!,
        smartCriteria: { ...prev!.smartCriteria!, [key]: checked },
      }));
    } else {
      setNewGoal(prev => ({
        ...prev!,
        smartCriteria: { ...prev!.smartCriteria!, [key]: checked },
      }));
    }
  };

  const handleAddGoal = async () => {
    if (!newGoal.title || !newGoal.description || !newGoal.startDate || !newGoal.endDate || !newGoal.category) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
      const goalToAdd: Goal = {
        id: `goal-${Date.now()}`,
        employeeId: 'emp-001',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...newGoal,
        milestones: [],
        progressUpdates: [],
        smartCriteria: newGoal.smartCriteria || { specific: false, measurable: false, achievable: false, relevant: false, timeBound: false },
      } as Goal;

      setGoals(prev => [...prev, goalToAdd]);
      setIsAddGoalDialogOpen(false);
      setNewGoal({
        title: '', description: '', startDate: '', endDate: '', status: GoalStatusEnum.NOT_STARTED, priority: GoalPriorityEnum.MEDIUM, category: '',
        smartCriteria: { specific: false, measurable: false, achievable: false, relevant: false, timeBound: false },
        milestones: [], progressUpdates: []
      });
      toast({
        title: 'Success',
        description: 'Goal added successfully!',
      });
    } catch (err: any) {
      setError('Failed to add goal: ' + err.message);
      toast({
        title: 'Error',
        description: 'Failed to add goal.',
        variant: 'destructive',
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditGoal = async () => {
    if (!editingGoal || !editingGoal.title || !editingGoal.description || !editingGoal.startDate || !editingGoal.endDate || !editingGoal.category) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields for editing.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
      setGoals(prev => prev.map(goal => (goal.id === editingGoal.id ? { ...editingGoal, updatedAt: new Date().toISOString() } : goal)));
      setIsEditGoalDialogOpen(false);
      setEditingGoal(null);
      toast({
        title: 'Success',
        description: 'Goal updated successfully!',
      });
    } catch (err: any) {
      setError('Failed to update goal: ' + err.message);
      toast({
        title: 'Error',
        description: 'Failed to update goal.',
        variant: 'destructive',
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API call
      setGoals(prev => prev.filter(goal => goal.id !== goalId));
      toast({
        title: 'Success',
        description: 'Goal deleted successfully!',
      });
    } catch (err: any) {
      setError('Failed to delete goal: ' + err.message);
      toast({
        title: 'Error',
        description: 'Failed to delete goal.',
        variant: 'destructive',
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredGoals = useMemo(() => {
    return goals.filter(goal => {
      const matchesSearch = searchQuery === '' ||
        goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        goal.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        goal.milestones.some(m => m.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        goal.progressUpdates.some(pu => pu.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus = filterStatus === 'all' || goal.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || goal.priority === filterPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [goals, searchQuery, filterStatus, filterPriority]);

  const sortedGoals = useMemo(() => {
    return [...filteredGoals].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      } else if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
        return sortOrder === 'asc' ? (aValue === bValue ? 0 : aValue ? -1 : 1) : (aValue === bValue ? 0 : aValue ? 1 : -1);
      }
      return 0;
    });
  }, [filteredGoals, sortField, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(sortedGoals.length / goalsPerPage);
  const paginatedGoals = useMemo(() => {
    const startIndex = (currentPage - 1) * goalsPerPage;
    const endIndex = startIndex + goalsPerPage;
    return sortedGoals.slice(startIndex, endIndex);
  }, [sortedGoals, currentPage, goalsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusBadgeVariant = (status: keyof typeof GoalStatusEnum) => {
    switch (status) {
      case GoalStatusEnum.COMPLETED:
        return 'success';
      case GoalStatusEnum.IN_PROGRESS:
        return 'info';
      case GoalStatusEnum.ON_HOLD:
        return 'warning';
      case GoalStatusEnum.CANCELLED:
        return 'destructive';
      case GoalStatusEnum.NOT_STARTED:
      default:
        return 'default';
    }
  };

  const getPriorityBadgeVariant = (priority: keyof typeof GoalPriorityEnum) => {
    switch (priority) {
      case GoalPriorityEnum.URGENT:
        return 'destructive';
      case GoalPriorityEnum.HIGH:
        return 'warning';
      case GoalPriorityEnum.MEDIUM:
        return 'info';
      case GoalPriorityEnum.LOW:
      default:
        return 'default';
    }
  };

  if (loading) return <div className="text-center p-4 text-lg font-semibold">Loading goals...</div>;
  if (error) return <div className="text-center p-4 text-red-500 text-lg font-semibold">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Goal Setting & Tracking</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
        <div className="flex items-center w-full md:w-auto">
          <Input
            placeholder="Search goals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow md:flex-grow-0 md:w-64 mr-2"
            aria-label="Search goals by title, description, milestone, or progress update notes"
          />
          <Search className="text-gray-400" size={20} />
        </div>

        <div className="flex flex-wrap gap-3 justify-center md:justify-end">
          <Select value={filterStatus} onValueChange={(value) => { setFilterStatus(value as keyof typeof GoalStatusEnum | 'all'); setCurrentPage(1); }}>
            <SelectTrigger className="w-[180px]" aria-label="Filter goals by status">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.values(GoalStatusEnum).map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={(value) => { setFilterPriority(value as keyof typeof GoalPriorityEnum | 'all'); setCurrentPage(1); }}>
            <SelectTrigger className="w-[180px]" aria-label="Filter goals by priority">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              {Object.values(GoalPriorityEnum).map(priority => (
                <SelectItem key={priority} value={priority}>{priority}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortField} onValueChange={(value) => { setSortField(value as keyof Goal); setCurrentPage(1); }}>
            <SelectTrigger className="w-[180px]" aria-label="Sort goals by field">
              {sortOrder === 'asc' ? <SortAsc className="mr-2 h-4 w-4" /> : <SortDesc className="mr-2 h-4 w-4" />}
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Created Date</SelectItem>
              <SelectItem value="startDate">Start Date</SelectItem>
              <SelectItem value="endDate">End Date</SelectItem>
              <SelectItem value="status">Status</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={(value) => { setSortOrder(value as 'asc' | 'desc'); setCurrentPage(1); }}>
            <SelectTrigger className="w-[100px]" aria-label="Sort order">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Asc</SelectItem>
              <SelectItem value="desc">Desc</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isAddGoalDialogOpen} onOpenChange={setIsAddGoalDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 text-white hover:bg-blue-700 shadow-md" aria-label="Add new goal">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[475px] bg-white p-6 rounded-lg shadow-xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-800">Add New Goal</DialogTitle>
                <DialogDescription className="text-gray-600">Create a new goal for the employee.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-5 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right font-medium">Title</Label>
                  <Input id="title" value={newGoal.title} onChange={handleInputChange} className="col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500" aria-required="true" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right font-medium">Description</Label>
                  <Textarea id="description" value={newGoal.description} onChange={handleInputChange} className="col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500" aria-required="true" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="startDate" className="text-right font-medium">Start Date</Label>
                  <Input id="startDate" type="date" value={newGoal.startDate} onChange={handleInputChange} className="col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500" aria-required="true" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="endDate" className="text-right font-medium">End Date</Label>
                  <Input id="endDate" type="date" value={newGoal.endDate} onChange={handleInputChange} className="col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500" aria-required="true" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right font-medium">Status</Label>
                  <Select value={newGoal.status} onValueChange={(value) => handleSelectChange('status', value as keyof typeof GoalStatusEnum)}>
                    <SelectTrigger className="col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500" aria-label="Select goal status">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(GoalStatusEnum).map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="priority" className="text-right font-medium">Priority</Label>
                  <Select value={newGoal.priority} onValueChange={(value) => handleSelectChange('priority', value as keyof typeof GoalPriorityEnum)}>
                    <SelectTrigger className="col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500" aria-label="Select goal priority">
                      <SelectValue placeholder="Select Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(GoalPriorityEnum).map(priority => (
                        <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right font-medium">Category</Label>
                  <Input id="category" value={newGoal.category} onChange={handleInputChange} className="col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500" aria-required="true" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right font-medium">SMART Criteria</Label>
                  <div className="col-span-3 flex flex-col gap-2" role="group" aria-labelledby="smart-criteria-label">
                    {Object.keys(newGoal.smartCriteria || {}).map(key => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={`smart-${key}`}
                          checked={newGoal.smartCriteria?.[key as keyof typeof newGoal.smartCriteria]}
                          onCheckedChange={(checked) => handleSmartCriteriaChange(key as keyof typeof newGoal.smartCriteria, checked as boolean)}
                        />
                        <Label htmlFor={`smart-${key}`} className="capitalize">{key}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleAddGoal} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white shadow-md">
                  {loading ? 'Adding...' : 'Add Goal'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-lg">
        <Table className="min-w-full bg-white">
          <TableHeader className="bg-gray-200">
            <TableRow>
              <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</TableHead>
              <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</TableHead>
              <TableHead className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200">
            {paginatedGoals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4 text-gray-500">No goals found.</TableCell>
              </TableRow>
            ) : (
              paginatedGoals.map((goal) => (
                <TableRow key={goal.id} className="hover:bg-gray-100">
                  <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{goal.title}</TableCell>
                  <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{goal.category}</TableCell>
                  <TableCell className="px-4 py-4 whitespace-nowrap text-sm">
                    <Badge variant={getStatusBadgeVariant(goal.status)}>{goal.status}</Badge>
                  </TableCell>
                  <TableCell className="px-4 py-4 whitespace-nowrap text-sm">
                    <Badge variant={getPriorityBadgeVariant(goal.priority)}>{goal.priority}</Badge>
                  </TableCell>
                  <TableCell className="px-4 py-4 whitespace-nowrap text-sm">
                    <Progress value={goal.progressUpdates.length > 0 ? goal.progressUpdates[goal.progressUpdates.length - 1].progressPercentage : 0} className="w-[100px]" />
                    <span className="ml-2 text-gray-600">{(goal.progressUpdates.length > 0 ? goal.progressUpdates[goal.progressUpdates.length - 1].progressPercentage : 0)}%</span>
                  </TableCell>
                  <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(goal.startDate).toLocaleDateString()}</TableCell>
                  <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(goal.endDate).toLocaleDateString()}</TableCell>
                  <TableCell className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Dialog open={isViewGoalDialogOpen && viewingGoal?.id === goal.id} onOpenChange={setIsViewGoalDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setViewingGoal(goal)} className="text-blue-600 hover:text-blue-800" aria-label={`View ${goal.title}`}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px] bg-white p-6 rounded-lg shadow-xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold text-gray-800">View Goal: {viewingGoal?.title}</DialogTitle>
                          <DialogDescription className="text-gray-600">Details of the selected goal.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4 text-gray-700">
                          <p><strong>Description:</strong> {viewingGoal?.description}</p>
                          <p><strong>Category:</strong> {viewingGoal?.category}</p>
                          <p><strong>Status:</strong> <Badge variant={getStatusBadgeVariant(viewingGoal?.status || GoalStatusEnum.NOT_STARTED)}>{viewingGoal?.status}</Badge></p>
                          <p><strong>Priority:</strong> <Badge variant={getPriorityBadgeVariant(viewingGoal?.priority || GoalPriorityEnum.LOW)}>{viewingGoal?.priority}</Badge></p>
                          <p><strong>Start Date:</strong> {viewingGoal?.startDate ? new Date(viewingGoal.startDate).toLocaleDateString() : 'N/A'}</p>
                          <p><strong>End Date:</strong> {viewingGoal?.endDate ? new Date(viewingGoal.endDate).toLocaleDateString() : 'N/A'}</p>
                          <p><strong>SMART Criteria:</strong></p>
                          <ul className="list-disc list-inside ml-4">
                            {viewingGoal?.smartCriteria && Object.entries(viewingGoal.smartCriteria).map(([key, value]) => (
                              <li key={key} className={value ? 'text-green-600' : 'text-red-600'}>
                                {key.charAt(0).toUpperCase() + key.slice(1)}: {value ? 'Yes' : 'No'}
                              </li>
                            ))}
                          </ul>
                          <p><strong>Milestones:</strong></p>
                          {viewingGoal?.milestones && viewingGoal.milestones.length > 0 ? (
                            <ul className="list-disc list-inside ml-4">
                              {viewingGoal.milestones.map(milestone => (
                                <li key={milestone.id}>{milestone.name} (Status: {milestone.status}, Progress: {milestone.progress}%)</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="ml-4 text-gray-500">No milestones defined.</p>
                          )}
                          <p><strong>Progress Updates:</strong></p>
                          {viewingGoal?.progressUpdates && viewingGoal.progressUpdates.length > 0 ? (
                            <ul className="list-disc list-inside ml-4">
                              {viewingGoal.progressUpdates.map(update => (
                                <li key={update.id}>{new Date(update.date).toLocaleDateString()}: {update.notes} ({update.progressPercentage}%)</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="ml-4 text-gray-500">No progress updates.</p>
                          )}
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsViewGoalDialogOpen(false)}>Close</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={isEditGoalDialogOpen && editingGoal?.id === goal.id} onOpenChange={setIsEditGoalDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setEditingGoal(goal)} className="text-yellow-600 hover:text-yellow-800 ml-2" aria-label={`Edit ${goal.title}`}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[475px] bg-white p-6 rounded-lg shadow-xl">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold text-gray-800">Edit Goal: {editingGoal?.title}</DialogTitle>
                          <DialogDescription className="text-gray-600">Make changes to the goal here.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-5 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right font-medium">Title</Label>
                            <Input id="title" value={editingGoal?.title || ''} onChange={handleInputChange} className="col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500" aria-required="true" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right font-medium">Description</Label>
                            <Textarea id="description" value={editingGoal?.description || ''} onChange={handleInputChange} className="col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500" aria-required="true" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="startDate" className="text-right font-medium">Start Date</Label>
                            <Input id="startDate" type="date" value={editingGoal?.startDate || ''} onChange={handleInputChange} className="col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500" aria-required="true" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="endDate" className="text-right font-medium">End Date</Label>
                            <Input id="endDate" type="date" value={editingGoal?.endDate || ''} onChange={handleInputChange} className="col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500" aria-required="true" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right font-medium">Status</Label>
                            <Select value={editingGoal?.status} onValueChange={(value) => handleSelectChange('status', value as keyof typeof GoalStatusEnum)}>
                              <SelectTrigger className="col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500" aria-label="Select goal status">
                                <SelectValue placeholder="Select Status" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.values(GoalStatusEnum).map(status => (
                                  <SelectItem key={status} value={status}>{status}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="priority" className="text-right font-medium">Priority</Label>
                            <Select value={editingGoal?.priority} onValueChange={(value) => handleSelectChange('priority', value as keyof typeof GoalPriorityEnum)}>
                              <SelectTrigger className="col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500" aria-label="Select goal priority">
                                <SelectValue placeholder="Select Priority" />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.values(GoalPriorityEnum).map(priority => (
                                  <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right font-medium">Category</Label>
                            <Input id="category" value={editingGoal?.category || ''} onChange={handleInputChange} className="col-span-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500" aria-required="true" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right font-medium">SMART Criteria</Label>
                            <div className="col-span-3 flex flex-col gap-2" role="group" aria-labelledby="smart-criteria-label">
                              {Object.keys(editingGoal?.smartCriteria || {}).map(key => (
                                <div key={key} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={`edit-smart-${key}`}
                                    checked={editingGoal?.smartCriteria?.[key as keyof typeof editingGoal.smartCriteria]}
                                    onCheckedChange={(checked) => handleSmartCriteriaChange(key as keyof typeof editingGoal.smartCriteria, checked as boolean)}
                                  />
                                  <Label htmlFor={`edit-smart-${key}`} className="capitalize">{key}</Label>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit" onClick={handleEditGoal} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white shadow-md">
                            {loading ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button variant="ghost" size="sm" onClick={() => handleDeleteGoal(goal.id)} disabled={loading} className="text-red-600 hover:text-red-800 ml-2" aria-label={`Delete ${goal.title}`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4 mr-2" /> Previous
        </Button>
        <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
        <Button
          variant="outline"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          aria-label="Next page"
        >
          Next <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default GoalTracking;

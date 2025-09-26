```typescript
import React, { useState, useEffect } from 'react';
import EnterpriseSidebar from '@/components/hr/enterprise-sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

const mockPerformanceEvaluations = [
  {
    id: 'pe-001',
    employeeName: 'Alice Johnson',
    employeeId: 'emp-001',
    department: 'Engineering',
    managerName: 'Bob Williams',
    lastReviewDate: '2024-03-15',
    overallRating: 4,
    nextReviewDate: '2025-03-15',
    status: 'Pending',
    goals: ['Complete Project X', 'Improve communication skills'],
    improvementPlans: [],
    comments: 'Strong performer, good team player.',
  },
  {
    id: 'pe-002',
    employeeName: 'Charlie Brown',
    employeeId: 'emp-002',
    department: 'Marketing',
    managerName: 'Diana Prince',
    lastReviewDate: '2024-01-20',
    overallRating: 3,
    nextReviewDate: '2025-01-20',
    status: 'Completed',
    goals: ['Increase social media engagement by 15%'],
    improvementPlans: ['Attend public speaking workshop'],
    comments: 'Needs to improve presentation skills.',
  },
  {
    id: 'pe-003',
    employeeName: 'Eve Davis',
    employeeId: 'emp-003',
    department: 'Sales',
    managerName: 'Frank Green',
    lastReviewDate: '2023-11-01',
    overallRating: 5,
    nextReviewDate: '2024-11-01',
    status: 'Overdue',
    goals: ['Exceed Q4 sales targets'],
    improvementPlans: [],
    comments: 'Consistently exceeds expectations.',
  },
  {
    id: 'pe-004',
    employeeName: 'Grace Lee',
    employeeId: 'emp-004',
    department: 'HR',
    managerName: 'Heidi Klum',
    lastReviewDate: '2024-02-10',
    overallRating: 4,
    nextReviewDate: '2025-02-10',
    status: 'Pending',
    goals: ['Streamline onboarding process'],
    improvementPlans: [],
    comments: 'Excellent at process improvement.',
  },
  {
    id: 'pe-005',
    employeeName: 'Ivan Petrov',
    employeeId: 'emp-005',
    department: 'Engineering',
    managerName: 'Bob Williams',
    lastReviewDate: '2024-04-05',
    overallRating: 3,
    nextReviewDate: '2025-04-05',
    status: 'Pending',
    goals: ['Learn new programming language'],
    improvementPlans: ['Pair programming sessions'],
    comments: 'Shows potential, needs more experience.',
  },
];

const PerformanceEvaluations = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEvaluation, setCurrentEvaluation] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvaluations = async () => {
      setLoading(true);
      setError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setEvaluations(mockPerformanceEvaluations);
      } catch (err) {
        setError('Failed to fetch performance evaluations.');
        toast({
          title: 'Error',
          description: 'Failed to fetch performance evaluations.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchEvaluations();
  }, [toast]);

  const filteredEvaluations = evaluations.filter(evaluation => {
    const matchesStatus = filterStatus === 'all' || evaluation.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch = evaluation.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          evaluation.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          evaluation.managerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleAddEditEvaluation = async (newEvaluation) => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      if (newEvaluation.id) {
        setEvaluations(evals => evals.map(evalItem => evalItem.id === newEvaluation.id ? newEvaluation : evalItem));
        toast({
          title: 'Success',
          description: 'Performance evaluation updated successfully.',
        });
      } else {
        const id = `pe-${Date.now()}`;
        setEvaluations(evals => [...evals, { ...newEvaluation, id }]);
        toast({
          title: 'Success',
          description: 'Performance evaluation added successfully.',
        });
      }
      setIsDialogOpen(false);
      setCurrentEvaluation(null);
    } catch (err) {
      setError('Failed to save evaluation.');
      toast({
        title: 'Error',
        description: 'Failed to save evaluation.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvaluation = async (id) => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setEvaluations(evals => evals.filter(evalItem => evalItem.id !== id));
      toast({
        title: 'Success',
        description: 'Performance evaluation deleted successfully.',
      });
    } catch (err) {
      setError('Failed to delete evaluation.');
      toast({
        title: 'Error',
        description: 'Failed to delete evaluation.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const StatsCard = ({ title, value, description }) => (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <EnterpriseSidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">Performance Evaluations</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Evaluations"
            value={evaluations.length}
            description="All performance reviews"
          />
          <StatsCard
            title="Average Rating"
            value={(evaluations.reduce((acc, curr) => acc + curr.overallRating, 0) / evaluations.length || 0).toFixed(1)}
            description="Across all employees"
          />
          <StatsCard
            title="Pending Reviews"
            value={evaluations.filter(e => e.status === 'Pending').length}
            description="Evaluations awaiting completion"
          />
          <StatsCard
            title="Overdue Reviews"
            value={evaluations.filter(e => e.status === 'Overdue').length}
            description="Evaluations past due date"
          />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Input
              placeholder="Search employee, department..."
              className="w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select onValueChange={setFilterStatus} value={filterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setCurrentEvaluation(null)}>Add New Evaluation</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{currentEvaluation ? 'Edit Performance Evaluation' : 'Add New Performance Evaluation'}</DialogTitle>
                <DialogDescription>
                  {currentEvaluation ? 'Make changes to the evaluation here.' : 'Fill in the details for a new performance evaluation.'}
                </DialogDescription>
              </DialogHeader>
              <EvaluationForm
                initialData={currentEvaluation}
                onSubmit={handleAddEditEvaluation}
                onCancel={() => setIsDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center p-8">
            <p className="text-gray-500">Loading evaluations...</p>
          </div>
        ) : error ? (
          <div className="text-center p-8 text-red-500">
            <p>{error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">Retry</Button>
          </div>
        ) : filteredEvaluations.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 text-lg mb-4">No performance evaluations found.</p>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setCurrentEvaluation(null)}>Add Your First Evaluation</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Performance Evaluation</DialogTitle>
                  <DialogDescription>
                    Fill in the details for a new performance evaluation.
                  </DialogDescription>
                </DialogHeader>
                <EvaluationForm
                  initialData={null}
                  onSubmit={handleAddEditEvaluation}
                  onCancel={() => setIsDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Last Review</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Next Review</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvaluations.map((evaluation) => (
                  <TableRow key={evaluation.id}>
                    <TableCell className="font-medium">{evaluation.employeeName}</TableCell>
                    <TableCell>{evaluation.department}</TableCell>
                    <TableCell>{evaluation.managerName}</TableCell>
                    <TableCell>{evaluation.lastReviewDate}</TableCell>
                    <TableCell>{evaluation.overallRating}</TableCell>
                    <TableCell>{evaluation.nextReviewDate}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${evaluation.status === 'Pending' ? 'bg-yellow-100 text-yellow-800'
                          : evaluation.status === 'Completed' ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'}`}>
                        {evaluation.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setCurrentEvaluation(evaluation);
                          setIsDialogOpen(true);
                        }}
                        className="mr-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteEvaluation(evaluation.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

const EvaluationForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialData || {
    employeeName: '',
    department: '',
    managerName: '',
    lastReviewDate: '',
    overallRating: 3,
    nextReviewDate: '',
    status: 'Pending',
    goals: [],
    improvementPlans: [],
    comments: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleRatingChange = (value) => {
    setFormData(prev => ({ ...prev, overallRating: parseInt(value) }));
  };

  const handleStatusChange = (value) => {
    setFormData(prev => ({ ...prev, status: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="employeeName" className="text-right">Employee Name</Label>
        <Input id="employeeName" value={formData.employeeName} onChange={handleChange} className="col-span-3" required />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="department" className="text-right">Department</Label>
        <Input id="department" value={formData.department} onChange={handleChange} className="col-span-3" required />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="managerName" className="text-right">Manager Name</Label>
        <Input id="managerName" value={formData.managerName} onChange={handleChange} className="col-span-3" required />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="lastReviewDate" className="text-right">Last Review Date</Label>
        <Input id="lastReviewDate" type="date" value={formData.lastReviewDate} onChange={handleChange} className="col-span-3" required />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="overallRating" className="text-right">Overall Rating</Label>
        <Select onValueChange={handleRatingChange} value={String(formData.overallRating)}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select Rating" />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5].map(rating => (
              <SelectItem key={rating} value={String(rating)}>{rating}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="nextReviewDate" className="text-right">Next Review Date</Label>
        <Input id="nextReviewDate" type="date" value={formData.nextReviewDate} onChange={handleChange} className="col-span-3" required />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="status" className="text-right">Status</Label>
        <Select onValueChange={handleStatusChange} value={formData.status}>
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="goals" className="text-right">Goals (comma-separated)</Label>
        <Textarea
          id="goals"
          value={formData.goals.join(', ')}
          onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value.split(',').map(s => s.trim()) }))}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="improvementPlans" className="text-right">Improvement Plans (comma-separated)</Label>
        <Textarea
          id="improvementPlans"
          value={formData.improvementPlans.join(', ')}
          onChange={(e) => setFormData(prev => ({ ...prev, improvementPlans: e.target.value.split(',').map(s => s.trim()) }))}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="comments" className="text-right">Comments</Label>
        <Textarea id="comments" value={formData.comments} onChange={handleChange} className="col-span-3" />
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        </DialogClose>
        <Button type="submit">Save changes</Button>
      </DialogFooter>
    </form>
  );
};

export default PerformanceEvaluations;
```
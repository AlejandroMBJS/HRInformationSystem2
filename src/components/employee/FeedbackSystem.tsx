import React, { useState, useEffect, useMemo } from 'react';
import { mockFeedbackItems, mockUsers, mockReviewCycles, mockRecognitionAwards } from '../mockData';
import { FeedbackItem, User, ReviewCycle, RecognitionAward, FilterOptions, SortOptions } from '../types/feedbackTypes';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner'; // Assuming sonner is pre-installed for toasts
import { PlusCircle, Search, Filter, ArrowUp, ArrowDown, Edit, Trash2 } from 'lucide-react';

interface FeedbackSystemProps {
  currentUser: User;
}

const FeedbackSystem: React.FC<FeedbackSystemProps> = ({ currentUser }) => {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reviewCycles, setReviewCycles] = useState<ReviewCycle[]>([]);
  const [recognitionAwards, setRecognitionAwards] = useState<RecognitionAward[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [sort, setSort] = useState<SortOptions>({ field: 'createdAt', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState<boolean>(false);
  const [editingFeedback, setEditingFeedback] = useState<FeedbackItem | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setFeedbackItems(mockFeedbackItems);
        setUsers(mockUsers);
        setReviewCycles(mockReviewCycles);
        setRecognitionAwards(mockRecognitionAwards);
      } catch (err) {
        setError('Failed to load feedback data.');
        toast.error('Failed to load feedback data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getFilteredAndSortedFeedback = useMemo(() => {
    let filtered = [...feedbackItems];

    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        users.find(u => u.id === item.reviewerId)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        users.find(u => u.id === item.revieweeId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.type) {
      filtered = filtered.filter(item => item.type === filters.type);
    }
    if (filters.reviewerId) {
      filtered = filtered.filter(item => item.reviewerId === filters.reviewerId);
    }
    if (filters.revieweeId) {
      filtered = filtered.filter(item => item.revieweeId === filters.revieweeId);
    }
    if (filters.cycleId) {
      filtered = filtered.filter(item => item.cycleId === filters.cycleId);
    }
    if (filters.status) {
      filtered = filtered.filter(item => item.status === filters.status);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sort.field as keyof FeedbackItem];
      const bValue = b[sort.field as keyof FeedbackItem];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sort.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sort.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });

    return filtered;
  }, [feedbackItems, users, searchTerm, filters, sort]);

  const handleAddEditFeedback = (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const newFeedback: FeedbackItem = {
      id: editingFeedback?.id || `feedback-${Date.now()}`,
      reviewerId: formData.get('reviewerId') as string,
      revieweeId: formData.get('revieweeId') as string,
      cycleId: formData.get('cycleId') as string,
      type: formData.get('type') as FeedbackItem['type'],
      rating: formData.get('rating') ? parseInt(formData.get('rating') as string) : undefined,
      comment: formData.get('comment') as string,
      createdAt: editingFeedback?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: formData.get('status') as FeedbackItem['status'] || 'draft',
      tags: (formData.get('tags') as string)?.split(',').map(tag => tag.trim()).filter(Boolean) || [],
    };

    if (editingFeedback) {
      setFeedbackItems(feedbackItems.map(item => item.id === newFeedback.id ? newFeedback : item));
      toast.success('Feedback updated successfully!');
    } else {
      setFeedbackItems([...feedbackItems, newFeedback]);
      toast.success('Feedback added successfully!');
    }
    setIsAddEditModalOpen(false);
    setEditingFeedback(null);
  };

  const handleDeleteFeedback = (id: string) => {
    if (window.confirm('Are you sure you want to delete this feedback item?')) {
      setFeedbackItems(feedbackItems.filter(item => item.id !== id));
      toast.success('Feedback deleted successfully!');
    }
  };

  const openEditModal = (item: FeedbackItem) => {
    setEditingFeedback(item);
    setIsAddEditModalOpen(true);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-lg text-gray-700">Loading feedback system...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-red-500 text-lg">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen font-sans">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Employee Feedback System</h1>

      {/* Search, Filter, Sort Controls */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Search feedback by comment or user..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search feedback items"
          />
        </div>

        <Select onValueChange={(value) => setFilters({ ...filters, type: value as FeedbackItem['type'] || undefined })} value={filters.type || ''}>
          <SelectTrigger className="w-full md:w-[180px] h-10">
            <SelectValue placeholder="Filter by Type" aria-label="Filter by feedback type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            <SelectItem value="360_review">360 Review</SelectItem>
            <SelectItem value="peer_feedback">Peer Feedback</SelectItem>
            <SelectItem value="recognition">Recognition</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => setFilters({ ...filters, reviewerId: value || undefined })} value={filters.reviewerId || ''}>
          <SelectTrigger className="w-full md:w-[180px] h-10">
            <SelectValue placeholder="Filter by Reviewer" aria-label="Filter by reviewer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Reviewers</SelectItem>
            {users.map(user => (
              <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(value) => setSort({ ...sort, field: value as SortOptions['field'] })} value={sort.field}>
          <SelectTrigger className="w-full md:w-[180px] h-10">
            <SelectValue placeholder="Sort by" aria-label="Sort by field" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Created At</SelectItem>
            <SelectItem value="updatedAt">Updated At</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setSort(prev => ({ ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' }))}
          aria-label={`Sort direction: ${sort.direction === 'asc' ? 'ascending' : 'descending'}`}
        >
          {sort.direction === 'asc' ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
        </Button>

        <Dialog open={isAddEditModalOpen} onOpenChange={setIsAddEditModalOpen}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto" onClick={() => setEditingFeedback(null)}><PlusCircle className="mr-2" size={20} /> Add Feedback</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingFeedback ? 'Edit Feedback' : 'Add New Feedback'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddEditFeedback} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reviewerId" className="text-right">Reviewer</Label>
                <Select name="reviewerId" defaultValue={editingFeedback?.reviewerId || currentUser.id} required>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a reviewer" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="revieweeId" className="text-right">Reviewee</Label>
                <Select name="revieweeId" defaultValue={editingFeedback?.revieweeId || ''} required>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a reviewee" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cycleId" className="text-right">Review Cycle</Label>
                <Select name="cycleId" defaultValue={editingFeedback?.cycleId || ''} required>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    {reviewCycles.map(cycle => (
                      <SelectItem key={cycle.id} value={cycle.id}>{cycle.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">Type</Label>
                <Select name="type" defaultValue={editingFeedback?.type || ''} required>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select feedback type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="360_review">360 Review</SelectItem>
                    <SelectItem value="peer_feedback">Peer Feedback</SelectItem>
                    <SelectItem value="recognition">Recognition</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rating" className="text-right">Rating (1-5)</Label>
                <Input id="rating" name="rating" type="number" min="1" max="5" defaultValue={editingFeedback?.rating || ''} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="comment" className="text-right">Comment</Label>
                <Textarea id="comment" name="comment" defaultValue={editingFeedback?.comment || ''} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tags" className="text-right">Tags (comma-separated)</Label>
                <Input id="tags" name="tags" defaultValue={editingFeedback?.tags?.join(', ') || ''} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Status</Label>
                <Select name="status" defaultValue={editingFeedback?.status || 'draft'} required>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="anonymous">Anonymous</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">{editingFeedback ? 'Save Changes' : 'Add Feedback'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Feedback Items Section */}
      <section aria-labelledby="feedback-items-heading" className="bg-white shadow-lg rounded-xl p-6">
        <h2 id="feedback-items-heading" className="text-3xl font-bold text-gray-800 mb-6">All Feedback Items</h2>
        <div className="grid gap-6">
          {getFilteredAndSortedFeedback.length > 0 ? (
            getFilteredAndSortedFeedback.map((item) => {
              const reviewer = users.find(u => u.id === item.reviewerId);
              const reviewee = users.find(u => u.id === item.revieweeId);
              const cycle = reviewCycles.find(c => c.id === item.cycleId);

              return (
                <div key={item.id} className="border border-gray-200 rounded-lg p-5 bg-gray-50 hover:shadow-md transition-shadow duration-200 ease-in-out">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${item.type === '360_review' ? 'bg-blue-100 text-blue-800' : item.type === 'peer_feedback' ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {item.type.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-800 mb-2 text-base"><strong>From:</strong> {reviewer?.name || 'Unknown'} <strong>To:</strong> {reviewee?.name || 'Unknown'}</p>
                  {item.rating && <p className="text-gray-700 mb-2 text-base"><strong>Rating:</strong> {item.rating}/5</p>}
                  <p className="text-gray-700 mb-3 text-base">{item.comment}</p>
                  {cycle && <p className="text-sm text-gray-600"><strong>Cycle:</strong> {cycle.name}</p>}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {item.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-0.5 bg-gray-200 text-gray-700 text-xs rounded-full">{tag}</span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 flex gap-3 justify-end">
                    <Button variant="outline" size="sm" onClick={() => openEditModal(item)} aria-label="Edit feedback"><Edit className="mr-2" size={16} /> Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteFeedback(item.id)} aria-label="Delete feedback"><Trash2 className="mr-2" size={16} /> Delete</Button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-600 text-lg py-8">No feedback items found matching your criteria.</p>
          )}
        </div>
      </section>

      {/* Recognition Awards Section */}
      <section aria-labelledby="recognition-heading" className="bg-white shadow-lg rounded-xl p-6 mt-8">
        <h2 id="recognition-heading" className="text-3xl font-bold text-gray-800 mb-6">Recognition Awards</h2>
        <div className="grid gap-6">
          {recognitionAwards.length > 0 ? (
            recognitionAwards.map((award) => {
              const giver = users.find(u => u.id === award.giverId);
              const receiver = users.find(u => u.id === award.receiverId);
              return (
                <div key={award.id} className="border border-green-200 rounded-lg p-5 bg-green-50 hover:shadow-md transition-shadow duration-200 ease-in-out">
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">{award.awardType}</span>
                    <span className="text-xs text-gray-500">{new Date(award.givenAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-800 mb-2 text-base"><strong>From:</strong> {giver?.name || 'Unknown'} <strong>To:</strong> {receiver?.name || 'Unknown'}</p>
                  <p className="text-gray-700 text-base">{award.message}</p>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-600 text-lg py-8">No recognition awards found.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default FeedbackSystem;

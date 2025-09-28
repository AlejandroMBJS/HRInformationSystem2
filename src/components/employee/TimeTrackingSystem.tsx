import React, { useState, useEffect, useMemo } from 'react';
import { TimeEntry, User, TimeEntryFilter, TimeEntriesApiResponse } from './types';
import { fetchTimeEntries, createTimeEntry, updateTimeEntry, deleteTimeEntry, clockIn, clockOut, startBreak, endBreak, mockUsers } from './mockData';
import TimeEntryList from './components/TimeEntryList';
import TimeEntryForm from './components/TimeEntryForm';
import ClockInOutButton from './components/ClockInOutButton';
import TimeTrackingDashboard from './components/TimeTrackingDashboard';
import FilterAndSearch from './components/FilterAndSearch';
import Pagination from './components/Pagination';
import * as Dialog from '@radix-ui/react-dialog';
import { PlusIcon } from '@radix-ui/react-icons';
import { formatDuration } from './utils';

interface TimeTrackingSystemProps {
  currentUser: User;
}

const TimeTrackingSystem: React.FC<TimeTrackingSystemProps> = ({ currentUser }) => {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TimeEntryFilter>({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | undefined>(undefined);
  const [isClockedIn, setIsClockedIn] = useState<boolean>(false);
  const [currentClockedInEntryId, setCurrentClockedInEntryId] = useState<string | undefined>(undefined);
  const [isBreakActive, setIsBreakActive] = useState<boolean>(false);
  const [currentBreakId, setCurrentBreakId] = useState<string | undefined>(undefined);

  const loadTimeEntries = async () => {
    setLoading(true);
    setError(null);
    try {
      const data: TimeEntriesApiResponse = await fetchTimeEntries(filter, searchTerm, currentPage);
      setTimeEntries(data.entries);
      setTotalPages(data.meta.totalPages);

      // Check if current user is clocked in
      const activeEntry = data.entries.find(entry => entry.userId === currentUser.id && entry.status === 'clocked_in');
      setIsClockedIn(!!activeEntry);
      setCurrentClockedInEntryId(activeEntry?.id);

      // Check if break is active
      const activeBreak = activeEntry?.breaks?.find(b => !b.breakEndTime);
      setIsBreakActive(!!activeBreak);
      setCurrentBreakId(activeBreak?.id);

    } catch (err) {
      setError('Failed to fetch time entries.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTimeEntries();
  }, [filter, searchTerm, currentPage, currentUser.id]);

  const handleClockIn = async () => {
    try {
      const newEntry = await clockIn(currentUser.id);
      if (newEntry) {
        setTimeEntries(prev => [newEntry, ...prev]);
        setIsClockedIn(true);
        setCurrentClockedInEntryId(newEntry.id);
        alert('Clocked in successfully!');
      }
    } catch (err) {
      setError('Failed to clock in.');
      console.error(err);
    }
  };

  const handleClockOut = async () => {
    if (!currentClockedInEntryId) return;
    try {
      const updatedEntry = await clockOut(currentClockedInEntryId);
      if (updatedEntry) {
        setTimeEntries(prev => prev.map(entry => entry.id === updatedEntry.id ? updatedEntry : entry));
        setIsClockedIn(false);
        setCurrentClockedInEntryId(undefined);
        setIsBreakActive(false);
        setCurrentBreakId(undefined);
        alert('Clocked out successfully!');
      }
    } catch (err) {
      setError('Failed to clock out.');
      console.error(err);
    }
  };

  const handleStartBreak = async () => {
    if (!currentClockedInEntryId) return;
    try {
      const updatedEntry = await startBreak(currentClockedInEntryId);
      if (updatedEntry) {
        setTimeEntries(prev => prev.map(entry => entry.id === updatedEntry.id ? updatedEntry : entry));
        const activeBreak = updatedEntry.breaks?.find(b => !b.breakEndTime);
        setIsBreakActive(!!activeBreak);
        setCurrentBreakId(activeBreak?.id);
        alert('Break started!');
      }
    } catch (err) {
      setError('Failed to start break.');
      console.error(err);
    }
  };

  const handleEndBreak = async () => {
    if (!currentClockedInEntryId || !currentBreakId) return;
    try {
      const updatedEntry = await endBreak(currentClockedInEntryId, currentBreakId);
      if (updatedEntry) {
        setTimeEntries(prev => prev.map(entry => entry.id === updatedEntry.id ? updatedEntry : entry));
        setIsBreakActive(false);
        setCurrentBreakId(undefined);
        alert('Break ended!');
      }
    } catch (err) {
      setError('Failed to end break.');
      console.error(err);
    }
  };

  const handleAddTimeEntry = async (newEntry: Partial<TimeEntry>, id?: string) => {
    try {
      const createdEntry = await createTimeEntry({ ...newEntry, userId: currentUser.id });
      setTimeEntries(prev => [createdEntry, ...prev]);
      setIsFormOpen(false);
      alert('Time entry added successfully!');
    } catch (err) {
      setError('Failed to add time entry.');
      console.error(err);
    }
  };

  const handleUpdateTimeEntry = async (id: string, updatedEntry: Partial<TimeEntry>) => {
    try {
      const entry = await updateTimeEntry(id, updatedEntry as TimeEntry);
      if (entry) {
        setTimeEntries(prev => prev.map(e => (e.id === id ? entry : e)));
        setIsFormOpen(false);
        setEditingEntry(undefined);
        alert('Time entry updated successfully!');
      }
    } catch (err) {
      setError('Failed to update time entry.');
      console.error(err);
    }
  };

  const handleDeleteTimeEntry = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this time entry?')) {
      try {
        const success = await deleteTimeEntry(id);
        if (success) {
          setTimeEntries(prev => prev.filter(e => e.id !== id));
          alert('Time entry deleted successfully!');
        }
      } catch (err) {
        setError('Failed to delete time entry.');
        console.error(err);
      }
    }
  };

  const handleEditClick = (entry: TimeEntry) => {
    setEditingEntry(entry);
    setIsFormOpen(true);
  };

  const handleAddClick = () => {
    setEditingEntry(undefined);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingEntry(undefined);
  };

  const currentDayEntries = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return timeEntries.filter(entry => entry.userId === currentUser.id && entry.date === today);
  }, [timeEntries, currentUser.id]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6 text-center">Time Tracking System</h1>

        <TimeTrackingDashboard currentUser={currentUser} timeEntries={currentDayEntries} />

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
          <ClockInOutButton
            onClockIn={handleClockIn}
            onClockOut={handleClockOut}
            isClockedIn={isClockedIn}
            onStartBreak={handleStartBreak}
            onEndBreak={handleEndBreak}
            isBreakActive={isBreakActive}
          />
          <button
            onClick={handleAddClick}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            aria-label="Add new time entry"
          >
            <PlusIcon className="mr-2" /> Add Time Entry
          </button>
        </div>

        <div className="mb-6">
          <FilterAndSearch onFilterChange={setFilter} onSearchChange={setSearchTerm} />
        </div>

        {loading && (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="ml-4 text-gray-600">Loading time entries...</p>
          </div>
        )}
        {error && <p className="text-red-500 text-center py-4">Error: {error}</p>}

        {!loading && !error && (
          <>
            {timeEntries.length === 0 ? (
              <p className="text-center text-gray-500 py-10">No time entries found for the selected filters.</p>
            ) : (
              <TimeEntryList
                timeEntries={timeEntries}
                onEdit={handleEditClick}
                onDelete={handleDeleteTimeEntry}
              />
            )}
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </>
        )}

        <Dialog.Root open={isFormOpen} onOpenChange={setIsFormOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="bg-black/30 data-[state=open]:animate-overlayShow fixed inset-0" />
            <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
              <Dialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
                {editingEntry ? 'Edit Time Entry' : 'Add New Time Entry'}
              </Dialog.Title>
              <Dialog.Description className="text-mauve11 mt-[10px] mb-5 text-[15px] leading-normal">
                {editingEntry ? 'Make changes to the time entry here.' : 'Fill in the details for the new time entry.'}
              </Dialog.Description>
              <TimeEntryForm
                onSubmit={(entry, id) => {
                  if (id) {
                    handleUpdateTimeEntry(id, entry);
                  } else {
                    handleAddTimeEntry(entry);
                  }
                }}
                initialData={editingEntry}
                onClose={handleFormClose}
              />
              <Dialog.Close asChild>
                <button
                  className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                  aria-label="Close"
                >
                  <PlusIcon className="rotate-45" />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
};

export default TimeTrackingSystem;

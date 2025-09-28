import React, { useState, useEffect } from 'react';
import { Document, DocumentCategory, DocumentFilter, DocumentSort, DocumentFormValues, DocumentVersion } from '../types/documentManagement';
import { mockDocuments, mockDocumentCategories, mockDocumentVersions } from '../data/mockDocuments';

import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Label from '@radix-ui/react-label';

// Placeholder for a generic Button component (can be replaced with a proper UI library button)
const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background
        bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 ${className}`}
      {...props}
    />
  )
);
Button.displayName = 'Button';

// Placeholder for a generic Input component
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50
        ${className}`}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = 'Input';

const DocumentManagement: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [filters, setFilters] = useState<DocumentFilter>({});
  const [sort, setSort] = useState<DocumentSort>({ field: 'uploadDate', order: 'desc' });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isAddDocumentDialogOpen, setIsAddDocumentDialogOpen] = useState<boolean>(false);
  const [isViewDocumentDialogOpen, setIsViewDocumentDialogOpen] = useState<boolean>(false);
  const [isEditDocumentDialogOpen, setIsEditDocumentDialogOpen] = useState<boolean>(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const [newDocumentForm, setNewDocumentForm] = useState<DocumentFormValues>({
    name: '',
    file: null,
    category: '',
    status: 'draft',
    sharedWith: [],
  });

  const [editDocumentForm, setEditDocumentForm] = useState<DocumentFormValues>({
    name: '',
    file: null,
    category: '',
    status: 'draft',
    sharedWith: [],
  });

  useEffect(() => {
    if (selectedDocument && isEditDocumentDialogOpen) {
      setEditDocumentForm({
        name: selectedDocument.name,
        file: null, // File input is typically reset for security/UX
        category: selectedDocument.category,
        status: selectedDocument.status,
        sharedWith: selectedDocument.sharedWith,
      });
    }
  }, [selectedDocument, isEditDocumentDialogOpen]);

  const filteredAndSortedDocuments = documents
    .filter(doc => {
      const matchesSearch = searchTerm === '' || doc.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !filters.category || doc.category === filters.category;
      const matchesStatus = !filters.status || doc.status === filters.status;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      const fieldA = a[sort.field];
      const fieldB = b[sort.field];

      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return sort.order === 'asc' ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
      } else if (typeof fieldA === 'number' && typeof fieldB === 'number') {
        return sort.order === 'asc' ? fieldA - fieldB : fieldB - fieldA;
      } else if (sort.field === 'uploadDate') {
        const dateA = new Date(a.uploadDate);
        const dateB = new Date(b.uploadDate);
        return sort.order === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      }
      return 0;
    });

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!newDocumentForm.name || !newDocumentForm.category || !newDocumentForm.file) {
        throw new Error('Please fill all required fields and select a file.');
      }

      const newDoc: Document = {
        id: `doc${documents.length + 1}`,
        name: newDocumentForm.name,
        fileType: newDocumentForm.file.name.split('.').pop() || 'unknown',
        fileSize: newDocumentForm.file.size,
        uploadDate: new Date().toISOString(),
        uploader: 'Current User', // Placeholder
        category: newDocumentForm.category,
        status: newDocumentForm.status,
        version: 1.0,
        sharedWith: newDocumentForm.sharedWith,
        previewUrl: URL.createObjectURL(newDocumentForm.file), // For local preview
      };
      setDocuments(prev => [...prev, newDoc]);
      setNewDocumentForm({
        name: '',
        file: null,
        category: '',
        status: 'draft',
        sharedWith: [],
      });
      setIsAddDocumentDialogOpen(false);
    } catch (e: any) {
      setError('Failed to add document: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!selectedDocument) throw new Error("No document selected for update.");
      if (!editDocumentForm.name || !editDocumentForm.category) {
        throw new Error('Please fill all required fields.');
      }

      const updatedDoc: Document = {
        ...selectedDocument,
        name: editDocumentForm.name,
        category: editDocumentForm.category,
        status: editDocumentForm.status,
        sharedWith: editDocumentForm.sharedWith,
        // If a new file is selected, update fileType, fileSize, previewUrl, and increment version
        ...(editDocumentForm.file && {
          fileType: editDocumentForm.file.name.split('.').pop() || 'unknown',
          fileSize: editDocumentForm.file.size,
          previewUrl: URL.createObjectURL(editDocumentForm.file),
          version: selectedDocument.version + 0.1, // Simple version increment
        }),
      };
      setDocuments(prev => prev.map(doc => (doc.id === updatedDoc.id ? updatedDoc : doc)));
      setIsEditDocumentDialogOpen(false);
      setSelectedDocument(updatedDoc); // Update selected document in view modal if open
    } catch (e: any) {
      setError('Failed to update document: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      setDocuments(prev => prev.filter(doc => doc.id !== id));
    } catch (e: any) {
      setError('Failed to delete document: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setIsViewDocumentDialogOpen(true);
  };

  const handleEditDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setIsEditDocumentDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8" aria-label="Document Management System">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">Document Management</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>}

      {loading && <div className="text-blue-500 mb-4" role="status" aria-live="polite">Loading...</div>}

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        <Input
          type="text"
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/3 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          aria-label="Search documents by name"
        />
        <div className="flex space-x-2">
          <Select.Root
            value={filters.category || ''}
            onValueChange={(value) => setFilters(prev => ({ ...prev, category: value === '' ? undefined : value }))}
          >
            <Select.Trigger className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-[180px]"
              aria-label="Filter by category"
            >
              <Select.Value placeholder="All Categories" />
              <Select.Icon />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
                <Select.Viewport className="p-1">
                  <Select.Item value="" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                    <Select.ItemText>All Categories</Select.ItemText>
                  </Select.Item>
                  {mockDocumentCategories.map(cat => (
                    <Select.Item key={cat.id} value={cat.name} className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                      <Select.ItemText>{cat.name}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>

          <Select.Root
            value={filters.status || ''}
            onValueChange={(value) => setFilters(prev => ({ ...prev, status: value === '' ? undefined : value as 'draft' | 'published' | 'archived' }))}
          >
            <Select.Trigger className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-[180px]"
              aria-label="Filter by status"
            >
              <Select.Value placeholder="All Statuses" />
              <Select.Icon />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
                <Select.Viewport className="p-1">
                  <Select.Item value="" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                    <Select.ItemText>All Statuses</Select.ItemText>
                  </Select.Item>
                  <Select.Item value="published" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                    <Select.ItemText>Published</Select.ItemText>
                  </Select.Item>
                  <Select.Item value="draft" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                    <Select.ItemText>Draft</Select.ItemText>
                  </Select.Item>
                  <Select.Item value="archived" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                    <Select.ItemText>Archived</Select.ItemText>
                  </Select.Item>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>

          <Button onClick={() => setFilters({})} className="bg-gray-200 text-gray-700 hover:bg-gray-300 p-2 rounded-md shadow-sm" aria-label="Clear all filters">
            Clear Filters
          </Button>
        </div>
        <Dialog.Root open={isAddDocumentDialogOpen} onOpenChange={setIsAddDocumentDialogOpen}>
          <Dialog.Trigger asChild>
            <Button className="bg-blue-600 text-white hover:bg-blue-700 p-2 rounded-md shadow-sm" aria-label="Add new document">
              Add New Document
            </Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="bg-black/30 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50" />
            <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full">
              <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">Add Document</Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground">Fill in the details for the new document.</Dialog.Description>
              <form onSubmit={handleAddDocument} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label.Root htmlFor="name" className="text-right">Name</Label.Root>
                  <Input
                    id="name"
                    value={newDocumentForm.name}
                    onChange={(e) => setNewDocumentForm({ ...newDocumentForm, name: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label.Root htmlFor="file" className="text-right">File</Label.Root>
                  <Input
                    id="file"
                    type="file"
                    onChange={(e) => setNewDocumentForm({ ...newDocumentForm, file: e.target.files ? e.target.files[0] : null })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label.Root htmlFor="category" className="text-right">Category</Label.Root>
                  <Select.Root
                    value={newDocumentForm.category}
                    onValueChange={(value) => setNewDocumentForm({ ...newDocumentForm, category: value })}
                  >
                    <Select.Trigger className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3">
                      <Select.Value placeholder="Select a category" />
                      <Select.Icon />
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
                        <Select.Viewport className="p-1">
                          {mockDocumentCategories.map(cat => (
                            <Select.Item key={cat.id} value={cat.name} className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                              <Select.ItemText>{cat.name}</Select.ItemText>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label.Root htmlFor="status" className="text-right">Status</Label.Root>
                  <Select.Root
                    value={newDocumentForm.status}
                    onValueChange={(value) => setNewDocumentForm({ ...newDocumentForm, status: value as 'draft' | 'published' | 'archived' })}
                  >
                    <Select.Trigger className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3">
                      <Select.Value />
                      <Select.Icon />
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
                        <Select.Viewport className="p-1">
                          <Select.Item value="draft" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">Draft</Select.Item>
                          <Select.Item value="published" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">Published</Select.Item>
                          <Select.Item value="archived" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">Archived</Select.Item>
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>
                <div className="flex justify-end gap-2">
                  <Dialog.Close asChild>
                    <Button type="button" className="bg-gray-200 text-gray-700 hover:bg-gray-300">Cancel</Button>
                  </Dialog.Close>
                  <Button type="submit">Add Document</Button>
                </div>
              </form>
              <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <span className="sr-only">Close</span>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                <Button onClick={() => setSort({ field: 'name', order: sort.field === 'name' && sort.order === 'asc' ? 'desc' : 'asc' })} className="flex items-center space-x-1" aria-sort={sort.field === 'name' ? (sort.order === 'asc' ? 'ascending' : 'descending') : 'none'}>
                  Name {sort.field === 'name' && (sort.order === 'asc' ? '▲' : '▼')}
                </Button>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                <Button onClick={() => setSort({ field: 'category', order: sort.field === 'category' && sort.order === 'asc' ? 'desc' : 'asc' })} className="flex items-center space-x-1" aria-sort={sort.field === 'category' ? (sort.order === 'asc' ? 'ascending' : 'descending') : 'none'}>
                  Category {sort.field === 'category' && (sort.order === 'asc' ? '▲' : '▼')}
                </Button>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                <Button onClick={() => setSort({ field: 'uploadDate', order: sort.field === 'uploadDate' && sort.order === 'asc' ? 'desc' : 'asc' })} className="flex items-center space-x-1" aria-sort={sort.field === 'uploadDate' ? (sort.order === 'asc' ? 'ascending' : 'descending') : 'none'}>
                  Upload Date {sort.field === 'uploadDate' && (sort.order === 'asc' ? '▲' : '▼')}
                </Button>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Version
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredAndSortedDocuments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400">
                  No documents found.
                </td>
              </tr>
            ) : (
              filteredAndSortedDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{doc.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{doc.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(doc.uploadDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${doc.status === 'published' ? 'bg-green-100 text-green-800' : doc.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{doc.version}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button onClick={() => handleViewDocument(doc)} className="text-blue-600 hover:text-blue-900 mr-2" aria-label={`View ${doc.name}`}>View</Button>
                    <Button onClick={() => handleEditDocument(doc)} className="text-indigo-600 hover:text-indigo-900 mr-2" aria-label={`Edit ${doc.name}`}>Edit</Button>
                    <Button onClick={() => handleDeleteDocument(doc.id)} className="text-red-600 hover:text-red-900" aria-label={`Delete ${doc.name}`}>Delete</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* View Document Dialog */}
      <Dialog.Root open={isViewDocumentDialogOpen} onOpenChange={setIsViewDocumentDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/30 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-2xl translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
            <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">View Document: {selectedDocument?.name}</Dialog.Title>
            <Dialog.Description className="text-sm text-muted-foreground">Details and versions of the document.</Dialog.Description>
            {selectedDocument && (
              <div className="grid gap-4 py-4">
                <p><strong>Name:</strong> {selectedDocument.name}</p>
                <p><strong>Category:</strong> {selectedDocument.category}</p>
                <p><strong>Status:</strong> {selectedDocument.status}</p>
                <p><strong>Uploader:</strong> {selectedDocument.uploader}</p>
                <p><strong>Upload Date:</strong> {new Date(selectedDocument.uploadDate).toLocaleString()}</p>
                <p><strong>File Type:</strong> {selectedDocument.fileType}</p>
                <p><strong>File Size:</strong> {(selectedDocument.fileSize / 1024 / 1024).toFixed(2)} MB</p>
                <p><strong>Current Version:</strong> {selectedDocument.version}</p>
                <p><strong>Shared With:</strong> {selectedDocument.sharedWith.join(', ') || 'None'}</p>
                {selectedDocument.previewUrl && (
                  <div>
                    <strong>Preview:</strong>
                    {selectedDocument.fileType === 'pdf' ? (
                      <iframe src={selectedDocument.previewUrl} width="100%" height="300px" title="Document Preview"></iframe>
                    ) : selectedDocument.fileType.match(/^(png|jpg|jpeg|gif)$/) ? (
                      <img src={selectedDocument.previewUrl} alt="Document Preview" className="max-w-full h-auto" />
                    ) : (
                      <a href={selectedDocument.previewUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Download to view</a>
                    )}
                  </div>
                )}

                <h3 className="text-md font-semibold mt-4">Version History</h3>
                <ul className="list-disc pl-5">
                  {mockDocumentVersions.filter(v => v.documentId === selectedDocument.id).map(version => (
                    <li key={version.id} className="text-sm text-gray-700 dark:text-gray-300">
                      Version {version.versionNumber} by {version.uploader} on {new Date(version.uploadDate).toLocaleDateString()} - {version.changes || 'No changes specified'}
                      <a href={version.fileUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline">(Download)</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <Dialog.Close asChild>
                <Button type="button" className="bg-gray-200 text-gray-700 hover:bg-gray-300">Close</Button>
              </Dialog.Close>
            </div>
            <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <span className="sr-only">Close</span>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Edit Document Dialog */}
      <Dialog.Root open={isEditDocumentDialogOpen} onOpenChange={setIsEditDocumentDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/30 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
            <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">Edit Document: {selectedDocument?.name}</Dialog.Title>
            <Dialog.Description className="text-sm text-muted-foreground">Update the document details.</Dialog.Description>
            {selectedDocument && (
              <form onSubmit={handleUpdateDocument} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label.Root htmlFor="edit-name" className="text-right">Name</Label.Root>
                  <Input
                    id="edit-name"
                    value={editDocumentForm.name}
                    onChange={(e) => setEditDocumentForm({ ...editDocumentForm, name: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label.Root htmlFor="edit-file" className="text-right">Replace File</Label.Root>
                  <Input
                    id="edit-file"
                    type="file"
                    onChange={(e) => setEditDocumentForm({ ...editDocumentForm, file: e.target.files ? e.target.files[0] : null })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label.Root htmlFor="edit-category" className="text-right">Category</Label.Root>
                  <Select.Root
                    value={editDocumentForm.category}
                    onValueChange={(value) => setEditDocumentForm({ ...editDocumentForm, category: value })}
                  >
                    <Select.Trigger className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3">
                      <Select.Value placeholder="Select a category" />
                      <Select.Icon />
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
                        <Select.Viewport className="p-1">
                          {mockDocumentCategories.map(cat => (
                            <Select.Item key={cat.id} value={cat.name} className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                              <Select.ItemText>{cat.name}</Select.ItemText>
                            </Select.Item>
                          ))}
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label.Root htmlFor="edit-status" className="text-right">Status</Label.Root>
                  <Select.Root
                    value={editDocumentForm.status}
                    onValueChange={(value) => setEditDocumentForm({ ...editDocumentForm, status: value as 'draft' | 'published' | 'archived' })}
                  >
                    <Select.Trigger className="flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 col-span-3">
                      <Select.Value />
                      <Select.Icon />
                    </Select.Trigger>
                    <Select.Portal>
                      <Select.Content className="relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
                        <Select.Viewport className="p-1">
                          <Select.Item value="draft" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">Draft</Select.Item>
                          <Select.Item value="published" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">Published</Select.Item>
                          <Select.Item value="archived" className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">Archived</Select.Item>
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>
                {/* Shared With - simple text input for now, could be multi-select later */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label.Root htmlFor="edit-sharedWith" className="text-right">Shared With (comma-separated)</Label.Root>
                  <Input
                    id="edit-sharedWith"
                    value={editDocumentForm.sharedWith.join(', ')}
                    onChange={(e) => setEditDocumentForm({ ...editDocumentForm, sharedWith: e.target.value.split(',').map(s => s.trim()) })}
                    className="col-span-3"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Dialog.Close asChild>
                    <Button type="button" className="bg-gray-200 text-gray-700 hover:bg-gray-300">Cancel</Button>
                  </Dialog.Close>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            )}
            <Dialog.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <span className="sr-only">Close</span>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default DocumentManagement;

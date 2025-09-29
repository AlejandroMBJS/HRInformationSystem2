export interface Document {
  id: string;
  name: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  uploader: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
  version: number;
  sharedWith: string[];
  previewUrl?: string;
}

export interface DocumentCategory {
  id: string;
  name: string;
  description?: string;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  versionNumber: number;
  uploadDate: string;
  uploader: string;
  changes?: string;
  fileUrl: string;
}

export interface DocumentFilter {
  category?: string;
  status?: 'draft' | 'published' | 'archived';
  uploader?: string;
  startDate?: string;
  endDate?: string;
}

export interface DocumentSort {
  field: 'name' | 'uploadDate' | 'fileType' | 'fileSize' | 'category' | 'version';
  order: 'asc' | 'desc';
}

export interface DocumentFormValues {
  name: string;
  file: File | null;
  category: string;
  status: 'draft' | 'published' | 'archived';
  sharedWith: string[];
}
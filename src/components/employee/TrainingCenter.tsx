import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Course, Lesson, UserProgress, Certification, LearningPath, FilterOptions } from '../../types/trainingCenter';
import { mockCourses, mockUserProgress, mockCertifications, mockLearningPaths } from '../../mockData/trainingCenterMockData';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { v4 as uuidv4 } from 'uuid';

interface CourseCardProps {
  course: Course;
  onViewDetails: (course: Course) => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onViewDetails, onEditCourse, onDeleteCourse }) => (
  <Card className="flex flex-col h-full">
    <CardHeader>
      <CardTitle>{course.title}</CardTitle>
      <CardDescription className="line-clamp-2">{course.description}</CardDescription>
    </CardHeader>
    <CardContent className="flex-grow">
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800" aria-label={`Category: ${course.category}`}>{course.category}</span>
        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800" aria-label={`Difficulty: ${course.difficulty}`}>{course.difficulty}</span>
        <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800" aria-label={`Duration: ${course.duration} hours`}>{course.duration}h</span>
      </div>
      <img src={course.imageUrl} alt={`Image for ${course.title}`} className="w-full h-32 object-cover rounded-md mb-3" />
    </CardContent>
    <CardFooter className="mt-auto flex justify-between">
      <Button onClick={() => onViewDetails(course)} className="w-[48%]">View</Button>
      <Button variant="outline" onClick={() => onEditCourse(course)} className="w-[48%]">Edit</Button>
      <Button variant="destructive" onClick={() => onDeleteCourse(course.id)} className="w-[48%] mt-2">Delete</Button>
    </CardFooter>
  </Card>
);

const TrainingCenter: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({ search: '', sortBy: 'title', sortOrder: 'asc' });
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isCourseDetailsOpen, setIsCourseDetailsOpen] = useState<boolean>(false);
  const [isCourseFormOpen, setIsCourseFormOpen] = useState<boolean>(false);
  const [currentCourseToEdit, setCurrentCourseToEdit] = useState<Course | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setCourses(mockCourses);
        setUserProgress(mockUserProgress);
        setCertifications(mockCertifications);
        setLearningPaths(mockLearningPaths);
      } catch (err) {
        setError('Failed to load training data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddCourse = useCallback((newCourse: Omit<Course, 'id' | 'lessons' | 'isPublished'>) => {
    const courseId = uuidv4();
    const courseWithDefaults: Course = {
      ...newCourse,
      id: courseId,
      lessons: [], // New courses start with no lessons
      isPublished: false, // New courses are not published by default
    };
    setCourses(prev => [...prev, courseWithDefaults]);
    setIsCourseFormOpen(false);
  }, []);

  const handleUpdateCourse = useCallback((updatedCourse: Course) => {
    setCourses(prev => prev.map(course => (course.id === updatedCourse.id ? updatedCourse : course)));
    setIsCourseFormOpen(false);
    setCurrentCourseToEdit(null);
  }, []);

  const handleDeleteCourse = useCallback((courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setCourses(prev => prev.filter(course => course.id !== courseId));
    }
  }, []);

  const filteredAndSortedCourses = useMemo(() => {
    let filtered = courses;

    if (filterOptions.search) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(filterOptions.search!.toLowerCase()) ||
        course.description.toLowerCase().includes(filterOptions.search!.toLowerCase())
      );
    }

    if (filterOptions.category) {
      filtered = filtered.filter(course => course.category === filterOptions.category);
    }

    if (filterOptions.difficulty) {
      filtered = filtered.filter(course => course.difficulty === filterOptions.difficulty);
    }

    if (filterOptions.sortBy) {
      filtered.sort((a, b) => {
        const aValue = a[filterOptions.sortBy!];
        const bValue = b[filterOptions.sortBy!];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return filterOptions.sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          return filterOptions.sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
        }
        return 0;
      });
    }

    return filtered;
  }, [courses, filterOptions]);

  const handleFilterChange = (key: keyof FilterOptions, value: string | undefined) => {
    setFilterOptions(prev => ({
      ...prev,
      [key]: value === 'all' ? undefined : value,
    }));
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-');
    setFilterOptions(prev => ({
      ...prev,
      sortBy: sortBy as 'title' | 'difficulty' | 'duration',
      sortOrder: sortOrder as 'asc' | 'desc',
    }));
  };

  const handleViewCourseDetails = (course: Course) => {
    setSelectedCourse(course);
    setIsCourseDetailsOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setCurrentCourseToEdit(course);
    setIsCourseFormOpen(true);
  };

  const getCourseProgress = (courseId: string) => {
    const courseLessons = courses.find(c => c.id === courseId)?.lessons.length || 0;
    if (courseLessons === 0) return 0;
    const completedLessons = userProgress.filter(p => p.courseId === courseId && p.completed).length;
    return (completedLessons / courseLessons) * 100;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg" role="status" aria-live="polite">
          <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg font-medium text-gray-700">Loading Training Center...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg shadow-lg" role="alert" aria-live="assertive">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Data</h2>
          <p className="text-red-600">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4 bg-red-600 hover:bg-red-700 text-white">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const allCategories = Array.from(new Set(mockCourses.map(c => c.category)));
  const allDifficulties = Array.from(new Set(mockCourses.map(c => c.difficulty)));

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans antialiased">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center" tabIndex={0}>Employee Training Center</h1>

      <Tabs defaultValue="catalog" className="w-full max-w-7xl mx-auto">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="catalog" aria-controls="catalog-tabpanel">Course Catalog</TabsTrigger>
          <TabsTrigger value="progress" aria-controls="progress-tabpanel">My Progress</TabsTrigger>
          <TabsTrigger value="certifications" aria-controls="certifications-tabpanel">Certifications</TabsTrigger>
          <TabsTrigger value="paths" aria-controls="paths-tabpanel">Learning Paths</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" id="catalog-tabpanel" role="tabpanel" aria-labelledby="catalog-tab">
          <section className="bg-white rounded-lg shadow-xl p-6 mt-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-5" tabIndex={0}>Explore Courses</h2>
            <div className="flex justify-end mb-4">
              <Button onClick={() => {
                setCurrentCourseToEdit(null);
                setIsCourseFormOpen(true);
              }}>Add New Course</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="relative">
                <Label htmlFor="search-courses" className="sr-only">Search Courses</Label>
                <Input
                  id="search-courses"
                  type="text"
                  placeholder="Search courses..."
                  value={filterOptions.search || ''}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                  aria-label="Search courses by title or description"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>

              <div>
                <Label htmlFor="category-filter" className="sr-only">Filter by Category</Label>
                <Select onValueChange={(value) => handleFilterChange('category', value)} value={filterOptions.category || 'all'}>
                  <SelectTrigger id="category-filter" aria-label="Filter courses by category">
                    <SelectValue placeholder="Filter by Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {allCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="difficulty-filter" className="sr-only">Filter by Difficulty</Label>
                <Select onValueChange={(value) => handleFilterChange('difficulty', value as 'Beginner' | 'Intermediate' | 'Advanced' | undefined)} value={filterOptions.difficulty || 'all'}>
                  <SelectTrigger id="difficulty-filter" aria-label="Filter courses by difficulty">
                    <SelectValue placeholder="Filter by Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Difficulties</SelectItem>
                    {allDifficulties.map(difficulty => (
                      <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sort-by" className="sr-only">Sort By</Label>
                <Select onValueChange={handleSortChange} value={`${filterOptions.sortBy}-${filterOptions.sortOrder}`}>
                  <SelectTrigger id="sort-by" aria-label="Sort courses by criteria">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                    <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                    <SelectItem value="difficulty-asc">Difficulty (Low to High)</SelectItem>
                    <SelectItem value="difficulty-desc">Difficulty (High to Low)</SelectItem>
                    <SelectItem value="duration-asc">Duration (Short to Long)</SelectItem>
                    <SelectItem value="duration-desc">Duration (Long to Short)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedCourses.length > 0 ? (
                filteredAndSortedCourses.map(course => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onViewDetails={handleViewCourseDetails}
                    onEditCourse={handleEditCourse}
                    onDeleteCourse={handleDeleteCourse}
                  />
                ))
              ) : (
                <p className="col-span-full text-center text-gray-600 text-lg">No courses found matching your criteria.</p>
              )}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="progress" id="progress-tabpanel" role="tabpanel" aria-labelledby="progress-tab">
          <section className="bg-white rounded-lg shadow-xl p-6 mt-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-5" tabIndex={0}>My Learning Progress</h2>
            {courses.map(course => {
              const progress = getCourseProgress(course.id);
              const completedLessonsCount = userProgress.filter(p => p.courseId === course.id && p.completed).length;
              const totalLessonsCount = course.lessons.length;

              if (totalLessonsCount === 0 && progress === 0) return null; // Don't show courses with no lessons and no progress

              return (
                <Card key={course.id} className="mb-4">
                  <CardHeader>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>{completedLessonsCount} of {totalLessonsCount} lessons completed</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Progress value={progress} className="w-full" aria-label={`${course.title} progress: ${progress}%`} />
                    <p className="text-sm text-gray-500 mt-2">{progress.toFixed(0)}% Complete</p>
                  </CardContent>
                </Card>
              );
            })}
            {userProgress.length === 0 && (
              <p className="text-gray-600 text-lg text-center">You haven't started any courses yet.</p>
            )}
          </section>
        </TabsContent>

        <TabsContent value="certifications" id="certifications-tabpanel" role="tabpanel" aria-labelledby="certifications-tab">
          <section className="bg-white rounded-lg shadow-xl p-6 mt-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-5" tabIndex={0}>My Certifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certifications.length > 0 ? (
                certifications.map(cert => {
                  const course = courses.find(c => c.id === cert.courseId);
                  return (
                    <Card key={cert.id}>
                      <CardHeader>
                        <CardTitle>{course?.title || 'Unknown Course'}</CardTitle>
                        <CardDescription>Issued: {new Date(cert.issueDate).toLocaleDateString()}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {cert.expiryDate && (
                          <p className="text-sm text-gray-600 mb-2">Expires: {new Date(cert.expiryDate).toLocaleDateString()}</p>
                        )}
                        <Button asChild className="w-full">
                          <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer" aria-label={`View certificate for ${course?.title || 'Unknown Course'}`}>
                            View Certificate
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <p className="col-span-full text-center text-gray-600 text-lg">No certifications earned yet.</p>
              )}
            </div>
          </section>
        </TabsContent>

        <TabsContent value="paths" id="paths-tabpanel" role="tabpanel" aria-labelledby="paths-tab">
          <section className="bg-white rounded-lg shadow-xl p-6 mt-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-5" tabIndex={0}>Learning Paths</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {learningPaths.length > 0 ? (
                learningPaths.map(path => (
                  <Card key={path.id}>
                    <CardHeader>
                      <CardTitle>{path.title}</CardTitle>
                      <CardDescription>{path.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <h4 className="text-lg font-semibold mb-2">Courses in this path:</h4>
                      <ul className="list-disc pl-5">
                        {path.courses.map(course => (
                          <li key={course.id} className="text-gray-700">{course.title}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="col-span-full text-center text-gray-600 text-lg">No learning paths available.</p>
              )}
            </div>
          </section>
        </TabsContent>
      </Tabs>

      {selectedCourse && (
        <Dialog open={isCourseDetailsOpen} onOpenChange={setIsCourseDetailsOpen}>
          <DialogContent className="sm:max-w-[800px] p-6">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold text-gray-900">{selectedCourse.title}</DialogTitle>
              <DialogDescription className="text-lg text-gray-600 mt-2">
                {selectedCourse.description}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <img src={selectedCourse.imageUrl} alt={`Image for ${selectedCourse.title}`} className="w-full h-48 object-cover rounded-md" />
              <p className="text-gray-700"><span className="font-semibold">Category:</span> {selectedCourse.category}</p>
              <p className="text-gray-700"><span className="font-semibold">Difficulty:</span> {selectedCourse.difficulty}</p>
              <p className="text-gray-700"><span className="font-semibold">Duration:</span> {selectedCourse.duration} hours</p>
              {selectedCourse.prerequisites.length > 0 && (
                <p className="text-gray-700"><span className="font-semibold">Prerequisites:</span> {selectedCourse.prerequisites.join(', ')}</p>
              )}
              <h3 className="text-xl font-bold mt-4 mb-2">Lessons:</h3>
              <ul className="space-y-2">
                {selectedCourse.lessons.map(lesson => (
                  <li key={lesson.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <span className="font-medium text-gray-800">{lesson.order}. {lesson.title}</span>
                    <span className="text-sm text-gray-500">{lesson.duration} min</span>
                  </li>
                ))}
              </ul>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsCourseDetailsOpen(false)} className="w-full mt-4">Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={isCourseFormOpen} onOpenChange={setIsCourseFormOpen}>
        <DialogContent className="sm:max-w-[600px] p-6">
          <DialogHeader>
            <DialogTitle>{currentCourseToEdit ? 'Edit Course' : 'Add New Course'}</DialogTitle>
            <DialogDescription>
              {currentCourseToEdit ? 'Make changes to the course here.' : 'Fill in the details for a new course.'}
            </DialogDescription>
          </DialogHeader>
          <CourseForm
            initialData={currentCourseToEdit}
            onSave={currentCourseToEdit ? handleUpdateCourse : handleAddCourse}
            onCancel={() => setIsCourseFormOpen(false)}
            allCategories={allCategories}
            allDifficulties={allDifficulties}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface CourseFormProps {
  initialData: Course | null;
  onSave: (course: any) => void; // Using any for now, will refine
  onCancel: () => void;
  allCategories: string[];
  allDifficulties: ('Beginner' | 'Intermediate' | 'Advanced')[];
}

const CourseForm: React.FC<CourseFormProps> = ({ initialData, onSave, onCancel, allCategories, allDifficulties }) => {
  const [formData, setFormData] = useState<Omit<Course, 'id' | 'lessons' | 'isPublished'>>(() => ({
    title: initialData?.title || '',
    description: initialData?.description || '',
    category: initialData?.category || allCategories[0] || '',
    difficulty: initialData?.difficulty || 'Beginner',
    duration: initialData?.duration || 0,
    prerequisites: initialData?.prerequisites || [],
    imageUrl: initialData?.imageUrl || '',
  }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === 'duration' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData) {
      onSave({ ...initialData, ...formData });
    } else {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Course Title</Label>
        <Input id="title" value={formData.title} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input id="description" value={formData.description} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select onValueChange={(value) => handleSelectChange('category', value)} value={formData.category}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {allCategories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="difficulty">Difficulty</Label>
        <Select onValueChange={(value) => handleSelectChange('difficulty', value)} value={formData.difficulty}>
          <SelectTrigger>
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            {allDifficulties.map(diff => (
              <SelectItem key={diff} value={diff}>{diff}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="duration">Duration (hours)</Label>
        <Input id="duration" type="number" step="0.5" value={formData.duration} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input id="imageUrl" value={formData.imageUrl} onChange={handleChange} />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{initialData ? 'Save Changes' : 'Add Course'}</Button>
      </DialogFooter>
    </form>
  );
};

export default TrainingCenter;

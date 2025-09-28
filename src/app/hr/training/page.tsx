'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Role } from '@prisma/client'
import { GraduationCap, Plus, Search, CreditCard as Edit, Trash2, Eye, Play, Clock, Users, BookOpen, Award, Calendar, ListFilter as Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { EnterpriseSidebar } from '@/components/hr/enterprise-sidebar'
import { Navigation } from '@/components/navigation'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface Course {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: number
  instructor: string
  maxParticipants: number
  currentParticipants: number
  startDate: string
  endDate: string
  status: 'draft' | 'published' | 'in_progress' | 'completed' | 'cancelled'
  price: number
  materials: string[]
  prerequisites: string[]
}

interface TrainingSession {
  id: string
  courseId: string
  courseName: string
  date: string
  time: string
  duration: number
  location: string
  instructor: string
  participants: string[]
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
}

export default function TrainingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [sessions, setSessions] = useState<TrainingSession[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [isAddCourseDialogOpen, setIsAddCourseDialogOpen] = useState(false)
  const [isAddSessionDialogOpen, setIsAddSessionDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  // Form states
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'Beginner' as const,
    duration: '',
    instructor: '',
    maxParticipants: '',
    startDate: '',
    endDate: '',
    price: '',
    materials: '',
    prerequisites: ''
  })

  const [sessionForm, setSessionForm] = useState({
    courseId: '',
    date: '',
    time: '',
    duration: '',
    location: '',
    instructor: ''
  })

  useEffect(() => {
    if (status === 'loading') return
    if (!session || session.user.role !== Role.HR) {
      router.push('/general/dashboard')
      return
    }
    fetchTrainingData()
  }, [session, status, router])

  const fetchTrainingData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Mock data - replace with real API calls
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockCourses: Course[] = [
        {
          id: '1',
          title: 'Safety Training Fundamentals',
          description: 'Essential workplace safety protocols and procedures',
          category: 'Safety',
          difficulty: 'Beginner',
          duration: 8,
          instructor: 'Dr. Sarah Wilson',
          maxParticipants: 25,
          currentParticipants: 18,
          startDate: '2024-10-15',
          endDate: '2024-10-16',
          status: 'published',
          price: 150,
          materials: ['Safety Manual', 'PPE Guidelines', 'Emergency Procedures'],
          prerequisites: []
        },
        {
          id: '2',
          title: 'Leadership Development Program',
          description: 'Advanced leadership skills for managers and supervisors',
          category: 'Leadership',
          difficulty: 'Advanced',
          duration: 24,
          instructor: 'Michael Chen',
          maxParticipants: 15,
          currentParticipants: 12,
          startDate: '2024-11-01',
          endDate: '2024-11-15',
          status: 'published',
          price: 500,
          materials: ['Leadership Handbook', 'Case Studies', 'Assessment Tools'],
          prerequisites: ['Basic Management Training']
        },
        {
          id: '3',
          title: 'Technical Skills Workshop',
          description: 'Hands-on technical training for production staff',
          category: 'Technical',
          difficulty: 'Intermediate',
          duration: 16,
          instructor: 'Roberto Martinez',
          maxParticipants: 20,
          currentParticipants: 8,
          startDate: '2024-10-20',
          endDate: '2024-10-22',
          status: 'draft',
          price: 300,
          materials: ['Technical Manual', 'Tools Guide', 'Practice Exercises'],
          prerequisites: ['Basic Technical Knowledge']
        }
      ]

      const mockSessions: TrainingSession[] = [
        {
          id: '1',
          courseId: '1',
          courseName: 'Safety Training Fundamentals',
          date: '2024-10-15',
          time: '09:00',
          duration: 4,
          location: 'Training Room A',
          instructor: 'Dr. Sarah Wilson',
          participants: ['emp1', 'emp2', 'emp3'],
          status: 'scheduled'
        },
        {
          id: '2',
          courseId: '2',
          courseName: 'Leadership Development Program',
          date: '2024-11-01',
          time: '14:00',
          duration: 8,
          location: 'Conference Room B',
          instructor: 'Michael Chen',
          participants: ['emp4', 'emp5'],
          status: 'scheduled'
        }
      ]

      setCourses(mockCourses)
      setSessions(mockSessions)
      
    } catch (err) {
      setError('Failed to fetch training data')
      console.error('Error fetching training data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      const newCourse: Course = {
        id: `course-${Date.now()}`,
        title: courseForm.title,
        description: courseForm.description,
        category: courseForm.category,
        difficulty: courseForm.difficulty,
        duration: parseInt(courseForm.duration),
        instructor: courseForm.instructor,
        maxParticipants: parseInt(courseForm.maxParticipants),
        currentParticipants: 0,
        startDate: courseForm.startDate,
        endDate: courseForm.endDate,
        status: 'draft',
        price: parseFloat(courseForm.price),
        materials: courseForm.materials.split(',').map(m => m.trim()).filter(Boolean),
        prerequisites: courseForm.prerequisites.split(',').map(p => p.trim()).filter(Boolean)
      }

      setCourses(prev => [...prev, newCourse])
      setCourseForm({
        title: '',
        description: '',
        category: '',
        difficulty: 'Beginner',
        duration: '',
        instructor: '',
        maxParticipants: '',
        startDate: '',
        endDate: '',
        price: '',
        materials: '',
        prerequisites: ''
      })
      setIsAddCourseDialogOpen(false)
      
    } catch (err) {
      setError('Failed to add course')
    } finally {
      setLoading(false)
    }
  }

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      const course = courses.find(c => c.id === sessionForm.courseId)
      if (!course) return

      const newSession: TrainingSession = {
        id: `session-${Date.now()}`,
        courseId: sessionForm.courseId,
        courseName: course.title,
        date: sessionForm.date,
        time: sessionForm.time,
        duration: parseInt(sessionForm.duration),
        location: sessionForm.location,
        instructor: sessionForm.instructor,
        participants: [],
        status: 'scheduled'
      }

      setSessions(prev => [...prev, newSession])
      setSessionForm({
        courseId: '',
        date: '',
        time: '',
        duration: '',
        location: '',
        instructor: ''
      })
      setIsAddSessionDialogOpen(false)
      
    } catch (err) {
      setError('Failed to add session')
    } finally {
      setLoading(false)
    }
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const categories = Array.from(new Set(courses.map(course => course.category)))
  const totalParticipants = courses.reduce((sum, course) => sum + course.currentParticipants, 0)
  const activeCourses = courses.filter(course => course.status === 'in_progress').length
  const completedCourses = courses.filter(course => course.status === 'completed').length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-purple-100 text-purple-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800'
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'Advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!session || session.user.role !== Role.HR) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-200 flex-shrink-0 bg-white min-h-screen">
        <EnterpriseSidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 md:p-8">
        <Navigation />
        
        <div className="mt-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Training Management</h1>
              <p className="text-gray-600 mt-2">Manage training programs and sessions</p>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <Dialog open={isAddSessionDialogOpen} onOpenChange={setIsAddSessionDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Session
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Schedule Training Session</DialogTitle>
                    <DialogDescription>Create a new training session</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddSession} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Course</label>
                      <Select value={sessionForm.courseId} onValueChange={(value) => setSessionForm({ ...sessionForm, courseId: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.filter(c => c.status === 'published').map(course => (
                            <SelectItem key={course.id} value={course.id}>{course.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Date</label>
                        <Input
                          type="date"
                          value={sessionForm.date}
                          onChange={(e) => setSessionForm({ ...sessionForm, date: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Time</label>
                        <Input
                          type="time"
                          value={sessionForm.time}
                          onChange={(e) => setSessionForm({ ...sessionForm, time: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Duration (hours)</label>
                        <Input
                          type="number"
                          value={sessionForm.duration}
                          onChange={(e) => setSessionForm({ ...sessionForm, duration: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Location</label>
                        <Input
                          value={sessionForm.location}
                          onChange={(e) => setSessionForm({ ...sessionForm, location: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Instructor</label>
                      <Input
                        value={sessionForm.instructor}
                        onChange={(e) => setSessionForm({ ...sessionForm, instructor: e.target.value })}
                        required
                      />
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsAddSessionDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={loading}>
                        Schedule Session
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog open={isAddCourseDialogOpen} onOpenChange={setIsAddCourseDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full md:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Course
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Add New Course</DialogTitle>
                    <DialogDescription>Create a new training course</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddCourse} className="space-y-4 max-h-96 overflow-y-auto">
                    <div>
                      <label className="text-sm font-medium">Course Title</label>
                      <Input
                        value={courseForm.title}
                        onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        value={courseForm.description}
                        onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Category</label>
                        <Input
                          value={courseForm.category}
                          onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Difficulty</label>
                        <Select value={courseForm.difficulty} onValueChange={(value: any) => setCourseForm({ ...courseForm, difficulty: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Duration (hours)</label>
                        <Input
                          type="number"
                          value={courseForm.duration}
                          onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Max Participants</label>
                        <Input
                          type="number"
                          value={courseForm.maxParticipants}
                          onChange={(e) => setCourseForm({ ...courseForm, maxParticipants: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Instructor</label>
                      <Input
                        value={courseForm.instructor}
                        onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Start Date</label>
                        <Input
                          type="date"
                          value={courseForm.startDate}
                          onChange={(e) => setCourseForm({ ...courseForm, startDate: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">End Date</label>
                        <Input
                          type="date"
                          value={courseForm.endDate}
                          onChange={(e) => setCourseForm({ ...courseForm, endDate: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Price</label>
                      <Input
                        type="number"
                        step="0.01"
                        value={courseForm.price}
                        onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Materials (comma-separated)</label>
                      <Input
                        value={courseForm.materials}
                        onChange={(e) => setCourseForm({ ...courseForm, materials: e.target.value })}
                        placeholder="Manual, Workbook, Tools..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Prerequisites (comma-separated)</label>
                      <Input
                        value={courseForm.prerequisites}
                        onChange={(e) => setCourseForm({ ...courseForm, prerequisites: e.target.value })}
                        placeholder="Basic knowledge, Previous course..."
                      />
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsAddCourseDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={loading}>
                        Add Course
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                    <p className="text-sm text-gray-600">Total Courses</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Play className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{activeCourses}</p>
                    <p className="text-sm text-gray-600">Active Courses</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{totalParticipants}</p>
                    <p className="text-sm text-gray-600">Total Participants</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <Award className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{completedCourses}</p>
                    <p className="text-sm text-gray-600">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search courses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription className="mt-2">{course.description}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(course.status)}>
                      {course.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Category:</span>
                      <Badge variant="outline">{course.category}</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Difficulty:</span>
                      <Badge className={getDifficultyColor(course.difficulty)}>
                        {course.difficulty}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{course.duration} hours</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Instructor:</span>
                      <span className="font-medium">{course.instructor}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Participants:</span>
                        <span className="font-medium">
                          {course.currentParticipants}/{course.maxParticipants}
                        </span>
                      </div>
                      <Progress 
                        value={(course.currentParticipants / course.maxParticipants) * 100} 
                        className="h-2"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium">${course.price}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Dates:</span>
                      <span className="font-medium">
                        {new Date(course.startDate).toLocaleDateString()} - {new Date(course.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2 pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCourse(course)
                          setIsViewDialogOpen(true)
                        }}
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* View Course Dialog */}
          <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Course Details</DialogTitle>
                <DialogDescription>Complete course information</DialogDescription>
              </DialogHeader>
              {selectedCourse && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold">{selectedCourse.title}</h3>
                    <p className="text-gray-600 mt-2">{selectedCourse.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-sm">Category:</span>
                        <p className="text-sm text-gray-600">{selectedCourse.category}</p>
                      </div>
                      <div>
                        <span className="font-medium text-sm">Difficulty:</span>
                        <p className="text-sm text-gray-600">{selectedCourse.difficulty}</p>
                      </div>
                      <div>
                        <span className="font-medium text-sm">Duration:</span>
                        <p className="text-sm text-gray-600">{selectedCourse.duration} hours</p>
                      </div>
                      <div>
                        <span className="font-medium text-sm">Instructor:</span>
                        <p className="text-sm text-gray-600">{selectedCourse.instructor}</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-sm">Participants:</span>
                        <p className="text-sm text-gray-600">
                          {selectedCourse.currentParticipants}/{selectedCourse.maxParticipants}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-sm">Price:</span>
                        <p className="text-sm text-gray-600">${selectedCourse.price}</p>
                      </div>
                      <div>
                        <span className="font-medium text-sm">Start Date:</span>
                        <p className="text-sm text-gray-600">
                          {new Date(selectedCourse.startDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-sm">End Date:</span>
                        <p className="text-sm text-gray-600">
                          {new Date(selectedCourse.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {selectedCourse.materials.length > 0 && (
                    <div>
                      <span className="font-medium text-sm">Materials:</span>
                      <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                        {selectedCourse.materials.map((material, index) => (
                          <li key={index}>{material}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedCourse.prerequisites.length > 0 && (
                    <div>
                      <span className="font-medium text-sm">Prerequisites:</span>
                      <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                        {selectedCourse.prerequisites.map((prereq, index) => (
                          <li key={index}>{prereq}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              <DialogFooter>
                <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
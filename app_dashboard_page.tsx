'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, BookOpen, Calendar as CalendarIcon, Moon, Sun, AlertTriangle, Download, Home, Settings, HelpCircle, Plus, Send } from 'lucide-react'
import { Input } from "@/components/ui/input"

// Mock data for demonstration purposes
const mockCourses = [
  { id: 1, name: 'Mathematics', totalClasses: 50, attendedClasses: 40 },
  { id: 2, name: 'Physics', totalClasses: 45, attendedClasses: 35 },
  { id: 3, name: 'Computer Science', totalClasses: 60, attendedClasses: 55 },
  { id: 4, name: 'English', totalClasses: 40, attendedClasses: 30 },
]

const mockEvents = [
  { id: 1, name: 'Mathematics Test', date: '2023-06-20', type: 'test' },
  { id: 2, name: 'Physics Assignment Due', date: '2023-06-22', type: 'assignment' },
  { id: 3, name: 'Semester Fee Payment', date: '2023-06-25', type: 'fee' },
  { id: 4, name: 'English Presentation', date: '2023-06-28', type: 'test' },
  { id: 5, name: 'Computer Science Project Submission', date: '2023-06-30', type: 'assignment' },
]

export default function Dashboard() {
  const [courses, setCourses] = useState(mockCourses)
  const [events, setEvents] = useState(mockEvents)
  const [overallAttendance, setOverallAttendance] = useState(0)
  const [darkMode, setDarkMode] = useState(false)
  const [showHolidayPlanner, setShowHolidayPlanner] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    { role: 'system', content: "Hello! I'm O-AI-sys, your holiday planning assistant. How can I help you plan your holidays today?" }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const chatEndRef = useRef(null)

  useEffect(() => {
    // Calculate overall attendance
    const totalClasses = courses.reduce((sum, course) => sum + course.totalClasses, 0)
    const totalAttended = courses.reduce((sum, course) => sum + course.attendedClasses, 0)
    const overallPercentage = (totalAttended / totalClasses) * 100
    setOverallAttendance(Math.round(overallPercentage))
  }, [courses])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const calculateMissableClasses = (totalClasses, attendedClasses) => {
    const minRequired = totalClasses * 0.75
    const missable = Math.floor(attendedClasses - minRequired)
    return Math.max(missable, 0)
  }

  const getEventColor = (type) => {
    switch (type) {
      case 'test':
        return 'bg-red-500 dark:bg-red-700'
      case 'assignment':
        return 'bg-yellow-500 dark:bg-yellow-700'
      case 'fee':
        return 'bg-green-500 dark:bg-green-700'
      default:
        return 'bg-gray-500 dark:bg-gray-700'
    }
  }

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return

    const newUserMessage = { role: 'user', content: inputMessage }
    setChatMessages(prevMessages => [...prevMessages, newUserMessage])
    setInputMessage('')

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = { role: 'system', content: generateAIResponse(inputMessage) }
      setChatMessages(prevMessages => [...prevMessages, aiResponse])
    }, 1000)
  }

  const generateAIResponse = (userMessage) => {
    const lowerCaseMessage = userMessage.toLowerCase()
    if (lowerCaseMessage.includes('holiday') || lowerCaseMessage.includes('vacation')) {
      return "Great! I'd be happy to help you plan your holidays. When are you thinking of taking your break, and how long do you plan to be away?"
    } else if (lowerCaseMessage.includes('attendance')) {
      return `Your current overall attendance is ${overallAttendance}%. Remember, maintaining at least 75% attendance is crucial. How can I help you plan your holidays while keeping your attendance in check?`
    } else if (lowerCaseMessage.includes('course') || lowerCaseMessage.includes('class')) {
      return "I see you're asking about specific courses. Which course are you concerned about for your holiday planning?"
    } else {
      return "I'm here to help you plan your holidays while considering your academic commitments. Could you provide more details about what you'd like to know or plan?"
    }
  }

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'} transition-colors duration-200`}>
      {/* Sidebar */}
      <aside className={`w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 hidden md:block`}>
        <div className="flex flex-col h-full">
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>OASYS</h2>
          <nav className="flex-grow">
            <ul className="space-y-2">
              <li>
                <Button variant="ghost" className="w-full justify-start">
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </li>
              <li>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setShowHolidayPlanner(true)}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Plan Holidays
                </Button>
              </li>
              <li>
                <Button variant="ghost" className="w-full justify-start">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Alerts
                </Button>
              </li>
              <li>
                <Button variant="ghost" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Reports
                </Button>
              </li>
            </ul>
          </nav>
          <div className="mt-auto">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <HelpCircle className="mr-2 h-4 w-4" />
              Help
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Dashboard</h1>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleDarkMode}
              className={`${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
            >
              {darkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <Card className={darkMode ? 'bg-gray-800 text-white' : ''}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallAttendance}%</div>
                <Progress value={overallAttendance} className="mt-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {overallAttendance >= 75 ? 'You're on track!' : 'Needs improvement'}
                </p>
              </CardContent>
            </Card>
            
            <Card className={darkMode ? 'bg-gray-800 text-white' : ''}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alerts</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Important notifications about your attendance
                </p>
              </CardContent>
            </Card>
            
            <Card className={darkMode ? 'bg-gray-800 text-white' : ''}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                <Plus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[120px]">
                  {events.map((event) => (
                    <div key={event.id} className="flex items-center mb-2">
                      <div className={`w-2 h-2 rounded-full mr-2 ${getEventColor(event.type)}`}></div>
                      <div>
                        <p className="text-sm font-medium">{event.name}</p>
                        <p className="text-xs text-muted-foreground">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          
          <Card className={`mb-8 ${darkMode ? 'bg-gray-800 text-white' : ''}`}>
            <CardHeader>
              <CardTitle>Course-Wise Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {courses.map(course => {
                  const attendancePercentage = Math.round((course.attendedClasses / course.totalClasses) * 100)
                  const missableClasses = calculateMissableClasses(course.totalClasses, course.attendedClasses)
                  return (
                    <div key={course.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{course.name}</p>
                        <div className="flex items-center space-x-2">
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            missableClasses > 0
                              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                              : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                          }`}>
                            {missableClasses > 0
                              ? `Can miss ${missableClasses} ${missableClasses === 1 ? 'class' : 'classes'}`
                              : 'Attendance required'}
                          </div>
                          <span className="text-sm font-medium">{attendancePercentage}%</span>
                        </div>
                      </div>
                      <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            attendancePercentage >= 75 ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${attendancePercentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{course.attendedClasses} / {course.totalClasses} classes</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Holiday Planner Dialog with O-AI-sys Chatbot */}
      <Dialog open={showHolidayPlanner} onOpenChange={setShowHolidayPlanner}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Plan Your Holidays with O-AI-sys</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col h-[400px]">
            <ScrollArea className="flex-grow pr-4">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    message.role === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  <div
                    className={`inline-block p-2 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </ScrollArea>
            <div className="flex items-center mt-4">
              <Input
                type="text"
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-grow mr-2"
              />
              <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
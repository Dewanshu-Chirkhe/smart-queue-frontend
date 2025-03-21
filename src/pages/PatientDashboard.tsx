
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  Clock, 
  Stethoscope,
  MessageCircle,
  User,
  Search,
  Send,
  X,
  Plus,
  CalendarClock,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

// Mock data with Indian names
const MOCK_QUEUE_STATUS = {
  position: 3,
  department: 'Cardiology',
  estimatedWaitTime: '25 minutes',
  peopleAhead: 2,
  doctor: 'Dr. Vivek Sharma',
};

const MOCK_UPCOMING_APPOINTMENTS = [
  {
    id: 1,
    doctor: 'Dr. Priya Patel',
    department: 'Cardiology',
    date: '2023-11-15',
    time: '09:30 AM',
    status: 'Confirmed',
  },
  {
    id: 2,
    doctor: 'Dr. Amit Singh',
    department: 'General',
    date: '2023-11-22',
    time: '02:15 PM',
    status: 'Pending',
  },
];

const MOCK_DOCTORS = [
  { id: 1, name: 'Dr. Priya Patel', department: 'Cardiology', rating: 4.9, availability: ['Monday', 'Wednesday', 'Friday'] },
  { id: 2, name: 'Dr. Amit Singh', department: 'General', rating: 4.7, availability: ['Tuesday', 'Thursday'] },
  { id: 3, name: 'Dr. Sanjay Gupta', department: 'Neurology', rating: 4.8, availability: ['Monday', 'Tuesday', 'Thursday'] },
  { id: 4, name: 'Dr. Meera Agarwal', department: 'Pediatrics', rating: 4.9, availability: ['Wednesday', 'Friday'] },
  { id: 5, name: 'Dr. Rajesh Kumar', department: 'Orthopedics', rating: 4.6, availability: ['Monday', 'Wednesday', 'Friday'] },
];

const PatientDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [queueStatus, setQueueStatus] = useState(MOCK_QUEUE_STATUS);
  const [appointments, setAppointments] = useState(MOCK_UPCOMING_APPOINTMENTS);
  const [chatMessages, setChatMessages] = useState<Array<{text: string, sender: 'user' | 'bot', timestamp: Date}>>([
    {
      text: "Hello! I'm your healthcare assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    }
  ]);
  const [messageInput, setMessageInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Parse tab from URL query params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  // Change tab and update URL
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/patient-dashboard?tab=${tab}`);
  };

  // Handle sending a message in the chatbot
  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    const userMessage = {
      text: messageInput,
      sender: 'user' as const,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setMessageInput('');
    setIsChatLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponses = [
        "I understand your concern. Based on your symptoms, it could be a common cold, but I recommend seeing a doctor if it persists for more than a week.",
        "Your appointment with Dr. Sharma is scheduled for November 15th at 10:30 AM. Would you like a reminder?",
        "The hospital pharmacy is open from 8:00 AM to 8:00 PM on weekdays, and 9:00 AM to 5:00 PM on weekends.",
        "Your typical wait time for the cardiology department is about 25-30 minutes. However, urgent cases are prioritized.",
        "AIIMS Delhi recommends maintaining your regular check-ups every 6 months."
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage = {
        text: randomResponse,
        sender: 'bot' as const,
        timestamp: new Date(),
      };
      
      setChatMessages((prev) => [...prev, botMessage]);
      setIsChatLoading(false);
    }, 1500);
  };

  // Book an appointment with the selected doctor
  const handleBookAppointment = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) return;
    
    const doctor = MOCK_DOCTORS.find(doc => doc.id === selectedDoctor);
    if (!doctor) return;
    
    const newAppointment = {
      id: appointments.length + 1,
      doctor: doctor.name,
      department: doctor.department,
      date: selectedDate,
      time: selectedTime,
      status: 'Pending' as const,
    };
    
    setAppointments(prev => [...prev, newAppointment]);
    setSelectedDoctor(null);
    setSelectedDate('');
    setSelectedTime('');
    
    toast.success(`Appointment booked with ${doctor.name}`);
    handleTabChange('overview');
  };

  // Filter doctors based on search query
  const filteredDoctors = MOCK_DOCTORS.filter(doctor => 
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 page-container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="page-title">Patient Dashboard</h1>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Welcome,</span>
            <button 
              onClick={() => navigate('/user-profile')} 
              className="flex items-center hover:text-hospital-600"
            >
              <span className="font-medium mr-1">{user?.name}</span>
              <User className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => handleTabChange('overview')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-hospital-500 text-hospital-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => handleTabChange('appointments')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'appointments'
                  ? 'border-hospital-500 text-hospital-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Book Appointments
            </button>
            <button
              onClick={() => handleTabChange('queue')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'queue'
                  ? 'border-hospital-500 text-hospital-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Queue Status
            </button>
            <button
              onClick={() => handleTabChange('support')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'support'
                  ? 'border-hospital-500 text-hospital-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              AI Support
            </button>
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="section-container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="glass-panel p-5 md:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="section-title">Upcoming Appointments</h2>
                  <button 
                    onClick={() => handleTabChange('appointments')}
                    className="text-sm text-hospital-600 hover:text-hospital-700"
                  >
                    Book New
                  </button>
                </div>
                
                {appointments.length > 0 ? (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div 
                        key={appointment.id}
                        className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center">
                          <div className="p-3 rounded-full bg-hospital-50 mr-4">
                            <Calendar className="h-6 w-6 text-hospital-500" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{appointment.doctor}</h3>
                            <p className="text-sm text-gray-500">{appointment.department}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {new Date(appointment.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </div>
                          <div className="text-sm text-gray-500">{appointment.time}</div>
                        </div>
                        <div>
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                              'bg-yellow-100 text-yellow-800'}`}>
                            {appointment.status}
                          </span>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <h3 className="text-lg font-medium text-gray-700 mb-1">No upcoming appointments</h3>
                    <p className="text-gray-500 mb-4">Schedule your first appointment today</p>
                    <button
                      onClick={() => handleTabChange('appointments')}
                      className="hospital-btn-primary"
                    >
                      Book Appointment
                    </button>
                  </div>
                )}
              </div>

              <div className="glass-panel p-5">
                <h2 className="section-title mb-4">Queue Status</h2>
                {queueStatus ? (
                  <div className="space-y-4">
                    <div className="flex justify-center mb-2">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full border-4 border-hospital-100 flex items-center justify-center bg-white">
                          <div className="text-3xl font-bold text-hospital-600">{queueStatus.position}</div>
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-hospital-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          #{queueStatus.position}
                        </div>
                      </div>
                    </div>
                    <div className="text-center mb-2">
                      <div className="text-sm text-gray-600">Estimated Wait Time</div>
                      <div className="text-2xl font-bold text-gray-900">{queueStatus.estimatedWaitTime}</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Department</span>
                        <span className="text-sm font-medium">{queueStatus.department}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Doctor</span>
                        <span className="text-sm font-medium">{queueStatus.doctor}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">People Ahead</span>
                        <span className="text-sm font-medium">{queueStatus.peopleAhead}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleTabChange('queue')}
                      className="w-full py-2 text-sm text-hospital-600 hover:text-hospital-700 font-medium"
                    >
                      View Details
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Clock className="h-10 w-10 mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-500">You're not currently in any queue</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="glass-panel p-5">
              <h2 className="section-title mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button 
                  onClick={() => handleTabChange('appointments')}
                  className="p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex flex-col items-center justify-center gap-2"
                >
                  <Calendar className="h-6 w-6 text-hospital-500" />
                  <span className="text-sm font-medium">Book Appointment</span>
                </button>
                <button 
                  onClick={() => handleTabChange('queue')}
                  className="p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex flex-col items-center justify-center gap-2"
                >
                  <Clock className="h-6 w-6 text-amber-500" />
                  <span className="text-sm font-medium">Check Queue</span>
                </button>
                <button 
                  onClick={() => handleTabChange('support')}
                  className="p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex flex-col items-center justify-center gap-2"
                >
                  <MessageCircle className="h-6 w-6 text-green-500" />
                  <span className="text-sm font-medium">AI Support</span>
                </button>
                <button 
                  onClick={() => navigate('/user-profile')}
                  className="p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex flex-col items-center justify-center gap-2"
                >
                  <User className="h-6 w-6 text-purple-500" />
                  <span className="text-sm font-medium">My Profile</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="section-container">
            <div className="glass-panel p-6 mb-6">
              <h2 className="section-title mb-4">Find a Doctor</h2>
              <div className="flex w-full mb-6">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="hospital-input pl-10"
                    placeholder="Search by doctor name or department"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                {filteredDoctors.map((doctor) => (
                  <div 
                    key={doctor.id} 
                    className={`p-4 border rounded-lg transition-all ${
                      selectedDoctor === doctor.id 
                        ? 'border-hospital-300 bg-hospital-50' 
                        : 'border-gray-200 bg-white hover:border-hospital-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-4">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{doctor.name}</h3>
                          <p className="text-sm text-gray-500">{doctor.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1 text-sm font-medium">{doctor.rating}</span>
                        </div>
                        <button 
                          className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            selectedDoctor === doctor.id
                              ? 'bg-hospital-500 text-white hover:bg-hospital-600'
                              : 'border border-hospital-300 text-hospital-600 hover:bg-hospital-50'
                          }`}
                          onClick={() => setSelectedDoctor(doctor.id === selectedDoctor ? null : doctor.id)}
                        >
                          {selectedDoctor === doctor.id ? 'Selected' : 'Select'}
                        </button>
                      </div>
                    </div>
                    
                    {selectedDoctor === doctor.id && (
                      <div className="mt-4 pt-4 border-t border-gray-100 animate-fadeIn">
                        <div className="mb-4">
                          <h4 className="text-sm font-medium mb-2">Available on</h4>
                          <div className="flex flex-wrap gap-2">
                            {doctor.availability.map((day) => (
                              <span key={day} className="px-3 py-1 text-xs font-medium bg-hospital-100 text-hospital-700 rounded-full">
                                {day}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Select Date
                            </label>
                            <input
                              type="date"
                              className="hospital-input"
                              value={selectedDate}
                              onChange={(e) => setSelectedDate(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Select Time
                            </label>
                            <select 
                              className="hospital-input"
                              value={selectedTime}
                              onChange={(e) => setSelectedTime(e.target.value)}
                            >
                              <option value="">Choose a time</option>
                              <option value="09:00 AM">09:00 AM</option>
                              <option value="10:00 AM">10:00 AM</option>
                              <option value="11:00 AM">11:00 AM</option>
                              <option value="01:00 PM">01:00 PM</option>
                              <option value="02:00 PM">02:00 PM</option>
                              <option value="03:00 PM">03:00 PM</option>
                              <option value="04:00 PM">04:00 PM</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-end">
                          <button 
                            className="hospital-btn-primary"
                            disabled={!selectedDate || !selectedTime}
                            onClick={handleBookAppointment}
                          >
                            Book Appointment
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="glass-panel p-6">
              <h2 className="section-title mb-4">My Appointments</h2>
              {appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div 
                      key={appointment.id}
                      className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-hospital-50 mr-3">
                          <CalendarClock className="h-5 w-5 text-hospital-500" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{appointment.doctor}</h3>
                          <p className="text-sm text-gray-500">{appointment.department}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {new Date(appointment.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </div>
                        <div className="text-sm text-gray-500">{appointment.time}</div>
                      </div>
                      <div>
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                            'bg-yellow-100 text-yellow-800'}`}>
                          {appointment.status}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100">
                          <Stethoscope className="h-5 w-5" />
                        </button>
                        <button 
                          className="p-1 rounded-full text-gray-400 hover:text-red-600 hover:bg-gray-100"
                          onClick={() => {
                            setAppointments(prev => prev.filter(a => a.id !== appointment.id));
                            toast.success('Appointment cancelled');
                          }}
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <h3 className="text-lg font-medium text-gray-700 mb-1">No appointments found</h3>
                  <p className="text-gray-500">You have no upcoming appointments</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Queue Status Tab */}
        {activeTab === 'queue' && (
          <div className="section-container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-panel p-6 md:col-span-2">
                <h2 className="section-title mb-4">Your Queue Status</h2>
                {queueStatus ? (
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="w-full md:w-1/3 flex justify-center mb-6 md:mb-0">
                      <div className="relative">
                        <div className="w-36 h-36 rounded-full border-8 border-hospital-100 flex items-center justify-center bg-white">
                          <div className="text-6xl font-bold text-hospital-600">{queueStatus.position}</div>
                        </div>
                        <div className="absolute -top-2 -right-2 w-12 h-12 bg-hospital-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          #{queueStatus.position}
                        </div>
                      </div>
                    </div>
                    <div className="w-full md:w-2/3 space-y-6">
                      <div className="text-center md:text-left">
                        <div className="text-gray-600 mb-1">Estimated Wait Time</div>
                        <div className="text-3xl font-bold text-gray-900">{queueStatus.estimatedWaitTime}</div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4">
                          <div className="text-sm text-gray-600 mb-1">Department</div>
                          <div className="font-medium">{queueStatus.department}</div>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <div className="text-sm text-gray-600 mb-1">People Ahead</div>
                          <div className="font-medium">{queueStatus.peopleAhead}</div>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <div className="text-sm text-gray-600 mb-1">Doctor</div>
                          <div className="font-medium">{queueStatus.doctor}</div>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <div className="text-sm text-gray-600 mb-1">Status</div>
                          <div className="font-medium text-hospital-600">Waiting</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Clock className="h-16 w-16 mx-auto text-gray-300 mb-3" />
                    <h3 className="text-xl font-medium text-gray-700 mb-2">You're not currently in a queue</h3>
                    <p className="text-gray-500 mb-6">Join a queue during your next visit to the hospital</p>
                    <button className="hospital-btn-primary">
                      Book an Appointment
                    </button>
                  </div>
                )}
              </div>
              
              <div className="glass-panel p-6">
                <h2 className="section-title mb-4">Department Wait Times</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Emergency</span>
                      <span className="text-sm font-medium text-red-600">15-20 min</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-red-500 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Cardiology</span>
                      <span className="text-sm font-medium text-amber-600">25-30 min</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-amber-500 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">General</span>
                      <span className="text-sm font-medium text-green-600">10-15 min</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-green-500 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Pediatrics</span>
                      <span className="text-sm font-medium text-hospital-600">20-25 min</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-hospital-500 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Orthopedics</span>
                      <span className="text-sm font-medium text-purple-600">30-35 min</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-purple-500 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h3 className="font-medium mb-2">Queue Tips</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-hospital-500 rounded-full mr-2"></div>
                      Arrive 15 minutes before your appointment
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-hospital-500 rounded-full mr-2"></div>
                      Have your appointment details ready
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-hospital-500 rounded-full mr-2"></div>
                      Emergency cases are prioritized
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-hospital-500 rounded-full mr-2"></div>
                      Wait times may change based on emergencies
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Support Tab */}
        {activeTab === 'support' && (
          <div className="section-container">
            <div className="glass-panel p-6">
              <h2 className="section-title mb-4">AI Healthcare Assistant</h2>
              
              <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
                <div className="h-96 overflow-y-auto p-4">
                  {chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`mb-4 ${
                        message.sender === 'user' ? 'flex justify-end' : 'flex justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-hospital-500 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <div
                          className={`text-xs mt-1 ${
                            message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex justify-start mb-4">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="border-t border-gray-200 p-3">
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }} 
                    className="flex items-center"
                  >
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="flex-grow hospital-input"
                      placeholder="Type your health query..."
                      disabled={isChatLoading}
                    />
                    <button
                      type="submit"
                      className="ml-2 p-2 rounded-full bg-hospital-500 text-white disabled:opacity-50"
                      disabled={!messageInput.trim() || isChatLoading}
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </form>
                </div>
              </div>
              
              <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-700 mb-2">What You Can Ask</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <button 
                    onClick={() => setMessageInput("What are the symptoms of the flu?")}
                    className="text-left p-2 bg-white rounded border border-blue-100 text-sm hover:bg-blue-50 transition-colors"
                  >
                    What are the symptoms of the flu?
                  </button>
                  <button 
                    onClick={() => setMessageInput("When is the hospital pharmacy open?")}
                    className="text-left p-2 bg-white rounded border border-blue-100 text-sm hover:bg-blue-50 transition-colors"
                  >
                    When is the hospital pharmacy open?
                  </button>
                  <button 
                    onClick={() => setMessageInput("How long is the wait time for cardiology?")}
                    className="text-left p-2 bg-white rounded border border-blue-100 text-sm hover:bg-blue-50 transition-colors"
                  >
                    How long is the wait time for cardiology?
                  </button>
                  <button 
                    onClick={() => setMessageInput("What should I do for a headache?")}
                    className="text-left p-2 bg-white rounded border border-blue-100 text-sm hover:bg-blue-50 transition-colors"
                  >
                    What should I do for a headache?
                  </button>
                </div>
                <p className="mt-4 text-xs text-blue-600">
                  <strong>Note:</strong> This AI assistant provides general information only and is not a substitute for professional medical advice.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;

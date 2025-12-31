import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

// Placeholder components - will be implemented next
const LandingPage = () => <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-400 to-secondary-500"><h1 className="text-4xl font-bold text-white">SmatiStory - Coming Soon</h1></div>
const ChildProfileSetup = () => <div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Child Profile Setup Wizard</h1></div>
const Dashboard = () => <div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Dashboard</h1></div>
const StoryGenerator = () => <div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Story Generator</h1></div>
const StoryLibrary = () => <div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Story Library</h1></div>

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/setup" element={<ChildProfileSetup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/generate" element={<StoryGenerator />} />
          <Route path="/library" element={<StoryLibrary />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

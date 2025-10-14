import { useState } from 'react'
import { 
  Plus, 
  Users, 
  Trophy, 
  Calendar, 
  Target,
  UserPlus,
  Award,
  Clock
} from 'lucide-react'
import { useAppStore } from '../store'

export function SocialCircles() {
  const { socialCircles, addSocialCircle } = useAppStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [showChallengeForm, setShowChallengeForm] = useState(false)
  const [selectedCircle, setSelectedCircle] = useState<any>(null)

  const handleAddCircle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const circle = {
      name: formData.get('name') as string,
      members: [
        { id: '1', name: 'You' }
      ],
      challenges: []
    }
    addSocialCircle(circle)
    setShowAddForm(false)
    e.currentTarget.reset()
  }

  const handleAddChallenge = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedCircle) return
    
    const formData = new FormData(e.currentTarget)
    const challenge = {
      id: Date.now().toString(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      startDate: new Date(formData.get('startDate') as string),
      endDate: new Date(formData.get('endDate') as string),
      participants: selectedCircle.members.map((m: any) => m.id)
    }
    
    // This would normally update the store
    console.log('Adding challenge:', challenge)
    setShowChallengeForm(false)
    e.currentTarget.reset()
  }

  const getChallengeStatus = (challenge: any) => {
    const now = new Date()
    const startDate = new Date(challenge.startDate)
    const endDate = new Date(challenge.endDate)
    
    if (now < startDate) return { status: 'upcoming', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (now > endDate) return { status: 'completed', color: 'text-green-600', bg: 'bg-green-100' }
    return { status: 'active', color: 'text-orange-600', bg: 'bg-orange-100' }
  }

  const getDaysRemaining = (endDate: Date) => {
    const now = new Date()
    const diffTime = endDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Social Accountability Circles</h1>
          <p className="text-gray-600">Connect with friends and achieve financial goals together</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Circle</span>
        </button>
      </div>

      {/* Circles Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Circles</p>
              <p className="text-2xl font-bold text-gray-900">{socialCircles.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Trophy className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Challenges</p>
              <p className="text-2xl font-bold text-gray-900">
                {socialCircles.reduce((sum, circle) => sum + circle.challenges.length, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">
                {socialCircles.reduce((sum, circle) => sum + circle.members.length, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Circles List */}
      <div className="space-y-6">
        {socialCircles.map((circle) => (
          <div key={circle.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{circle.name}</h3>
                    <p className="text-sm text-gray-600">{circle.members.length} members</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedCircle(circle)
                    setShowChallengeForm(true)
                  }}
                  className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1 text-sm"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add Challenge</span>
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Members */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Members</h4>
                <div className="flex flex-wrap gap-2">
                  {circle.members.map((member) => (
                    <div key={member.id} className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                      <div className="h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-700">{member.name}</span>
                    </div>
                  ))}
                  <button className="flex items-center space-x-2 bg-blue-100 px-3 py-2 rounded-lg hover:bg-blue-200 transition-colors">
                    <UserPlus className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-600">Invite</span>
                  </button>
                </div>
              </div>

              {/* Challenges */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Challenges</h4>
                {circle.challenges.length > 0 ? (
                  <div className="space-y-3">
                    {circle.challenges.map((challenge) => {
                      const status = getChallengeStatus(challenge)
                      const daysRemaining = getDaysRemaining(new Date(challenge.endDate))
                      
                      return (
                        <div key={challenge.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{challenge.title}</h5>
                              <p className="text-sm text-gray-600 mt-1">{challenge.description}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.bg} ${status.color}`}>
                              {status.status}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>{new Date(challenge.startDate).toLocaleDateString('id-ID')}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>
                                  {daysRemaining > 0 ? `${daysRemaining} days left` : 'Completed'}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>{challenge.participants.length} participants</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No challenges yet</p>
                    <p className="text-sm">Create your first challenge to get started!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {socialCircles.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No circles yet</h3>
          <p className="text-gray-600 mb-6">Create your first accountability circle to start achieving goals together</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Circle
          </button>
        </div>
      )}

      {/* Add Circle Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create Accountability Circle</h2>
            <form onSubmit={handleAddCircle} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Circle Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g., Financial Goals Squad"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">How it works:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Share progress without revealing exact amounts</li>
                  <li>• Create weekly challenges together</li>
                  <li>• Support each other's financial goals</li>
                  <li>• Celebrate milestones as a group</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Circle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Challenge Modal */}
      {showChallengeForm && selectedCircle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Challenge to {selectedCircle.name}</h2>
            <form onSubmit={handleAddChallenge} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Challenge Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g., No-Spend Weekend"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  placeholder="Describe the challenge and its goals..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    required
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    required
                    defaultValue={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-green-900 mb-2">Challenge Ideas:</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• No-spend weekend</li>
                  <li>• Cook at home for a week</li>
                  <li>• Save 20% more this month</li>
                  <li>• Track every expense for 30 days</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowChallengeForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Create Challenge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

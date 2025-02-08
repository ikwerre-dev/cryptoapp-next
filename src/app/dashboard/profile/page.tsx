"use client"

import { useState } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { TopBar } from "@/components/dashboard/TopBar"
import { User, Mail, Phone, Shield, Bell, Key } from "lucide-react"

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    twoFactorEnabled: true,
    notifications: true,
    emailNotifications: true,
    marketingEmails: false
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState(profile)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const handleSave = () => {
    setProfile(editedProfile)
    setIsEditing(false)
  }

  const toggleNotification = (key: string) => {
    setProfile(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }))
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-[5rem]">
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 lg:ml-64">
          <TopBar title="Profile" />
          <div className="p-4 lg:p-8">
            <div className="max-w-2xl mx-auto">
              {/* Profile Info */}
              <div className="bg-[#121212] rounded-[1rem] p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Personal Information</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-orange-500 hover:text-orange-600"
                  >
                    {isEditing ? "Cancel" : "Edit"}
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile.name}
                        onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                        className="w-full bg-[#1A1A1A] rounded-lg p-3"
                      />
                    ) : (
                      <div className="flex items-center gap-3">
                        <User size={20} className="text-gray-400" />
                        <span>{profile.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedProfile.email}
                        onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                        className="w-full bg-[#1A1A1A] rounded-lg p-3"
                      />
                    ) : (
                      <div className="flex items-center gap-3">
                        <Mail size={20} className="text-gray-400" />
                        <span>{profile.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedProfile.phone}
                        onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                        className="w-full bg-[#1A1A1A] rounded-lg p-3"
                      />
                    ) : (
                      <div className="flex items-center gap-3">
                        <Phone size={20} className="text-gray-400" />
                        <span>{profile.phone}</span>
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <button
                      onClick={handleSave}
                      className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-lg font-medium"
                    >
                      Save Changes
                    </button>
                  )}
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-[#121212] rounded-[1rem] p-6 mb-6">
                <h2 className="text-xl font-semibold mb-6">Security</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield size={20} className="text-gray-400" />
                      <div>
                        <div className="font-medium">Two-Factor Authentication</div>
                        <div className="text-sm text-gray-400">Add an extra layer of security</div>
                      </div>
                    </div>
                    <button className={`px-4 py-2 rounded-lg ${profile.twoFactorEnabled ? 'bg-green-500' : 'bg-[#1A1A1A]'}`}>
                      {profile.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Key size={20} className="text-gray-400" />
                      <div>
                        <div className="font-medium">Change Password</div>
                        <div className="text-sm text-gray-400">Update your password</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowPasswordModal(true)}
                      className="px-4 py-2 rounded-lg bg-[#1A1A1A] hover:bg-[#242424]"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="bg-[#121212] rounded-[1rem] p-6">
                <h2 className="text-xl font-semibold mb-6">Preferences</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell size={20} className="text-gray-400" />
                      <div>
                        <div className="font-medium">Push Notifications</div>
                        <div className="text-sm text-gray-400">Receive updates and alerts</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleNotification('notifications')}
                      className={`px-4 py-2 rounded-lg ${profile.notifications ? 'bg-green-500' : 'bg-[#1A1A1A]'}`}
                    >
                      {profile.notifications ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail size={20} className="text-gray-400" />
                      <div>
                        <div className="font-medium">Email Notifications</div>
                        <div className="text-sm text-gray-400">Get email updates about your account</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleNotification('emailNotifications')}
                      className={`px-4 py-2 rounded-lg ${profile.emailNotifications ? 'bg-green-500' : 'bg-[#1A1A1A]'}`}
                    >
                      {profile.emailNotifications ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail size={20} className="text-gray-400" />
                      <div>
                        <div className="font-medium">Marketing Emails</div>
                        <div className="text-sm text-gray-400">Receive promotional offers and updates</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleNotification('marketingEmails')}
                      className={`px-4 py-2 rounded-lg ${profile.marketingEmails ? 'bg-green-500' : 'bg-[#1A1A1A]'}`}
                    >
                      {profile.marketingEmails ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#121212] rounded-[1rem] p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold mb-6">Change Password</h3>
            <form className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 block mb-2">Current Password</label>
                <input
                  type="password"
                  className="w-full bg-[#1A1A1A] rounded-lg p-3"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-2">New Password</label>
                <input
                  type="password"
                  className="w-full bg-[#1A1A1A] rounded-lg p-3"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-2">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full bg-[#1A1A1A] rounded-lg p-3"
                  placeholder="Confirm new password"
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 bg-[#1A1A1A] hover:bg-[#242424] py-3 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600 py-3 rounded-lg font-medium"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
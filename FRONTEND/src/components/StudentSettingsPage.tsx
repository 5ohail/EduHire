import React, { useState } from 'react';

// --- INTERFACES & UTILITY COMPONENTS ---

interface SettingsSection {
  id: 'general' | 'profile' | 'security' | 'notifications';
  title: string;
}

interface SettingCardProps {
    title: string;
    description?: string;
    children: React.ReactNode;
}

// Card Component (Reusable UI element)
const SettingCard: React.FC<SettingCardProps> = ({ title, description, children }) => (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
        {children}
    </div>
);

// Toggle Switch Component (Reusable UI element)
interface ToggleSwitchProps {
    label: string;
    defaultChecked: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, defaultChecked }) => {
    const [isChecked, setIsChecked] = useState(defaultChecked);
    const handleToggle = () => setIsChecked(prev => !prev);

    return (
        <div className="flex justify-between items-center py-3 border-t border-gray-100">
            <span className="text-base text-gray-700">{label}</span>
            <label htmlFor={`toggle-${label}`} className="flex items-center cursor-pointer">
                <div className="relative">
                    <input 
                        type="checkbox" 
                        id={`toggle-${label}`} 
                        className="sr-only" 
                        checked={isChecked} 
                        onChange={handleToggle}
                    />
                    <div className="block w-10 h-6 rounded-full transition" style={{ backgroundColor: isChecked ? '#3b82f6' : '#d1d5db' }}></div>
                    <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition transform" style={{ transform: isChecked ? 'translateX(16px)' : 'translateX(0)' }}></div>
                </div>
            </label>
        </div>
    );
};


// --- MAIN SETTINGS PAGE COMPONENT ---

const StudentSettingsPage: React.FC = () => {
    const sections: SettingsSection[] = [
        { id: 'general', title: 'General' },
        { id: 'profile', title: 'Profile & Visibility' },
        { id: 'security', title: 'Account Security' },
        { id: 'notifications', title: 'Notifications' },
    ];

    const [activeSection, setActiveSection] = useState<SettingsSection['id']>('security'); 

    // --- Content Rendering Logic (Same as before, but without the external sidebar) ---
    const renderContent = () => {
        switch (activeSection) {
            case 'general':
                return (
                    <>
                        <SettingCard title="Basic Information">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">Full Name</label>
                                    <input type="text" id="name" defaultValue="Rohan Patel" className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Primary Email</label>
                                    <input type="email" id="email" defaultValue="rohan.patel@college.edu" className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"/>
                                </div>
                            </div>
                            <button className="mt-6 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md text-sm">Save General Settings</button>
                        </SettingCard>

                        <SettingCard title="Language & Timezone">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="language">Language</label>
                                    <select id="language" className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                                        <option>English (US)</option>
                                        <option>Hindi</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="timezone">Time Zone</label>
                                    <select id="timezone" className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
                                        <option>IST (Asia/Kolkata)</option>
                                        <option>PST (America/Los_Angeles)</option>
                                    </select>
                                </div>
                            </div>
                        </SettingCard>
                    </>
                );

            case 'profile':
                return (
                    <>
                        <SettingCard 
                            title="Profile Visibility"
                            description="Control what information is visible to potential employers and other students."
                        >
                            <ToggleSwitch label="Allow direct resume download" defaultChecked={true} />
                            <ToggleSwitch label="Show GPA on public profile" defaultChecked={false} />
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <button className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition text-sm">View Public Profile</button>
                            </div>
                        </SettingCard>

                        <SettingCard title="Custom Profile URL">
                            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="url">Your Profile Link</label>
                            <div className="flex items-center">
                                <span className="p-2 bg-gray-100 border border-gray-300 rounded-l-md text-gray-500 text-sm">platform.com/student/</span>
                                <input type="text" id="url" defaultValue="rohan-patel" className="flex-grow p-2 border border-l-0 border-gray-300 rounded-r-md focus:ring-blue-500 focus:border-blue-500"/>
                            </div>
                            <button className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition text-sm shadow-md">Save URL</button>
                        </SettingCard>
                    </>
                );

            case 'security':
                return (
                    <>
                        <SettingCard title="Password Update">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="current-pass">Current Password</label>
                                    <input type="password" id="current-pass" placeholder="••••••••" className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"/>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="new-pass">New Password</label>
                                    <input type="password" id="new-pass" placeholder="••••••••" className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"/>
                                </div>
                            </div>
                            <button className="mt-6 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md text-sm">Change Password</button>
                        </SettingCard>
                        
                        <SettingCard 
                            title="Two-Factor Authentication (2FA)"
                            description="Add an extra layer of security to your account using an app or SMS."
                        >
                            <ToggleSwitch label="Enable Two-Factor Authentication" defaultChecked={true} />
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <button className="text-sm text-blue-600 font-medium hover:underline">Manage Recovery Codes</button>
                            </div>
                        </SettingCard>
                    </>
                );

            case 'notifications':
                return (
                    <SettingCard title="Email Preferences" description="Manage which types of emails you receive from the platform.">
                        <ToggleSwitch label="Job application status updates" defaultChecked={true} />
                        <ToggleSwitch label="New job recommendations" defaultChecked={true} />
                        <ToggleSwitch label="Platform news and feature updates" defaultChecked={false} />
                        <button className="mt-6 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-md text-sm">Save Notification Settings</button>
                    </SettingCard>
                );
            
            default:
                return null;
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto bg-gray-50 min-h-screen">
            
            {/* 1. Page Header (Matches dashboard title area) */}
            <div className="mb-6 flex justify-between items-center border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-extrabold text-gray-900">Settings & Privacy</h1>
                <span className="text-sm text-gray-500">Welcome, Rohan 👋</span>
            </div>
            
            {/* 2. TABBED NAVIGATION (Replaces Sidebar) */}
            <div className="flex space-x-2 border-b-2 border-gray-200 mb-8">
                {sections.map(section => (
                    <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`py-2 px-4 text-sm font-semibold transition-colors duration-200 ${
                            activeSection === section.id
                                ? 'border-b-4 border-blue-600 text-blue-600'
                                : 'text-gray-600 hover:text-blue-500 hover:border-b-2 hover:border-gray-300'
                        }`}
                    >
                        {section.title}
                    </button>
                ))}
            </div>

            {/* 3. MAIN CONTENT AREA */}
            <div className="w-full">
                {renderContent()}
            </div>
        </div>
    );
};

export default StudentSettingsPage;
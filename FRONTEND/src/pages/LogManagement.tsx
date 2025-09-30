import React, { useState } from 'react';

// --- INTERFACE DEFINITIONS ---

interface Task {
  id: number;
  title: string;
  status: 'To Do' | 'In Progress' | 'Review' | 'Done';
  timeLogged?: string;
  isTimerRunning?: boolean;
}

interface LogEntry {
  id: number;
  time: string;
  description: string;
}

interface KanbanColumn {
    title: string;
    status: Task['status'];
}

// --- TASK CARD COMPONENT ---
interface TaskCardProps {
    task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    const statusColors: Record<Task['status'], string> = {
        'To Do': 'bg-blue-100 border-blue-200',
        'In Progress': 'bg-blue-100 border-blue-400',
        'Review': 'bg-yellow-100 border-yellow-300',
        'Done': 'bg-green-100 border-green-300',
    };
    
    // Determine the text/color for the small timer circle
    const timerCircleColor = task.isTimerRunning ? 'bg-red-500' : 'bg-gray-400';
    const timerText = task.isTimerRunning ? '0h 30m' : ''; // Display only if running

    return (
        <div className={`p-2 bg-white rounded-md shadow-sm mb-2 border ${statusColors[task.status]}`}>
            <div className="flex justify-between items-center text-xs font-semibold text-gray-800">
                <span>{task.title.split(' ')[0]}</span> {/* Display only first word for brevity as in image */}
                {task.timeLogged && (
                    <span className="text-blue-600">{task.timeLogged}</span>
                )}
            </div>
            <p className="text-[10px] text-gray-500">{task.title}</p> {/* Full title as detail */}
            
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 text-xs text-gray-600">
                <div className={`w-3 h-3 rounded-full ${timerCircleColor}`}></div>
                <span>{timerText}</span>
            </div>
        </div>
    );
};

// --- MAIN PAGE COMPONENT ---
const LogManagement: React.FC = () => {
    // --- Mock State ---
    const [tasks, setTasks] = useState<Task[]>([
        { id: 1, title: '3h 30m', status: 'To Do', timeLogged: '3h 30m' }, // Adjusted to match image
        { id: 2, title: '3h 15m', status: 'To Do' },
        { id: 3, title: '3h 45m', status: 'In Progress', timeLogged: '3h 45m', isTimerRunning: true },
        { id: 4, title: '3h 15m', status: 'In Progress' },
        { id: 5, title: '3h 50m', status: 'Review', timeLogged: '3h 50m' },
        { id: 6, title: '3h 10m', status: 'Review' },
        { id: 7, title: '3h 35m', status: 'Done', timeLogged: '3h 35m' },
        { id: 8, title: '3h 05m', status: 'Done' },
        // Additional items to fill out the columns as in the image
        { id: 9, title: '3h 30m', status: 'To Do' },
        { id: 10, title: '3h 45m', status: 'In Progress' },
        { id: 11, title: '3h 20m', status: 'Review' },
        { id: 12, title: '3h 15m', status: 'Done' },
    ]);

    const [logs, setLogs] = useState<LogEntry[]>([
        { id: 1, time: '2h', description: 'Work on model training' },
        { id: 2, time: '1h', description: 'Daily standup' },
        { id: 3, time: '3h', description: 'Research on data augmentation' },
    ]);
    
    const [formState, setFormState] = useState({
        timeSpent: '',
        logType: 'Work', // Corresponds to the "Log Type" dropdown
        taskTicket: '',  // Corresponds to the "Task/Ticket" dropdown
        comments: '',
    });

    const kanbanColumns: KanbanColumn[] = [
        { title: 'To Do', status: 'To Do' },
        { title: 'In Progress', status: 'In Progress' },
        { title: 'Review', status: 'Review' }, // Renamed from Review/Blocked to match image
        { title: 'Done', status: 'Done' },
    ];

    // --- Handlers ---
    
    const getTasksByStatus = (status: Task['status']): Task[] => tasks.filter(task => task.status === status);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitLog = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you'd send this data to a backend
        console.log('Log Submitted:', formState);
        // Add new log to the list (simplified for UI)
        setLogs(prev => [{ 
            id: Date.now(), 
            time: formState.timeSpent, 
            description: formState.comments || 'No comment',
        }, ...prev]);

        setFormState({ timeSpent: '', logType: 'Work', taskTicket: '', comments: '' });
    };

    // --- RENDER ---
    
    return (
        <div className="p-5 max-w-full mx-auto bg-gray-50 font-sans"> {/* Added font-sans to match dashboard */}
            
            {/* Page Header (Internship Title and Status) */}
            <div className="mb-6 p-5 bg-white rounded-lg shadow-sm border-l-4 border-blue-600 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900">AI Research Intern - InnovateX Solutions</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Overall Status: <span className="text-green-600 font-semibold">🌟 On Track</span>
                    </p>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                        Supervisor: Sarah Chen 
                        <button className="ml-2 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full hover:bg-blue-200 transition">
                            Message
                        </button>
                    </p>
                </div>
            </div>

            {/* MAIN LAYOUT: Calendar | Kanban Board | Log Manager */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* COLUMN 1: Schedule & Milestones (lg:col-span-3) */}
                <div className="lg:col-span-3 space-y-5">
                    
                    {/* Schedule & Milestones - Calendar */}
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800">Schedule & Milestones</h3>
                        <p className="text-sm font-bold text-gray-700 mb-2">September 2025</p>
                        
                        {/* Days of Week */}
                        <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500 mb-1">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => <span key={i}>{day}</span>)}
                        </div>
                        
                        {/* Calendar Grid (Mimicking the exact layout) */}
                        <div className="grid grid-cols-7 gap-1 text-center text-sm">
                            {Array.from({ length: 3 }).map((_, i) => ( // Empty spacers for 3 days offset
                                <div key={`spacer-${i}`} className="h-6"></div>
                            ))}
                            {[...Array(30)].map((_, i) => { // 30 days
                                const day = i + 1;
                                const isHighlighted = [3, 8, 12, 13, 20, 25].includes(day); // Example highlights
                                const isRed = [15, 23].includes(day); // Example red dates

                                let dayClasses = 'h-6 w-6 mx-auto flex items-center justify-center rounded-full';
                                
                                if (isRed) {
                                    dayClasses += ' bg-red-500 text-white font-bold';
                                } else if (isHighlighted) {
                                    dayClasses += ' bg-blue-500 text-white font-medium';
                                } else {
                                    dayClasses += ' text-gray-600';
                                }

                                return (
                                    <div key={day} className="py-1">
                                        <span className={dayClasses}>{day}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Schedule & Milestones - Timeline */}
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800">Milestone Timeline</h3>
                        <ol className="relative border-l border-gray-200 ml-2">                  
                            <li className="mb-4 ml-4">
                                <div className="absolute w-3 h-3 bg-blue-500 rounded-full mt-1.5 -left-1.5 border border-white"></div>
                                <h4 className="text-sm font-semibold text-gray-800">Engaged Cond Work (Oct 5)</h4>
                            </li>
                            <li className="mb-4 ml-4">
                                <div className="absolute w-3 h-3 bg-gray-300 rounded-full mt-1.5 -left-1.5 border border-white"></div>
                                <h4 className="text-sm font-semibold text-gray-800">Phase 1 Completion (Oct 15)</h4>
                            </li>
                            <li className="ml-4">
                                <div className="absolute w-3 h-3 bg-gray-300 rounded-full mt-1.5 -left-1.5 border border-white"></div>
                                <h4 className="text-sm font-semibold text-gray-800">Final Presentation (Dec 15)</h4>
                            </li>
                        </ol>
                    </div>
                </div>

                {/* COLUMN 2: Log Board (lg:col-span-6) */}
                <div className="lg:col-span-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Log Board</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {kanbanColumns.map(column => (
                            <div key={column.status} className="flex flex-col p-3 bg-gray-50 rounded-lg shadow-inner border border-gray-200">
                                <h4 className="text-xs font-bold uppercase mb-2 text-gray-600 border-b pb-1 border-gray-200">
                                    {column.title}
                                </h4>
                                {/* Task Count as in image */}
                                <span className="text-[10px] text-gray-500 mb-3">({getTasksByStatus(column.status).length} items)</span>

                                {/* List Tasks */}
                                <div className="min-h-[200px] space-y-2">
                                    {getTasksByStatus(column.status).map(task => (
                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                        />
                                    ))}
                                </div>
                                <button className="text-xs text-blue-600 hover:text-blue-700 mt-3 py-2 border border-dashed border-blue-300 rounded-lg bg-blue-50 transition">+ Add Task</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* COLUMN 3: Time & Activity Log (lg:col-span-3) */}
                <div className="lg:col-span-3 space-y-5">
                    
                    {/* Time & Activity Log Form */}
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800">Time & Activity Log</h3>
                        
                        <form onSubmit={handleSubmitLog}>
                            <div className="mb-3">
                                <label className="block text-xs font-medium text-gray-600 mb-1 sr-only" htmlFor="timeSpent">Time Spent</label>
                                <input type="text" id="timeSpent" name="timeSpent" placeholder="Time Spent" value={formState.timeSpent} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" />
                            </div>

                            <div className="grid grid-cols-2 gap-2 mb-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1 sr-only" htmlFor="logType">Log Type</label>
                                    <select id="logType" name="logType" value={formState.logType} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm">
                                        <option value="Work">Work</option>
                                        <option value="Meeting">Meeting</option>
                                        <option value="Research">Research</option>
                                        <option value="Review">Review</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1 sr-only" htmlFor="taskTicket">Task/Ticket</label>
                                    <input type="text" id="taskTicket" name="taskTicket" placeholder="Daily standup" value={formState.taskTicket} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" />
                                </div>
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-xs font-medium text-gray-600 mb-1 sr-only" htmlFor="comments">Comments</label>
                                <textarea id="comments" name="comments" rows={3} placeholder="Comments" value={formState.comments} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"></textarea>
                            </div>

                            <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors shadow-md text-sm">
                                Submit Log
                            </button>
                        </form>
                    </div>

                    {/* Recent Logs */}
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800">Recent Logs</h3>
                        
                        <div className="space-y-3 text-sm">
                            {logs.map(log => (
                                <div key={log.id} className="flex justify-between items-center pb-2 border-b border-gray-100 last:border-b-0">
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        <span className="font-medium text-gray-700">Logged {log.time} - {log.description}</span>
                                    </div>
                                    <svg className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Total Hours */}
                    <div className="p-4 bg-white rounded-lg shadow-sm border-t border-gray-100">
                        <div className="flex justify-between font-semibold text-gray-700 text-sm">
                            <span>Total Hours This Week:</span>
                            <span className="text-blue-600">18h 30m</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogManagement;
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// --- INTERFACE DEFINITIONS ---

interface Task {
  id: number;
  title: string;
  status: 'To Do' | 'In Progress' | 'Review' | 'Done';
  timeLoggedHours: number; // Stored as total hours (e.g., 3.5)
  isTimerRunning: boolean;
  timerStartTime?: number; // timestamp
}

interface LogEntry {
  id: number;
  time: string; // "Xh Ym" for display
  description: string;
  type: 'Work' | 'Meeting' | 'Research' | 'Review';
}

interface KanbanColumn {
    title: string;
    status: Task['status'];
}

// --- UTILITIES ---

// Utility to format total hours into "Hh Mm"
const formatHours = (totalHours: number): string => {
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    return `${hours}h ${minutes}m`;
};

// Utility to calculate elapsed time since timer started
const useElapsedTime = (task: Task): number => {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | null = null;
        if (task.isTimerRunning && task.timerStartTime) {
            const calculateElapsed = () => {
                const now = Date.now();
                const diffMs = now - task.timerStartTime!;
                setElapsed(diffMs / (1000 * 60 * 60)); // Convert milliseconds to hours
            };
            
            calculateElapsed(); // Initial calculation
            interval = setInterval(calculateElapsed, 1000); // Update every second
        } else if (interval) {
            clearInterval(interval);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [task.isTimerRunning, task.timerStartTime]);

    return elapsed;
};

// --- MODAL COMPONENT (NEW) ---
interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (title: string, status: Task['status']) => void;
    targetStatus: Task['status'];
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, targetStatus }) => {
    const [taskTitle, setTaskTitle] = useState('');

    const handleSave = () => {
        if (taskTitle.trim()) {
            onSave(taskTitle.trim(), targetStatus);
            setTaskTitle('');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-sm">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Add New Task to "{targetStatus}"</h3>
                
                <input
                    type="text"
                    placeholder="Task Title (e.g., Finish Feature X)"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:ring-blue-500 focus:border-blue-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                />

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition font-semibold disabled:opacity-50"
                        disabled={!taskTitle.trim()}
                    >
                        Save Task
                    </button>
                </div>
            </div>
        </div>
    );
};


// --- TASK CARD COMPONENT ---
interface TaskCardProps {
    task: Task;
    onToggleTimer: (taskId: number, isRunning: boolean) => void;
    onQuickLog: (task: Task) => void;
    onMoveTask: (taskId: number, newStatus: Task['status']) => void;
}


const TaskCard: React.FC<TaskCardProps> = ({ task, onToggleTimer, onQuickLog, onMoveTask }) => {
    const statusColors: Record<Task['status'], string> = {
        'To Do': 'bg-blue-100 border-blue-200',
        'In Progress': 'bg-blue-100 border-blue-400',
        'Review': 'bg-yellow-100 border-yellow-300',
        'Done': 'bg-green-100 border-green-300',
    };
    
    const elapsedTime = useElapsedTime(task);
    
    const timerCircleColor = task.isTimerRunning ? 'bg-red-500' : 'bg-gray-400';
    const currentTimerDisplay = task.isTimerRunning ? formatHours(elapsedTime) : '';
    
    const timerIcon = task.isTimerRunning ? (
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zM11 8a1 1 0 012 0v4a1 1 0 11-2 0V8z" clipRule="evenodd"></path></svg>
    ) : (
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"></path></svg>
    );

    const isDone = task.status === 'Done';
    const nextStatus = task.status === 'To Do' ? 'In Progress' : (task.status === 'In Progress' ? 'Review' : 'Done');


    return (
        <div 
            className={`p-2 bg-white rounded-md shadow-sm mb-2 border ${statusColors[task.status]} hover:shadow-md transition-shadow`}
        >
            <div className="flex justify-between items-center text-xs font-semibold text-gray-800">
                <span className="text-sm font-bold text-gray-900 line-clamp-1">{task.title}</span>
                <span className="text-blue-600">{formatHours(task.timeLoggedHours)}</span>
            </div>
            <p className="text-[10px] text-gray-500 mb-2">{task.title}</p>
            
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-600">
                <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${timerCircleColor}`}></div>
                    <span className="ml-1 text-red-600 font-semibold">{currentTimerDisplay}</span>
                </div>
                
                <div className="flex space-x-2">
                    {/* Quick Log Button */}
                    <button
                        onClick={() => onQuickLog(task)}
                        className="w-5 h-5 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition"
                        title="Quick Log Time"
                    >
                        <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </button>

                    {/* Timer Toggle Button (Only in In Progress) */}
                    {task.status === 'In Progress' && (
                        <button
                            onClick={() => onToggleTimer(task.id, task.isTimerRunning)}
                            className={`w-5 h-5 rounded-full flex items-center justify-center transition ${task.isTimerRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                            title={task.isTimerRunning ? 'Stop Timer' : 'Start Timer'}
                        >
                            {timerIcon}
                        </button>
                    )}
                    
                    {/* Next Status Button */}
                    {!isDone && (
                        <button
                            onClick={() => onMoveTask(task.id, nextStatus as Task['status'])}
                            className="text-gray-500 hover:text-blue-600 transition"
                            title={`Move to ${nextStatus}`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};


// --- CHART COMPONENTS (Unchanged) ---

const TaskStatusChart: React.FC<{ data: any }> = ({ data }) => {
    const chartOptions: any = {
        indexAxis: 'y' as const,
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: false },
        },
        scales: {
            x: {
                beginAtZero: true,
                grid: { display: false },
                ticks: { stepSize: 1 }
            },
            y: { grid: { display: false } }
        }
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
            <h5 className="text-sm font-semibold text-gray-700 mb-2">Task Distribution</h5>
            <div className="h-40">
                <Bar data={data} options={chartOptions} />
            </div>
        </div>
    );
};

const TimeDistributionChart: React.FC<{ data: any }> = ({ data }) => {
    const chartOptions: any = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                }
            },
            title: { display: false },
            tooltip: { callbacks: { label: (context: any) => `${context.label}: ${context.formattedValue}h` } }
        },
        cutout: '70%',
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col items-center">
            <h5 className="text-sm font-semibold text-gray-700 mb-2">Time Breakdown</h5>
            <div className="w-full max-w-40 max-h-40">
                <Doughnut data={data} options={chartOptions} />
            </div>
        </div>
    );
};


// --- MAIN PAGE COMPONENT ---
const LogManagement: React.FC = () => {
    // --- State ---
    const [tasks, setTasks] = useState<Task[]>([
        { id: 1, title: 'Model training setup', status: 'To Do', timeLoggedHours: 3.5, isTimerRunning: false },
        { id: 2, title: 'Review data pipeline', status: 'To Do', timeLoggedHours: 3.25, isTimerRunning: false },
        { id: 3, title: 'Implement data augmentation', status: 'In Progress', timeLoggedHours: 3.75, isTimerRunning: true, timerStartTime: Date.now() - (0.5 * 60 * 60 * 1000) },
        { id: 4, title: 'Draft research findings', status: 'In Progress', timeLoggedHours: 3.25, isTimerRunning: false },
        { id: 5, title: 'Code review for PR-45', status: 'Review', timeLoggedHours: 3.83, isTimerRunning: false },
        { id: 6, title: 'Finalize presentation slides', status: 'Review', timeLoggedHours: 3.16, isTimerRunning: false },
        { id: 7, title: 'Initial setup and environment prep', status: 'Done', timeLoggedHours: 3.58, isTimerRunning: false },
        { id: 8, title: 'Daily standup meeting', status: 'Done', timeLoggedHours: 3.08, isTimerRunning: false },
        { id: 9, title: 'Write unit tests', status: 'To Do', timeLoggedHours: 3.5, isTimerRunning: false },
        { id: 10, title: 'Debugging complex memory leak', status: 'In Progress', timeLoggedHours: 3.75, isTimerRunning: false },
        { id: 11, title: 'Document API endpoints', status: 'Review', timeLoggedHours: 3.33, isTimerRunning: false },
        { id: 12, title: 'Team retrospective meeting', status: 'Done', timeLoggedHours: 3.25, isTimerRunning: false },
    ]);

    const [logs, setLogs] = useState<LogEntry[]>([
        { id: 1, time: '2h', description: 'Work on model training', type: 'Work' },
        { id: 2, time: '1h', description: 'Daily standup', type: 'Meeting' },
        { id: 3, time: '3h', description: 'Research on data augmentation', type: 'Research' },
        { id: 4, time: '0.5h', description: 'Code review', type: 'Review' },
        { id: 5, time: '2h', description: 'Bug fixing', type: 'Work' },
    ]); 

    const [formState, setFormState] = useState({
        timeSpent: '',
        logType: 'Work',
        taskTicket: '',
        comments: '',
    });
    
    const [selectedDate, setSelectedDate] = useState<number | null>(null);
    
    // ⭐ NEW MODAL STATE ⭐
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStatus, setModalStatus] = useState<Task['status']>('To Do');

    const kanbanColumns: KanbanColumn[] = [
        { title: 'To Do', status: 'To Do' },
        { title: 'In Progress', status: 'In Progress' },
        { title: 'Review', status: 'Review' },
        { title: 'Done', status: 'Done' },
    ];

    // --- TASK HANDLERS ---
    
    const getTasksByStatus = (status: Task['status']): Task[] => tasks.filter(task => task.status === status);

    // ⭐ NEW: Handles opening the modal for a specific column ⭐
    const handleAddTaskClick = (status: Task['status']) => {
        setModalStatus(status);
        setIsModalOpen(true);
    };

    // ⭐ NEW: Saves the new task to state ⭐
    const handleSaveTask = (title: string, status: Task['status']) => {
        const newTask: Task = {
            id: Date.now() + Math.random(), // Simple unique ID
            title: title,
            status: status,
            timeLoggedHours: 0,
            isTimerRunning: false,
        };
        setTasks(prevTasks => [newTask, ...prevTasks]); // Add to the top of the list
    };
    
    // Log Management handlers (mostly unchanged)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitLog = (e: React.FormEvent) => {
        e.preventDefault();
        const timeSpent = formState.timeSpent.trim();
        if (!timeSpent.match(/^\d+(\.\d+)?h$/)) {
            alert('Please enter time in the format Xh or X.Yh (e.g., 2h or 1.5h)');
            return;
        }

        setLogs(prev => [{ 
            id: Date.now(), 
            time: timeSpent, 
            description: formState.comments || formState.taskTicket || 'No comment/task provided',
            type: formState.logType as LogEntry['type'],
        }, ...prev]);

        setFormState({ timeSpent: '', logType: 'Work', taskTicket: '', comments: '' });
    };

    const handleRemoveLog = useCallback((id: number) => {
        setLogs(prev => prev.filter(log => log.id !== id));
    }, []);

    const handleDayClick = (day: number) => {
        setSelectedDate(day === selectedDate ? null : day);
    };

    const handleToggleTimer = useCallback((taskId: number, isRunning: boolean) => {
        setTasks(prevTasks => 
            prevTasks.map(task => {
                if (task.id === taskId) {
                    const elapsed = (Date.now() - (task.timerStartTime || Date.now())) / (1000 * 60 * 60);
                    
                    return { 
                        ...task, 
                        isTimerRunning: !isRunning,
                        timeLoggedHours: isRunning ? task.timeLoggedHours + elapsed : task.timeLoggedHours,
                        timerStartTime: isRunning ? undefined : Date.now(),
                    };
                }
                
                if (task.isTimerRunning) {
                    const elapsed = (Date.now() - task.timerStartTime!) / (1000 * 60 * 60);
                    return { 
                        ...task, 
                        isTimerRunning: false,
                        timeLoggedHours: task.timeLoggedHours + elapsed,
                        timerStartTime: undefined,
                    };
                }
                return task;
            })
        );
    }, []);

    const handleQuickLog = useCallback((task: Task) => {
        if (task.isTimerRunning) {
            handleToggleTimer(task.id, true);
        }
        
        setFormState({
            timeSpent: '',
            logType: 'Work',
            taskTicket: task.title.substring(0, 30), // Use part of title
            comments: `Logged time for task: ${task.title}`,
        });

        const logFormElement = document.getElementById('log-form-section');
        if (logFormElement) {
            logFormElement.scrollIntoView({ behavior: 'smooth' });
        }
    }, [handleToggleTimer]);

    const handleMoveTask = useCallback((taskId: number, newStatus: Task['status']) => {
        setTasks(prevTasks => 
            prevTasks.map(task => {
                if (task.id === taskId) {
                    const isStartingProgress = newStatus === 'In Progress' && task.status === 'To Do';
                    const isFinishing = newStatus === 'Done' || newStatus === 'Review';
                    
                    return { 
                        ...task, 
                        status: newStatus,
                        isTimerRunning: isStartingProgress ? true : (isFinishing ? false : task.isTimerRunning),
                        timerStartTime: isStartingProgress ? Date.now() : task.timerStartTime,
                    };
                }
                return task;
            })
        );
    }, []);
    
    // --- CHART DATA CALCULATIONS (Unchanged) ---
    const taskChartData = useMemo(() => {
        const labels = kanbanColumns.map(column => column.title);
        const data = kanbanColumns.map(column => getTasksByStatus(column.status).length);
        const backgroundColors = ['#3B82F6', '#4F46E5', '#F59E0B', '#10B981']; 
        return { labels, datasets: [{ label: 'Tasks', data, backgroundColor: backgroundColors, borderColor: backgroundColors, borderWidth: 1 }] };
    }, [tasks]);

    const timeChartData = useMemo(() => {
        const logTypes: LogEntry['type'][] = ['Work', 'Meeting', 'Research', 'Review'];
        const typeHours = logs.reduce((acc, log) => {
            const timeMatch = log.time.match(/(\d+\.?\d*)h/);
            if (timeMatch) {
                const hours = parseFloat(timeMatch[1]);
                acc[log.type] = (acc[log.type] || 0) + hours;
            }
            return acc;
        }, {} as Record<LogEntry['type'], number>);
        const data = logTypes.map(type => typeHours[type] || 0);
        const backgroundColors = ['#4F46E5', '#EF4444', '#10B981', '#F59E0B']; 
        return { labels: logTypes, datasets: [{ data, backgroundColor: backgroundColors, hoverBackgroundColor: backgroundColors, borderColor: '#ffffff', borderWidth: 2 }] };
    }, [logs]);

    // --- RENDER UTILS (Unchanged) ---
    
    const totalHoursThisWeek = logs.reduce((sum, log) => {
        const timeMatch = log.time.match(/(\d+\.?\d*)h/);
        return sum + (timeMatch ? parseFloat(timeMatch[1]) : 0);
    }, 0);
    const weeklyGoal = 40;
    const progressPercent = Math.min((totalHoursThisWeek / weeklyGoal) * 100, 100);
    const hoursPart = Math.floor(totalHoursThisWeek);
    const minutesPart = Math.round((totalHoursThisWeek - hoursPart) * 60);

    return (
        <div className="p-5 max-w-full mx-auto bg-gray-50 font-sans">
            
            {/* Task Creation Modal */}
            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTask}
                targetStatus={modalStatus}
            />
            
            {/* Page Header */}
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

            {/* MAIN LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                
                {/* COLUMN 1: Schedule & Milestones (lg:col-span-3) */}
                <div className="lg:col-span-3 space-y-5">
                    {/* Calendar block... */}
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800">Schedule & Milestones</h3>
                        <p className="text-sm font-bold text-gray-700 mb-2">September 2025</p>
                        <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500 mb-1">
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => <span key={i}>{day}</span>)}
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-sm">
                            {Array.from({ length: 3 }).map((_, i) => (<div key={`spacer-${i}`} className="h-6"></div>))}
                            {[...Array(30)].map((_, i) => { 
                                const day = i + 1;
                                const isHighlighted = [3, 8, 12, 13, 20, 25].includes(day);
                                const isRed = [15, 23].includes(day);
                                const isSelected = day === selectedDate;

                                let dayClasses = 'h-6 w-6 mx-auto flex items-center justify-center rounded-full cursor-pointer transition-all duration-150';
                                
                                if (isSelected) {
                                    dayClasses += ' bg-teal-500 text-white font-bold ring-2 ring-teal-300 ring-offset-1';
                                } else if (isRed) {
                                    dayClasses += ' bg-red-500 text-white font-bold hover:bg-red-600';
                                } else if (isHighlighted) {
                                    dayClasses += ' bg-blue-500 text-white font-medium hover:bg-blue-600';
                                } else {
                                    dayClasses += ' text-gray-600 hover:bg-gray-200';
                                }

                                return (
                                    <div key={day} className="py-1">
                                        <span 
                                            className={dayClasses}
                                            onClick={() => handleDayClick(day)}
                                        >
                                            {day}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {/* Timeline block... */}
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
                    {/* Selected Date Details */}
                    {selectedDate !== null && (
                        <div className="p-4 bg-white rounded-lg shadow-md border-t-2 border-teal-500">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Logs for Sep {selectedDate}</h3>
                            <p className="text-sm text-gray-600 italic">
                                Currently, no specific logs are defined for this date in the mock data.
                            </p>
                            <div className="mt-2 text-xs text-blue-600 font-medium hover:underline cursor-pointer">
                                + View/Add Day Report
                            </div>
                        </div>
                    )}
                </div>

                {/* COLUMN 2: Log Board (lg:col-span-6) */}
                <div className="lg:col-span-6">
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">Log Board (Interactive)</h3>
                    
                    <TaskStatusChart data={taskChartData} />
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
                        {kanbanColumns.map(column => (
                            <div 
                                key={column.status} 
                                className="flex flex-col p-3 bg-gray-50 rounded-lg shadow-inner border border-gray-200"
                            >
                                <h4 className="text-xs font-bold uppercase mb-2 text-gray-600 border-b pb-1 border-gray-200">
                                    {column.title}
                                </h4>
                                <span className="text-[10px] text-gray-500 mb-3">({getTasksByStatus(column.status).length} items)</span>

                                {/* List Tasks */}
                                <div className="min-h-[200px] space-y-2">
                                    {getTasksByStatus(column.status).map(task => (
                                        <TaskCard
                                            key={task.id}
                                            task={task}
                                            onToggleTimer={handleToggleTimer}
                                            onQuickLog={handleQuickLog}
                                            onMoveTask={handleMoveTask}
                                        />
                                    ))}
                                </div>
                                {/* ⭐ MODIFIED: Button now triggers modal ⭐ */}
                                <button 
                                    onClick={() => handleAddTaskClick(column.status)}
                                    className="text-xs text-blue-600 hover:text-blue-700 mt-3 py-2 border border-dashed border-blue-300 rounded-lg bg-blue-50 transition"
                                >
                                    + Add Task
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* COLUMN 3: Time & Activity Log (lg:col-span-3) */}
                <div className="lg:col-span-3 space-y-5">
                    
                    {/* Time & Activity Log Form */}
                    <div className="p-4 bg-white rounded-lg shadow-sm" id="log-form-section">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800">Time & Activity Log</h3>
                        <form onSubmit={handleSubmitLog}>
                            <div className="mb-3">
                                <label className="block text-xs font-medium text-gray-600 mb-1 sr-only" htmlFor="timeSpent">Time Spent</label>
                                <input type="text" id="timeSpent" name="timeSpent" placeholder="Time Spent (e.g., 2h)" value={formState.timeSpent} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" />
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
                                    <input type="text" id="taskTicket" name="taskTicket" placeholder="Task/Ticket" value={formState.taskTicket} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm" />
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
                    
                    <TimeDistributionChart data={timeChartData} />
                    
                    {/* Recent Logs (With Remove button) */}
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-3 text-gray-800">Recent Logs</h3>
                        
                        <div className="space-y-3 text-sm">
                            {logs.slice(0, 5).map(log => (
                                <div key={log.id} className="flex justify-between items-center pb-2 border-b border-gray-100 last:border-b-0">
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        <span className="font-medium text-gray-700">{log.time} ({log.type}) - {log.description.substring(0, 20)}{log.description.length > 20 ? '...' : ''}</span>
                                    </div>
                                    <button 
                                        onClick={() => handleRemoveLog(log.id)}
                                        className="p-1 rounded hover:bg-gray-100 transition"
                                        title="Delete Log"
                                    >
                                        <svg className="w-4 h-4 text-gray-400 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Total Hours */}
                    <div className="p-4 bg-white rounded-lg shadow-sm border-t border-gray-100">
                        <div className="flex justify-between font-semibold text-gray-700 text-sm mb-2">
                            <span>Total Hours This Week:</span>
                            <span className="text-blue-600">{hoursPart}h {minutesPart}m</span>
                        </div>
                        
                        {/* Weekly Hours Goal Meter */}
                        <div className="text-center mt-3">
                            <p className="text-xs text-gray-500 mb-1">Progress towards goal ({weeklyGoal} hours)</p>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div 
                                    className={`h-3 rounded-full ${progressPercent < 50 ? 'bg-orange-500' : 'bg-green-500'}`} 
                                    style={{ width: `${progressPercent}%` }}
                                ></div>
                            </div>
                            <p className={`text-sm font-bold mt-1 ${progressPercent < 50 ? 'text-orange-600' : 'text-green-600'}`}>{progressPercent.toFixed(1)}% Complete</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogManagement;
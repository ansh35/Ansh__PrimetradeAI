import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import useAuthStore from '../store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { 
  Plus, 
  ListTodo, 
  Search, 
  AlertCircle, 
  Clock, 
  User
} from 'lucide-react';
import CreateTaskModal from '@/components/CreateTaskModal';
import TaskDetailModal from '@/components/TaskDetailModal';
import StatusDropdown from '@/components/StatusDropdown';
import FilterDropdown from '@/components/FilterDropdown';
import { cn } from '@/lib/utils';

const Tasks = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const { user } = useAuthStore();

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/tasks');
      // Backend returns { success: true, data: [...] }
      setTasks(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
      await api.put(`/tasks/${taskId}`, { status: newStatus });
    } catch (error) {
      console.error('Failed to update task status', error);
      fetchTasks();
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           task.project?.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = !statusFilter || task.status === statusFilter;
      const matchesPriority = !priorityFilter || task.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchQuery, statusFilter, priorityFilter]);

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'MEDIUM': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'LOW': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-white/5 text-muted-foreground border-white/10';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center space-y-6">
        <div className="size-16 border-4 border-primary/20 border-t-primary rounded-[2rem] animate-spin shadow-2xl" />
        <div className="text-center space-y-2">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-white">Loading Tasks</p>
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/40">Getting your task list...</p>
        </div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="size-2 rounded-full bg-secondary animate-pulse shadow-[0_0_8px_rgba(236,72,153,0.5)]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Task Management</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black tracking-tighter text-white"
          >
            Task <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-accent to-primary">List</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm font-medium text-muted-foreground/60 max-w-xl"
          >
            Create, assign, and track tasks across your projects.
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {user?.role === 'ADMIN' && (
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="h-14 px-8 rounded-2xl bg-white text-black hover:bg-white/90 font-black uppercase tracking-widest text-[11px] shadow-2xl transition-all hover:scale-105"
            >
              <Plus className="size-4 mr-3" />
              New Task
            </Button>
          )}
        </motion.div>
      </div>

      {/* Advanced Control Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col space-y-4"
      >
        <div className="flex flex-col md:flex-row items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-3xl backdrop-blur-xl">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by task title, project, or keyword..."
              className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-4 text-sm font-medium text-white placeholder:text-muted-foreground/20 focus:outline-none focus:border-secondary/40 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <FilterDropdown 
              label="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { label: 'TODO', value: 'TODO' },
                { label: 'IN PROGRESS', value: 'IN_PROGRESS' },
                { label: 'COMPLETE', value: 'DONE' },
              ]}
            />
            <FilterDropdown 
              label="Priority"
              value={priorityFilter}
              onChange={setPriorityFilter}
              options={[
                { label: 'HIGH', value: 'HIGH' },
                { label: 'MEDIUM', value: 'MEDIUM' },
                { label: 'LOW', value: 'LOW' },
              ]}
            />
          </div>
        </div>

        {(statusFilter || priorityFilter || searchQuery) && (
          <div className="flex items-center gap-2 px-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">Active Filters:</span>
            {statusFilter && <Badge variant="secondary" className="rounded-lg text-[9px] font-black uppercase tracking-widest bg-white/5 px-3 py-1">{statusFilter}</Badge>}
            {priorityFilter && <Badge variant="secondary" className="rounded-lg text-[9px] font-black uppercase tracking-widest bg-white/5 px-3 py-1">{priorityFilter}</Badge>}
            {searchQuery && <Badge variant="secondary" className="rounded-lg text-[9px] font-black uppercase tracking-widest bg-white/5 px-3 py-1">Query: {searchQuery}</Badge>}
            <button 
              onClick={() => { setSearchQuery(''); setStatusFilter(''); setPriorityFilter(''); }}
              className="text-[10px] font-black uppercase tracking-widest text-secondary hover:text-white transition-colors ml-2"
            >
              Clear Filters
            </button>
          </div>
        )}
      </motion.div>

      {/* Tasks Display */}
      <AnimatePresence mode="wait">
        {filteredTasks.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-32 text-center"
          >
            <div className="size-24 rounded-[2.5rem] bg-white/[0.02] border border-dashed border-white/10 flex items-center justify-center mx-auto mb-8">
              <ListTodo className="size-10 text-muted-foreground/10" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Tasks Found</h3>
            <p className="text-sm text-muted-foreground/40 uppercase tracking-widest font-black">No tasks match your current filters</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredTasks.map((task) => {
              const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'DONE';
              
              return (
                <motion.div key={task._id} variants={item}>
                  <Card 
                    onClick={() => {
                      setSelectedTask(task);
                      setIsDetailModalOpen(true);
                    }}
                    className="group relative glass border-white/5 cursor-pointer transition-all duration-500 hover:border-secondary/30 rounded-[2.5rem] h-full flex flex-col"
                  >
                    <CardContent className="p-8 flex-1 flex flex-col space-y-6">
                      <div className="flex items-start justify-between">
                        <div className={cn(
                          "px-4 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-[0.2em] transition-all",
                          getPriorityStyles(task.priority)
                        )}>
                          {task.priority} Priority
                        </div>
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <StatusDropdown 
                            status={task.status} 
                            onStatusChange={(newStatus) => handleStatusChange(task._id, newStatus)} 
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-xl font-black tracking-tight text-white group-hover:text-secondary transition-colors line-clamp-2 leading-tight">
                          {task.title}
                        </h3>
                        <div className="flex items-center gap-3">
                          <div className="size-1.5 rounded-full bg-secondary" />
                          <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest truncate">
                            {task.project?.title || 'General'}
                          </span>
                        </div>
                      </div>

                      <div className="flex-1" />

                      <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-muted-foreground/30">
                            <Clock className="size-3" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Due Date</span>
                          </div>
                          <p className={cn(
                            "text-xs font-black tracking-tight",
                            isOverdue ? "text-rose-400" : "text-white/80"
                          )}>
                            {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No due date'}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-muted-foreground/30">
                            <User className="size-3" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Assignee</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="size-5 rounded-full bg-secondary/20 flex items-center justify-center text-[8px] font-black text-secondary border border-secondary/30">
                              {task.assignedTo?.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <p className="text-xs font-bold text-white/80 truncate">
                              {task.assignedTo?.name?.split(' ')[0] || 'Unassigned'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {isOverdue && (
                        <div className="mt-4 px-4 py-2 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center gap-2">
                          <AlertCircle className="size-3.5 text-rose-400" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-rose-400">Overdue</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchTasks}
      />
      <TaskDetailModal
        task={selectedTask}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedTask(null);
        }}
        onStatusChange={handleStatusChange}
        onDelete={() => {
          setSelectedTask(null);
          fetchTasks();
        }}
      />
    </div>
  );
};

export default Tasks;

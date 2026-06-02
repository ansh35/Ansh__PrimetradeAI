import React, { useState, useEffect } from 'react';
import { Dialog } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import api from '@/services/api';
import { ListTodo, Target, Clock, AlertCircle, Shield, User, ChevronDown } from 'lucide-react';


interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [status, setStatus] = useState('TODO');
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
    }
  }, [isOpen]);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    }
  };

  const handleProjectChange = (projectId: string) => {
    const project = projects.find(p => p._id === projectId);
    setSelectedProject(project);
    setAssignedTo('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) {
      setError('Please select a project node');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await api.post('/tasks', {
        title,
        description,
        priority,
        status,
        dueDate: dueDate || undefined,
        assignedTo: assignedTo || undefined,
        project: selectedProject._id,
      });

      setTitle('');
      setDescription('');
      setPriority('MEDIUM');
      setStatus('TODO');
      setDueDate('');
      setAssignedTo('');
      setSelectedProject(null);

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to deploy objective');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Create New Task">
      <form onSubmit={handleSubmit} className="space-y-8 max-h-[75vh] overflow-y-auto custom-scrollbar px-2">
        {error && (
          <div className="flex items-center gap-3 p-4 text-[10px] font-black uppercase tracking-widest text-destructive bg-destructive/10 border border-destructive/20 rounded-2xl animate-in shake-1">
            <AlertCircle className="size-4" />
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="project" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 ml-1 flex items-center gap-2">
              <Shield className="size-3" /> Project Origin
            </Label>
            <div className="relative group">
              <select
                id="project"
                className="flex h-12 w-full rounded-2xl border border-white/5 bg-white/[0.03] px-6 py-2 text-sm font-bold tracking-tight focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all appearance-none cursor-pointer shadow-inner"
                value={selectedProject?._id || ''}
                onChange={(e) => handleProjectChange(e.target.value)}
                required
              >
                <option value="" className="bg-[#09090b] text-muted-foreground/40">Select Project</option>
                {projects.map(p => (
                  <option key={p._id} value={p._id} className="bg-[#09090b] text-foreground">{p.title}</option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/40">
                <ChevronDown className="size-4" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 ml-1 flex items-center gap-2">
              <Target className="size-3" /> Objective Title
            </Label>
            <Input
              id="title"
              placeholder="Title"
              className="bg-white/[0.03] border-white/5 rounded-2xl h-12 px-6 text-sm font-bold tracking-tight focus:border-primary/50 transition-all shadow-inner"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 ml-1 flex items-center gap-2">
              <ListTodo className="size-3" /> Deployment Brief
            </Label>
            <textarea
              id="description"
              className="flex min-h-[100px] w-full rounded-2xl border border-white/5 bg-white/[0.03] px-6 py-4 text-sm font-bold tracking-tight ring-offset-background placeholder:text-muted-foreground/20 focus:border-primary/50 transition-all shadow-inner resize-none"
              placeholder="Technical details and scope..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="priority" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 ml-1 flex items-center gap-2">
                <AlertCircle className="size-3" /> Priority Level
              </Label>
              <select
                id="priority"
                className="flex h-12 w-full rounded-2xl border border-white/5 bg-white/[0.03] px-6 py-2 text-sm font-bold tracking-tight focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="LOW" className="bg-[#09090b]">LOW</option>
                <option value="MEDIUM" className="bg-[#09090b]">MEDIUM</option>
                <option value="HIGH" className="bg-[#09090b]">HIGH</option>
              </select>
            </div>
            <div className="space-y-3">
              <Label htmlFor="status" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 ml-1 flex items-center gap-2">
                <Clock className="size-3" /> Current Phase
              </Label>
              <select
                id="status"
                className="flex h-12 w-full rounded-2xl border border-white/5 bg-white/[0.03] px-6 py-2 text-sm font-bold tracking-tight focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="TODO" className="bg-[#09090b]">TODO</option>
                <option value="IN_PROGRESS" className="bg-[#09090b]">IN PROGRESS</option>
                <option value="DONE" className="bg-[#09090b]">COMPLETE</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="dueDate" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 ml-1 flex items-center gap-2">
                <Clock className="size-3" /> Extraction Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                className="bg-white/[0.03] border-white/5 rounded-2xl h-12 px-6 text-sm font-bold tracking-tight focus:border-primary/50 transition-all shadow-inner invert-[0.8] brightness-[0.8]"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="assignedTo" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 ml-1 flex items-center gap-2">
                <User className="size-3" /> Operative Lead
              </Label>
              <select
                id="assignedTo"
                className="flex h-12 w-full rounded-2xl border border-white/5 bg-white/[0.03] px-6 py-2 text-sm font-bold tracking-tight focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                disabled={!selectedProject}
              >
                <option value="" className="bg-[#09090b]">UNASSIGNED</option>
                {(() => {
                  const directMembers = selectedProject?.members || [];
                  const teamMembers = selectedProject?.team?.members || [];
                  const allMembers = [...directMembers, ...teamMembers];

                  // Filter out duplicates based on _id
                  const uniqueMembers = allMembers.filter((m, index, self) =>
                    index === self.findIndex((t) => t._id === m._id)
                  );

                  return uniqueMembers.map((m: any) => (
                    <option key={m._id} value={m._id} className="bg-[#09090b]">
                      {m.name.toUpperCase()}
                    </option>
                  ));
                })()}
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4 sticky bottom-0 bg-[#09090b]/10 backdrop-blur-sm pb-1">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-2xl h-12 border-white/5 bg-white/[0.03] hover:bg-white/[0.08] font-black text-[10px] uppercase tracking-widest transition-all"
          >
            Abort
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-[2] rounded-2xl h-12 bg-primary text-primary-foreground shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all font-black text-[10px] uppercase tracking-widest disabled:opacity-50"
          >
            {isLoading ? 'DEPLOYING...' : 'INITIATE DEPLOYMENT'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default CreateTaskModal;

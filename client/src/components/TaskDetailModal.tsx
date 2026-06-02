import { useState } from 'react';
import { Dialog } from './ui/dialog';
import { Button } from './ui/button';
import { format } from 'date-fns';
import { Calendar, Clock, User, Hash, AlignLeft, Shield, CheckCircle2, Circle, Trash2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/services/api';
import useAuthStore from '@/store/useAuthStore';

interface TaskDetailModalProps {
  task: any;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (taskId: string, status: string) => void;
  onDelete?: () => void;
}

const TaskDetailModal = ({ task, isOpen, onClose, onStatusChange, onDelete }: TaskDetailModalProps) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuthStore();

  if (!task) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'MEDIUM': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'LOW': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await api.delete(`/tasks/${task._id}`);
      onClose();
      if (onDelete) onDelete();
    } catch (err) {
      console.error('Failed to delete task', err);
    } finally {
      setIsDeleting(false);
      setIsConfirmingDelete(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Task Details">
      <div className="space-y-8 py-2">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className={cn(
              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
              getPriorityColor(task.priority)
            )}>
              {task.priority} Priority
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Task ID:</span>
              <span className="text-[10px] font-mono text-muted-foreground/60">{task._id.slice(-6).toUpperCase()}</span>
            </div>
          </div>
          <h3 className="text-3xl font-bold tracking-tight text-foreground/90">{task.title}</h3>
        </div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="size-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Assigned To</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                <User className="size-4" />
              </div>
              <span className="text-sm font-semibold">{task.assignedTo?.name || 'Unassigned'}</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="size-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Due Date</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                <Clock className="size-4" />
              </div>
              <span className="text-sm font-semibold">
                {task.dueDate ? format(new Date(task.dueDate), 'MMM dd, yyyy') : 'No Deadline'}
              </span>
            </div>
          </div>
        </div>

        {/* Status Control */}
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Shield className="size-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Current Status</span>
          </div>
          <div className="flex gap-2">
            {['TODO', 'IN_PROGRESS', 'DONE'].map((status) => (
              <button
                key={status}
                onClick={() => onStatusChange(task._id, status)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border",
                  task.status === status 
                    ? "bg-primary/20 border-primary/40 text-primary shadow-[0_0_15px_rgba(59,130,246,0.1)]" 
                    : "bg-white/[0.02] border-white/5 text-muted-foreground hover:bg-white/[0.05]"
                )}
              >
                {status === 'DONE' && <CheckCircle2 className="size-3.5" />}
                {status === 'TODO' && <Circle className="size-3.5" />}
                {status === 'IN_PROGRESS' && <Clock className="size-3.5" />}
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlignLeft className="size-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Description</span>
          </div>
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 min-h-[120px]">
            <p className="text-muted-foreground leading-relaxed text-sm">
              {task.description || 'No description provided for this task.'}
            </p>
          </div>
        </div>

        {/* Delete Confirm section */}
        {isConfirmingDelete && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-4">
            <AlertTriangle className="size-5 text-rose-400 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-bold text-rose-400">Confirm permanent deletion?</p>
              <p className="text-[10px] text-rose-400/60">This action cannot be undone.</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => setIsConfirmingDelete(false)} className="h-8 text-xs">Cancel</Button>
              <Button size="sm" onClick={handleDelete} disabled={isDeleting} className="h-8 text-xs bg-rose-600 hover:bg-rose-700 text-white">
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Hash className="size-4 text-muted-foreground/40" />
            <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">
              Project: {task.project?.title || 'General'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {user?.role === 'ADMIN' && !isConfirmingDelete && (
              <Button variant="ghost" className="rounded-xl border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 h-9 px-3" onClick={() => setIsConfirmingDelete(true)}>
                <Trash2 className="size-4" />
              </Button>
            )}
            <Button variant="outline" className="rounded-xl border-white/10" onClick={onClose}>
              Close Details
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default TaskDetailModal;

import { useState } from 'react';
import { Dialog } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { format } from 'date-fns';
import { Users, Calendar, User, Layout, FileText, Settings, ShieldCheck, ArrowRight, Trash2, AlertTriangle } from 'lucide-react';
import api from '@/services/api';

interface ProjectDetailModalProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
  onManageTeam: () => void;
  isAdmin: boolean;
  onDelete?: () => void;
}

const ProjectDetailModal = ({ project, isOpen, onClose, onManageTeam, isAdmin, onDelete }: ProjectDetailModalProps) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!project) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await api.delete(`/projects/${project._id}`);
      onClose();
      if (onDelete) onDelete();
    } catch (err) {
      console.error('Failed to delete project', err);
    } finally {
      setIsDeleting(false);
      setIsConfirmingDelete(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Project Insights">
      <div className="space-y-8 py-2">
        {/* Banner Section */}
        <div className="relative h-32 rounded-2xl bg-gradient-to-r from-primary/20 via-primary/5 to-transparent border border-primary/10 overflow-hidden flex items-end p-6">
          <div className="absolute top-4 right-4 p-3 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
            <Layout className="size-6 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-bold tracking-tight text-white">{project.title}</h3>
            <div className="flex items-center gap-2 text-primary/80">
              <ShieldCheck className="size-3" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Active Workspace</span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText className="size-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Project Mission</span>
          </div>
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
            <p className="text-muted-foreground leading-relaxed text-sm">
              {project.description || 'No detailed mission statement provided for this project.'}
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="size-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Architect</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold">{project.createdBy?.name || 'Lead Admin'}</span>
              <span className="text-[10px] text-muted-foreground">{project.createdBy?.email}</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="size-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Genesis Date</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold">
                {format(new Date(project.createdAt), 'MMMM dd, yyyy')}
              </span>
              <span className="text-[10px] text-muted-foreground">Initiated successfully</span>
            </div>
          </div>
        </div>

        {/* Team Overview Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="size-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Core Team ({project.members?.length || 0})</span>
            </div>
            {isAdmin && (
              <button 
                onClick={onManageTeam}
                className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline flex items-center gap-1"
              >
                Manage <ArrowRight className="size-3" />
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            {(Array.isArray(project.members) ? project.members : []).slice(0, 3).map((member: any) => (
              <div key={member._id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-lg bg-accent/20 flex items-center justify-center text-muted-foreground">
                    <User className="size-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold">{member.name}</span>
                    <span className="text-[10px] text-muted-foreground">{member.email}</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-[9px] uppercase tracking-tighter h-5 border-white/10">Member</Badge>
              </div>
            ))}
            {project.members?.length > 3 && (
              <div className="text-center py-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  + {(Array.isArray(project.members) ? project.members.length : 0) - 3} other specialists
                </span>
              </div>
            )}
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

        {/* Action Footer */}
        <div className="flex gap-3 pt-4 border-t border-white/5">
          <Button variant="outline" className="flex-1 rounded-xl border-white/10 h-11" onClick={onClose}>
            Back to Hub
          </Button>
          {isAdmin && !isConfirmingDelete && (
            <>
              <Button variant="ghost" className="rounded-xl border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 h-11 px-4" onClick={() => setIsConfirmingDelete(true)}>
                <Trash2 className="size-4" />
              </Button>
              <Button className="flex-1 rounded-xl shadow-lg shadow-primary/20 h-11" onClick={onManageTeam}>
                <Settings className="size-4 mr-2" />
                Project Settings
              </Button>
            </>
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default ProjectDetailModal;

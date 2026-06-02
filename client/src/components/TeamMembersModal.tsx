import React, { useState, useEffect, useCallback } from 'react';
import { Dialog } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { UserPlus, CheckCircle2, Clock, Circle, User, AlertTriangle } from 'lucide-react';
import api from '@/services/api';
import { cn } from '@/lib/utils';

interface TeamMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: any | null;
  onUpdate: () => void;
}

const statusConfig: Record<string, { label: string; icon: any; cls: string }> = {
  TODO: { label: 'Todo', icon: Circle, cls: 'text-muted-foreground bg-white/5 border-white/10' },
  IN_PROGRESS: { label: 'In Progress', icon: Clock, cls: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  DONE: { label: 'Done', icon: CheckCircle2, cls: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
};

const TeamMembersModal: React.FC<TeamMembersModalProps> = ({ isOpen, onClose, team, onUpdate }) => {
  const [email, setEmail] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [memberTasks, setMemberTasks] = useState<Record<string, any[]>>({});
  const [expandedMember, setExpandedMember] = useState<string | null>(null);

  const fetchMemberTasks = useCallback(async () => {
    if (!team?.members?.length) return;
    try {
      const response = await api.get('/tasks');
      const allTasks: any[] = Array.isArray(response.data.data) ? response.data.data : [];
      const taskMap: Record<string, any[]> = {};
      team.members.forEach((m: any) => {
        taskMap[m._id] = allTasks.filter((t: any) => t.assignedTo?._id === m._id || t.assignedTo === m._id);
      });
      setMemberTasks(taskMap);
    } catch (err) {
      console.error('Failed to fetch tasks for team members', err);
    }
  }, [team]);

  useEffect(() => {
    if (isOpen && team) {
      fetchMemberTasks();
    }
  }, [isOpen, team, fetchMemberTasks]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team || !email) return;
    try {
      setIsAdding(true);
      setError(null);
      await api.post(`/teams/${team._id}/members`, { email });
      setEmail('');
      onUpdate();
      fetchMemberTasks();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add member');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={`Manage: ${team?.name || 'Team'}`}>
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
        {/* Add Member Form */}
        <form onSubmit={handleAddMember} className="space-y-3 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
          <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Add Operative by Email</Label>
          <div className="flex gap-2">
            <Input
              id="email"
              type="email"
              placeholder="colleague@taskflow.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/[0.03] border-white/5 rounded-xl h-11 text-sm"
            />
            <Button type="submit" disabled={isAdding} className="h-11 rounded-xl px-5 font-black text-[11px] uppercase tracking-wider shrink-0">
              <UserPlus className="h-4 w-4 mr-2" />
              {isAdding ? 'Adding...' : 'Add'}
            </Button>
          </div>
          {error && (
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="size-3.5" />
              <p className="text-xs font-medium">{error}</p>
            </div>
          )}
        </form>

        {/* Members with Task Details */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <User className="size-4 text-muted-foreground" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Operatives ({team?.members?.length || 0})
            </span>
          </div>

          {(team?.members || []).map((member: any) => {
            const tasks = memberTasks[member._id] || [];
            const isExpanded = expandedMember === member._id;
            const doneTasks = tasks.filter(t => t.status === 'DONE').length;

            return (
              <div key={member._id} className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-4 hover:bg-white/[0.03] transition-colors text-left"
                  onClick={() => setExpandedMember(isExpanded ? null : member._id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-black text-primary">
                      {member.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{member.name}</p>
                      <p className="text-[10px] text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className={cn('rounded-lg text-[9px] font-black uppercase tracking-widest px-2', member.role === 'ADMIN' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-white/5 border-white/10')}>
                      {member.role}
                    </Badge>
                    <div className="text-right">
                      <p className="text-xs font-black text-white">{tasks.length} tasks</p>
                      <p className="text-[9px] text-emerald-400">{doneTasks} done</p>
                    </div>
                    <span className="text-muted-foreground/40 text-xs">{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-white/5 p-4 space-y-2">
                    {tasks.length === 0 ? (
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30 text-center py-4">No tasks assigned</p>
                    ) : (
                      tasks.map((task: any) => {
                        const cfg = statusConfig[task.status] || statusConfig['TODO'];
                        const StatusIcon = cfg.icon;
                        return (
                          <div key={task._id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <StatusIcon className={cn('size-4 shrink-0', cfg.cls)} />
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-white truncate">{task.title}</p>
                                <p className="text-[9px] text-muted-foreground truncate">{task.project?.title || 'General'}</p>
                              </div>
                            </div>
                            <Badge className={cn('rounded-lg text-[9px] font-black uppercase tracking-wider px-2 shrink-0 ml-2 border', cfg.cls)}>
                              {cfg.label}
                            </Badge>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Dialog>
  );
};

export default TeamMembersModal;

import React, { useState } from 'react';
import { Dialog } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Trash2, UserPlus } from 'lucide-react';
import api from '@/services/api';
import { cn } from '@/lib/utils';

interface Member {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Project {
  _id: string;
  title: string;
  members: Member[];
}

interface TeamManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
  onUpdate: () => void;
}

const TeamManagementModal: React.FC<TeamManagementModalProps> = ({ isOpen, onClose, project, onUpdate }) => {
  const [email, setEmail] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !email) return;

    try {
      setIsAdding(true);
      setError(null);
      await api.post(`/projects/${project._id}/members`, { email });
      setEmail('');
      onUpdate();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add member');
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!project) return;
    if (!confirm('Are you sure you want to remove this member?')) return;

    try {
      await api.delete(`/projects/${project._id}/members/${memberId}`);
      onUpdate();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to remove member');
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={`Team Management • ${project?.title}`}>
      <div className="space-y-8 py-2">
        {/* Add Member Form */}
        <div className="p-6 border border-white/5 rounded-2xl bg-white/[0.02] backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <UserPlus className="size-16" />
          </div>
          
          <form onSubmit={handleAddMember} className="space-y-4 relative z-10">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Invite Specialist</Label>
              <div className="flex gap-3">
                <Input
                  id="email"
                  type="email"
                  placeholder="enter.colleague@email.com"
                  className="bg-white/[0.03] border-white/10 focus:border-primary/50 transition-all rounded-xl h-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" className="rounded-xl px-6 h-11 shadow-lg shadow-primary/20" disabled={isAdding}>
                  {isAdding ? (
                    <div className="animate-spin size-4 border-2 border-white/20 border-t-white rounded-full" />
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add
                    </>
                  )}
                </Button>
              </div>
              {error && <p className="text-[10px] text-destructive font-bold uppercase tracking-wider mt-2">{error}</p>}
            </div>
          </form>
        </div>

        {/* Members List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
              Active Specialists ({project?.members.length || 0})
            </h3>
            <div className="size-1.5 rounded-full bg-primary animate-pulse" />
          </div>

          <div className="max-h-[350px] overflow-auto rounded-2xl border border-white/5 bg-white/[0.01]">
            <Table>
              <TableHeader className="bg-white/[0.02] sticky top-0 z-10">
                <TableRow className="hover:bg-transparent border-white/5">
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest py-4">Name</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest py-4">Role</TableHead>
                  <TableHead className="text-right text-[10px] font-bold uppercase tracking-widest py-4 px-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {project?.members.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="py-20 text-center text-muted-foreground">
                      <p className="text-xs font-medium uppercase tracking-widest opacity-40">No members found in this team</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  (Array.isArray(project?.members) ? project.members : []).map((member) => (
                    <TableRow key={member._id} className="hover:bg-white/[0.03] transition-colors border-white/5 group">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-foreground/90">{member.name}</span>
                            <span className="text-[10px] text-muted-foreground/60 font-medium">{member.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className={cn(
                          "px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border",
                          member.role === 'ADMIN' 
                            ? "bg-primary/10 text-primary border-primary/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]" 
                            : "bg-slate-500/10 text-slate-400 border-slate-500/20"
                        )}>
                          {member.role || 'Member'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right py-4 px-6">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 rounded-lg text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
                          onClick={() => handleRemoveMember(member._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button variant="outline" className="rounded-xl border-white/10 px-8" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default TeamManagementModal;

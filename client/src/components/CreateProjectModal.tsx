import React, { useState } from 'react';
import { Dialog } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import api from '@/services/api';
import { Rocket, Target, Users2, AlertCircle } from 'lucide-react';


interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      const fetchTeams = async () => {
        try {
          const response = await api.get('/teams');
          setTeams(Array.isArray(response.data.data) ? response.data.data : []);
        } catch (err) {
          console.error('Failed to fetch teams', err);
        }
      };
      fetchTeams();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      await api.post('/projects', { title, description, team: selectedTeam || undefined });
      setTitle('');
      setDescription('');
      setSelectedTeam('');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Create Project">
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="flex items-center gap-3 p-4 text-[10px] font-black uppercase tracking-widest text-destructive bg-destructive/10 border border-destructive/20 rounded-2xl animate-in shake-1">
            <AlertCircle className="size-4" />
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 ml-1 flex items-center gap-2">
              <Target className="size-3" /> Project Name
            </Label>
            <Input
              id="title"
              placeholder="Project Name"
              className="bg-white/[0.03] border-white/5 rounded-2xl h-14 px-6 text-sm font-bold tracking-tight focus:border-primary/50 focus:bg-white/[0.05] transition-all shadow-inner"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 ml-1 flex items-center gap-2">
              <Rocket className="size-3" /> Description
            </Label>
            <textarea
              id="description"
              className="flex min-h-[120px] w-full rounded-[2rem] border border-white/5 bg-white/[0.03] px-6 py-5 text-sm font-bold tracking-tight ring-offset-background placeholder:text-muted-foreground/20 focus-visible:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all shadow-inner resize-none"
              placeholder="Describe the project..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="team" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 ml-1 flex items-center gap-2">
              <Users2 className="size-3" /> Team (Optional)
            </Label>
            <div className="relative group">
              <select
                id="team"
                className="flex h-14 w-full rounded-2xl border border-white/5 bg-white/[0.03] px-6 py-2 text-sm font-bold tracking-tight focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all appearance-none cursor-pointer shadow-inner pr-12"
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
              >
                <option value="" className="bg-[#09090b] text-muted-foreground/40 italic">Select Team</option>
                {teams.map(t => (
                  <option key={t._id} value={t._id} className="bg-[#09090b] text-foreground">{t.name}</option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/40">
                <Users2 className="size-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-2xl h-14 border-white/5 bg-white/[0.03] hover:bg-white/[0.08] font-black text-[10px] uppercase tracking-widest transition-all"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-[2] rounded-2xl h-14 bg-primary text-primary-foreground shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all font-black text-[10px] uppercase tracking-widest disabled:opacity-50"
          >
            {isLoading ? 'CREATING...' : 'CREATE PROJECT'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default CreateProjectModal;

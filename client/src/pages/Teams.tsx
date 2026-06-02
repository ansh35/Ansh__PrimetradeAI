import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../services/api';
import useAuthStore from '../store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Users, Search } from 'lucide-react';
import CreateTeamModal from '@/components/CreateTeamModal';
import TeamMembersModal from '@/components/TeamMembersModal';
import TeamRow from '@/components/TeamRow';


const Teams = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [managementTeam, setManagementTeam] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuthStore();

  const fetchTeams = useCallback(async () => {
    try {
      setIsLoading(true);
      const [teamsResult, projectsResult, tasksResult] = await Promise.allSettled([
        api.get('/teams'),
        api.get('/projects'),
        api.get('/tasks'),
      ]);

      setTeams(
        teamsResult.status === 'fulfilled' && Array.isArray(teamsResult.value.data.data)
          ? teamsResult.value.data.data
          : []
      );
      setProjects(
        projectsResult.status === 'fulfilled' && Array.isArray(projectsResult.value.data.data)
          ? projectsResult.value.data.data
          : []
      );
      setTasks(
        tasksResult.status === 'fulfilled' && Array.isArray(tasksResult.value.data.data)
          ? tasksResult.value.data.data
          : []
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const filteredTeams = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return teams;

    return teams.filter((team) => {
      const memberMatch = (team.members || []).some((member: any) =>
        `${member.name || ''} ${member.email || ''} ${member.role || ''}`.toLowerCase().includes(query)
      );

      return `${team.name || ''} ${team.description || ''}`.toLowerCase().includes(query) || memberMatch;
    });
  }, [searchQuery, teams]);

  const handleToggleTeam = useCallback((team: any) => {
    setSelectedTeam((current: any) => (current?._id === team._id ? null : team));
  }, []);

  const handleManageTeam = useCallback((team: any) => {
    setManagementTeam(team);
    setIsMembersModalOpen(true);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col h-[70vh] items-center justify-center space-y-4">
        <div className="size-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
        <p className="text-sm text-muted-foreground font-black uppercase tracking-[0.2em] animate-pulse">Loading Teams...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-[1600px] mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-4xl font-black tracking-tight bg-gradient-to-br from-white via-white to-white/20 bg-clip-text text-transparent">Teams</h2>
          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.25em] opacity-60">Manage teams and member access</p>
        </div>
        <div className="flex items-center gap-3">
          {user?.role === 'ADMIN' && (
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="rounded-2xl bg-primary text-primary-foreground shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all h-11 font-black text-[10px] uppercase tracking-widest px-8"
            >
              <Plus className="size-4 mr-2" />
              Create Team
            </Button>
          )}
        </div>
      </div>

      <Card className="border-white/10 bg-white/[0.02] backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <CardHeader className="border-b border-white/5 bg-white/[0.01] px-8 py-6 flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-black tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent flex items-center gap-3">
            <Users className="size-5 text-primary" />
            Active Teams
          </CardTitle>
          <div className="relative group hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
            <input
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="bg-white/[0.03] border border-white/5 rounded-xl pl-9 pr-4 py-2 text-xs font-medium focus:outline-none focus:border-primary/50 transition-all w-64 shadow-inner"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {teams.length === 0 ? (
            <div className="py-32 text-center">
              <div className="size-20 rounded-[2rem] bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Users className="size-10 text-muted-foreground/20" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/30 italic">No Teams Yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-white/5">
                    <TableHead className="px-8 py-6 font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">Team Name</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">Description</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">Members</TableHead>
                    <TableHead className="text-right px-8 font-black text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeams.length === 0 ? (
                    <TableRow className="hover:bg-transparent border-white/5">
                      <TableCell colSpan={4} className="py-24 text-center">
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground/30 italic">No matching teams</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTeams.map((team) => (
                      <TeamRow
                        key={team._id}
                        team={team}
                        isExpanded={selectedTeam?._id === team._id}
                        canManage={user?.role === 'ADMIN'}
                        projects={projects}
                        tasks={tasks}
                        onToggle={handleToggleTeam}
                        onManage={handleManageTeam}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateTeamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchTeams}
      />

      <TeamMembersModal
        isOpen={isMembersModalOpen}
        onClose={() => {
          setIsMembersModalOpen(false);
          setManagementTeam(null);
        }}
        team={managementTeam}
        onUpdate={fetchTeams}
      />
    </div>
  );
};

export default Teams;

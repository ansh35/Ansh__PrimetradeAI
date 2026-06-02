import React, { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Activity, Calendar, CheckCircle2, Clock, FolderKanban, Shield, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import TeamMembers from '@/components/TeamMembers';

interface Person {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  role?: string;
}

interface Team {
  _id?: string;
  id?: string;
  name?: string;
  description?: string;
  status?: string;
  members?: Person[];
  createdBy?: Person;
  createdAt?: string;
  updatedAt?: string;
}

interface Project {
  _id?: string;
  id?: string;
  title?: string;
  name?: string;
  description?: string;
  team?: string | Team;
  createdAt?: string;
  updatedAt?: string;
}

interface Task {
  _id?: string;
  id?: string;
  title?: string;
  status?: string;
  project?: string | Project;
  assignedTo?: string | Person;
  createdAt?: string;
  updatedAt?: string;
}

interface TeamDetailsProps {
  team: Team;
  projects?: Project[];
  tasks?: Task[];
}

const getEntityId = (entity?: string | { _id?: string; id?: string } | null) => {
  if (!entity) return '';
  return typeof entity === 'string' ? entity : entity._id || entity.id || '';
};

const formatDate = (value?: string, pattern = 'MMM d, yyyy') => {
  if (!value) return 'Not available';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Not available' : format(date, pattern);
};

const formatStatus = (status?: string) => {
  if (!status) return 'Active';
  return status
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const statusClass = (status?: string) => {
  const normalized = status?.toUpperCase() || 'ACTIVE';
  if (normalized === 'ARCHIVED' || normalized === 'INACTIVE') return 'bg-white/5 text-muted-foreground border-white/10';
  if (normalized === 'PAUSED') return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
  return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
};

const taskStatusLabel = (status?: string) => {
  if (status === 'DONE') return 'completed';
  if (status === 'IN_PROGRESS') return 'started';
  return 'created';
};

const TeamDetails: React.FC<TeamDetailsProps> = ({ team, projects = [], tasks = [] }) => {
  const teamId = getEntityId(team);

  const teamProjects = useMemo(
    () => projects.filter((project) => getEntityId(project.team) === teamId),
    [projects, teamId]
  );

  const projectIds = useMemo(() => new Set(teamProjects.map((project) => getEntityId(project))), [teamProjects]);

  const teamTasks = useMemo(
    () => tasks.filter((task) => projectIds.has(getEntityId(task.project))),
    [tasks, projectIds]
  );

  const activityItems = useMemo(() => {
    const taskActivity = teamTasks.map((task) => ({
      id: `task-${getEntityId(task)}`,
      title: `${task.title || 'Task'} ${taskStatusLabel(task.status)}`,
      meta: typeof task.project === 'object' ? task.project?.title || task.project?.name || 'Team project' : 'Team project',
      date: task.updatedAt || task.createdAt,
      icon: CheckCircle2,
    }));

    const projectActivity = teamProjects.map((project) => ({
      id: `project-${getEntityId(project)}`,
      title: `${project.title || project.name || 'Project'} assigned`,
      meta: project.description || 'Active team project',
      date: project.updatedAt || project.createdAt,
      icon: FolderKanban,
    }));

    const fallbackActivity = [
      {
        id: `team-${teamId}-created`,
        title: 'Team created',
        meta: team.createdBy?.name ? `Created by ${team.createdBy.name}` : 'Workspace team initialized',
        date: team.createdAt,
        icon: Activity,
      },
    ];

    return [...taskActivity, ...projectActivity, ...fallbackActivity]
      .filter((item) => item.date || item.title)
      .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
      .slice(0, 5);
  }, [team.createdAt, team.createdBy?.name, teamId, teamProjects, teamTasks]);

  const stats = useMemo(
    () => [
      { label: 'Created', value: formatDate(team.createdAt), icon: Calendar },
      { label: 'Members', value: String(team.members?.length || 0), icon: Users },
      { label: 'Projects', value: String(teamProjects.length), icon: FolderKanban },
      { label: 'Status', value: formatStatus(team.status), icon: CheckCircle2 },
    ],
    [team.createdAt, team.members?.length, team.status, teamProjects.length]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="px-4 pb-6 pt-2 sm:px-8"
    >
      <div className="rounded-[2rem] border border-primary/10 bg-[#120B1F]/95 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_24px_80px_rgba(77,43,135,0.12)] sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="mb-2 text-[10px] font-black uppercase tracking-[0.25em] text-primary/70">Team Details</p>
                <h3 className="truncate text-2xl font-black tracking-tight text-white">{team.name || 'Untitled Team'}</h3>
                <p className="mt-3 max-w-3xl text-sm font-medium leading-6 text-muted-foreground/70">
                  {team.description || 'No description provided for this team.'}
                </p>
              </div>
              <Badge className={cn('w-fit rounded-xl border px-3 py-1.5 text-[10px] font-black uppercase tracking-widest', statusClass(team.status))}>
                {formatStatus(team.status)}
              </Badge>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-2xl border border-white/5 bg-white/[0.025] p-4">
                    <div className="mb-3 flex items-center gap-2 text-muted-foreground/50">
                      <Icon className="size-4" />
                      <span className="text-[9px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                    </div>
                    <p className="text-sm font-black text-white">{item.value}</p>
                  </div>
                );
              })}
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
              <div className="mb-4 flex items-center gap-3">
                <div className="size-10 rounded-2xl border border-primary/20 bg-primary/10 flex items-center justify-center text-primary">
                  <Shield className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Team Leader</p>
                  <p className="truncate text-sm font-bold text-white">{team.createdBy?.name || 'Not assigned'}</p>
                  <p className="truncate text-[10px] text-muted-foreground/50">{team.createdBy?.email || 'No email available'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                <Clock className="size-3.5" />
                Created {formatDate(team.createdAt)}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/45">Member List</h4>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary/70">{team.members?.length || 0} total</span>
              </div>
              <TeamMembers members={team.members} />
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-[1.5rem] border border-white/5 bg-white/[0.02] p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/45">Active Projects</h4>
                <Badge variant="secondary" className="rounded-lg border-white/10 bg-white/[0.04] text-[9px] font-black uppercase tracking-widest">
                  {teamProjects.length}
                </Badge>
              </div>
              <div className="space-y-3">
                {teamProjects.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/35">No active projects</p>
                  </div>
                ) : (
                  teamProjects.map((project) => (
                    <div key={getEntityId(project)} className="rounded-2xl border border-white/5 bg-white/[0.025] p-4">
                      <p className="truncate text-sm font-black text-white">{project.title || project.name || 'Untitled Project'}</p>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground/55">
                        {project.description || 'No project description available.'}
                      </p>
                      <p className="mt-3 text-[9px] font-black uppercase tracking-widest text-primary/60">
                        Updated {formatDate(project.updatedAt || project.createdAt, 'MMM d')}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-white/5 bg-white/[0.02] p-4">
              <div className="mb-4 flex items-center gap-2">
                <Activity className="size-4 text-primary" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/45">Recent Activity</h4>
              </div>
              <div className="space-y-3">
                {activityItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.id} className="flex gap-3 rounded-2xl border border-white/5 bg-white/[0.025] p-3">
                      <div className="mt-0.5 size-8 shrink-0 rounded-xl border border-primary/15 bg-primary/10 flex items-center justify-center text-primary">
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-black text-white">{item.title}</p>
                        <p className="mt-1 truncate text-[10px] text-muted-foreground/50">{item.meta}</p>
                        <p className="mt-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground/35">
                          {formatDate(item.date, 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(TeamDetails);

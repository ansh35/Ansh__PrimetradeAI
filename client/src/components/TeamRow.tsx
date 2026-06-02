import React, { Fragment, memo, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Shield, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import TeamDetails from '@/components/TeamDetails';

interface TeamRowProps {
  team: any;
  isExpanded: boolean;
  canManage: boolean;
  projects: any[];
  tasks: any[];
  onToggle: (team: any) => void;
  onManage: (team: any) => void;
}

const TeamRow: React.FC<TeamRowProps> = ({ team, isExpanded, canManage, projects, tasks, onToggle, onManage }) => {
  const previewMembers = useMemo(() => (Array.isArray(team.members) ? team.members.slice(0, 3) : []), [team.members]);
  const memberCount = Array.isArray(team.members) ? team.members.length : 0;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTableRowElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onToggle(team);
    }
  };

  return (
    <Fragment>
      <TableRow
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onClick={() => onToggle(team)}
        onKeyDown={handleKeyDown}
        data-state={isExpanded ? 'selected' : undefined}
        className="group cursor-pointer hover:bg-white/[0.04] transition-all border-white/5 relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 data-[state=selected]:bg-primary/[0.045]"
      >
        <TableCell className="px-8 py-6">
          <div className="flex items-center gap-4 relative z-10">
            <div className="size-11 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary shadow-lg shadow-primary/5">
              <Shield className="size-5" />
            </div>
            <div className="min-w-0">
              <span className="block truncate font-black text-base group-hover:text-primary transition-colors tracking-tight">
                {team.name}
              </span>
              <span className="mt-1 block text-[10px] font-black uppercase tracking-widest text-muted-foreground/35 md:hidden">
                {memberCount} members
              </span>
            </div>
          </div>
        </TableCell>
        <TableCell className="relative z-10">
          <p className="text-sm font-bold text-muted-foreground/40 max-w-[400px] truncate uppercase tracking-wider">
            {team.description || 'No description provided'}
          </p>
        </TableCell>
        <TableCell className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2.5">
              {previewMembers.map((member: any, index: number) => (
                <div
                  key={member?._id || member?.email || index}
                  className="size-9 rounded-xl border-4 border-[#09090b] bg-white/5 flex items-center justify-center text-[11px] font-black text-muted-foreground shadow-xl"
                >
                  {member?.name?.charAt(0).toUpperCase() || member?.email?.charAt(0).toUpperCase() || '?'}
                </div>
              ))}
              {memberCount > 3 && (
                <div className="size-9 rounded-xl border-4 border-[#09090b] bg-primary/20 flex items-center justify-center text-[11px] font-black text-primary shadow-xl">
                  +{memberCount - 3}
                </div>
              )}
            </div>
            <Badge variant="secondary" className="rounded-lg bg-white/[0.03] border-white/5 text-[10px] font-black uppercase tracking-widest px-3 py-1 ml-2">
              {memberCount} MEMBERS
            </Badge>
          </div>
        </TableCell>
        <TableCell className="text-right px-8 relative z-10">
          <div className="flex items-center justify-end gap-3">
            {canManage && (
              <Button
                variant="ghost"
                size="sm"
                className="h-10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 hover:text-primary transition-all border border-white/10 hover:border-primary/20 shadow-lg"
                onClick={(event) => {
                  event.stopPropagation();
                  onManage(team);
                }}
              >
                <Users className="h-4 w-4 mr-2" />
                MANAGE
              </Button>
            )}
            <div className="size-9 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/20 transition-colors">
              {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </div>
          </div>
        </TableCell>
      </TableRow>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <TableRow className="border-white/5 hover:bg-transparent">
            <TableCell colSpan={4} className="p-0">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <TeamDetails team={team} projects={projects} tasks={tasks} />
              </motion.div>
            </TableCell>
          </TableRow>
        )}
      </AnimatePresence>
    </Fragment>
  );
};

export default memo(TeamRow);

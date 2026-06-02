import React, { memo, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TeamMember {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  role?: string;
}

interface TeamMembersProps {
  members?: TeamMember[];
}

const getInitials = (name?: string, email?: string) => {
  const source = name || email || 'Member';
  return source
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const TeamMembers: React.FC<TeamMembersProps> = ({ members = [] }) => {
  const normalizedMembers = useMemo(() => members.filter(Boolean), [members]);

  if (normalizedMembers.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/40">
          No members assigned
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {normalizedMembers.map((member, index) => (
        <div
          key={member._id || member.id || member.email || index}
          className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.025] p-3 shadow-inner"
        >
          <div className="size-10 shrink-0 rounded-2xl border border-primary/20 bg-primary/10 flex items-center justify-center text-xs font-black text-primary shadow-lg shadow-primary/5">
            {getInitials(member.name, member.email)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">{member.name || member.email || 'Unnamed Member'}</p>
            <p className="truncate text-[10px] font-medium text-muted-foreground/50">{member.email || 'No email available'}</p>
          </div>
          <Badge
            variant="secondary"
            className={cn(
              'shrink-0 rounded-lg px-2 py-1 text-[9px] font-black uppercase tracking-widest',
              member.role === 'ADMIN'
                ? 'border-primary/30 bg-primary/15 text-primary'
                : 'border-white/10 bg-white/[0.04] text-muted-foreground'
            )}
          >
            {member.role || 'Member'}
          </Badge>
        </div>
      ))}
    </div>
  );
};

export default memo(TeamMembers);

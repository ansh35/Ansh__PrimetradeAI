import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import useAuthStore from '../store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { 
  Users, 
  Plus, 
  FolderKanban, 
  Search, 
  ArrowUpRight, 
  Calendar,
  LayoutGrid,
  List,
  MoreVertical
} from 'lucide-react';
import TeamManagementModal from '@/components/TeamManagementModal';
import CreateProjectModal from '@/components/CreateProjectModal';
import ProjectDetailModal from '@/components/ProjectDetailModal';
import { cn } from '@/lib/utils';

const Projects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { user } = useAuthStore();

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/projects');
      // Backend returns { success: true, data: [...] }
      setProjects(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleUpdate = () => {
    fetchProjects();
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center space-y-6">
        <div className="size-16 border-4 border-primary/20 border-t-primary rounded-[2rem] animate-spin shadow-2xl" />
        <div className="text-center space-y-2">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-white">Loading Projects</p>
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/40">Getting your projects...</p>
        </div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="size-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Project Management</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black tracking-tighter text-white"
          >
            Project <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">List</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm font-medium text-muted-foreground/60 max-w-xl"
          >
            Create projects, add members, and keep work organized.
          </motion.p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3"
        >
          {user?.role === 'ADMIN' && (
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="h-14 px-8 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-black uppercase tracking-widest text-[11px] shadow-2xl hover:scale-105 transition-all shadow-primary/20"
            >
              <Plus className="size-4 mr-3" />
              New Project
            </Button>
          )}
        </motion.div>
      </div>

      {/* Control Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col md:flex-row items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-3xl backdrop-blur-xl"
      >
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/40" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by name, description or ID..."
            className="w-full h-12 bg-white/[0.03] border border-white/5 rounded-2xl pl-12 pr-4 text-sm font-medium text-white placeholder:text-muted-foreground/20 focus:outline-none focus:border-primary/40 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2 bg-white/[0.03] p-1 rounded-2xl border border-white/5">
          <button 
            onClick={() => setViewMode('grid')}
            className={cn(
              "size-10 rounded-xl flex items-center justify-center transition-all",
              viewMode === 'grid' ? "bg-white/10 text-white shadow-xl" : "text-muted-foreground/40 hover:text-white"
            )}
          >
            <LayoutGrid className="size-5" />
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={cn(
              "size-10 rounded-xl flex items-center justify-center transition-all",
              viewMode === 'list' ? "bg-white/10 text-white shadow-xl" : "text-muted-foreground/40 hover:text-white"
            )}
          >
            <List className="size-5" />
          </button>
        </div>
      </motion.div>

      {/* Projects Display */}
      <AnimatePresence mode="wait">
        {filteredProjects.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-32 text-center"
          >
            <div className="size-24 rounded-[2.5rem] bg-white/[0.02] border border-dashed border-white/10 flex items-center justify-center mx-auto mb-8">
              <FolderKanban className="size-10 text-muted-foreground/10" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Projects Found</h3>
            <p className="text-sm text-muted-foreground/40 uppercase tracking-widest font-black">No projects match your search</p>
          </motion.div>
        ) : (
          <motion.div 
            key={viewMode}
            variants={container}
            initial="hidden"
            animate="show"
            className={cn(
              "grid gap-6",
              viewMode === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            )}
          >
            {filteredProjects.map((project) => (
              <motion.div key={project._id} variants={item}>
                <Card 
                  onClick={() => {
                    setSelectedProject(project);
                    setIsDetailModalOpen(true);
                  }}
                  className={cn(
                    "group relative overflow-hidden glass border-white/5 cursor-pointer transition-all duration-500 hover:border-primary/20",
                    viewMode === 'grid' ? "rounded-[2.5rem]" : "rounded-3xl"
                  )}
                >
                  <CardContent className={cn("p-8", viewMode === 'list' && "flex items-center gap-8 py-6")}>
                    <div className="flex-1 space-y-6">
                      <div className="flex items-start justify-between">
                        <div className="size-14 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-white/5 text-primary group-hover:scale-110 transition-transform duration-500 shadow-inner">
                          <FolderKanban className="size-6" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[9px] font-black uppercase tracking-widest rounded-lg px-3 py-1">
                            Active
                          </Badge>
                          <button className="size-8 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground/40 hover:bg-white/10 hover:text-white transition-all">
                            <MoreVertical className="size-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-2xl font-black tracking-tight text-white group-hover:text-primary transition-colors flex items-center gap-3">
                          {project.title}
                          <ArrowUpRight className="size-5 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all text-primary" />
                        </h3>
                        <p className="text-sm font-medium text-muted-foreground/50 line-clamp-2 leading-relaxed">
                          {project.description || 'No description provided for this project.'}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground/60">
                            <Users className="size-4" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground/20 uppercase tracking-widest">Members</p>
                            <p className="text-xs font-black text-white">{project.members?.length || 0} Members</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-xl bg-white/5 flex items-center justify-center text-muted-foreground/60">
                            <Calendar className="size-4" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground/20 uppercase tracking-widest">Timeline</p>
                            <p className="text-xs font-black text-white">{format(new Date(project.createdAt), 'MMM yyyy')}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex -space-x-3">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="size-8 rounded-full bg-white/[0.03] border border-white/10 ring-4 ring-[#0A0A0F] flex items-center justify-center text-[10px] font-bold text-muted-foreground/40">
                              U
                            </div>
                          ))}
                          <div className="size-8 rounded-full bg-primary/10 border border-primary/20 ring-4 ring-[#0A0A0F] flex items-center justify-center text-[10px] font-black text-primary">
                            +{project.members?.length || 0}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Ready</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <TeamManagementModal
        isOpen={isTeamModalOpen}
        onClose={() => {
          setIsTeamModalOpen(false);
          setSelectedProject(null);
        }}
        project={selectedProject}
        onUpdate={handleUpdate}
      />

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchProjects}
      />
      
      <ProjectDetailModal
        project={selectedProject}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedProject(null);
        }}
        onManageTeam={() => {
          setIsDetailModalOpen(false);
          setIsTeamModalOpen(true);
        }}
        isAdmin={user?.role === 'ADMIN'}
        onDelete={() => {
          setSelectedProject(null);
          fetchProjects();
        }}
      />
    </div>
  );
};

export default Projects;

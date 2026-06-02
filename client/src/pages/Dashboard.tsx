import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle2, 
  FolderKanban, 
  ListTodo, 
  RefreshCw, 
  Check, 
  ArrowUpRight,
  TrendingUp,
  Activity,
  Target
} from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DashboardData {
  totalProjects: number;
  activeTasks: number;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  recentActivity: any[];
  statusSummary: {
    TODO: number;
    IN_PROGRESS: number;
    DONE: number;
  };
}

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchDashboard = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      else setIsRefreshing(true);
      
      const response = await api.get('/dashboard');
      const stats = response.data.data;
      setData({
        ...stats,
        activeTasks: (stats.statusSummary?.TODO || 0) + (stats.statusSummary?.IN_PROGRESS || 0)
      });
      
      if (silent) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleRefresh = () => fetchDashboard(true);

  if (isLoading) {
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center space-y-6">
        <div className="relative">
          <div className="size-16 border-4 border-primary/20 border-t-primary rounded-3xl animate-spin shadow-2xl" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-2 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-white">Loading Dashboard</p>
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/40">Getting your workspace data...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-10 pb-12"
    >
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <motion.div variants={item} className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
              Status: Good
            </span>
          </motion.div>
          <motion.h2 variants={item} className="text-5xl font-black tracking-tighter text-white">
            Workspace <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Overview</span>
          </motion.h2>
          <motion.p variants={item} className="text-sm font-medium text-muted-foreground/60 max-w-xl">
            Welcome back. Here is a quick view of your projects, tasks, and progress.
          </motion.p>
        </div>
        
        <motion.div variants={item}>
          <Button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={cn(
              "h-14 px-8 rounded-2xl bg-white text-black hover:bg-white/90 font-black uppercase tracking-widest text-[11px] shadow-2xl transition-all",
              showSuccess && "bg-emerald-500 text-white hover:bg-emerald-600"
            )}
          >
            {showSuccess ? (
              <><Check className="size-4 mr-3" /> Updated</>
            ) : (
              <><RefreshCw className={cn("size-4 mr-3", isRefreshing && "animate-spin")} /> {isRefreshing ? 'Refreshing...' : 'Refresh'}</>
            )}
          </Button>
        </motion.div>
      </div>

      {/* Stats Matrix */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Total Projects', value: data.totalProjects, desc: 'Active projects', icon: FolderKanban, color: 'text-primary', bg: 'bg-primary/10' },
          { title: 'Active Tasks', value: data.activeTasks, desc: 'Open tasks', icon: Activity, color: 'text-secondary', bg: 'bg-secondary/10' },
          { title: 'Completed', value: data.completedTasks, desc: 'Finished tasks', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { title: 'Progress', value: `${Math.round((data.completedTasks / (data.totalTasks || 1)) * 100)}%`, desc: 'Tasks completed', icon: TrendingUp, color: 'text-accent', bg: 'bg-accent/10' }
        ].map((stat, i) => (
          <motion.div key={i} variants={item}>
            <Card className="group relative overflow-hidden glass border-white/5 rounded-[2rem] hover:border-white/10 transition-all duration-500 hover:-translate-y-1">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                <stat.icon className="size-20 -mr-6 -mt-6" />
              </div>

              <CardHeader className="flex flex-row items-center justify-between pb-2 px-8 pt-8">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">{stat.title}</span>
                <div className={cn("size-10 rounded-2xl flex items-center justify-center border border-white/5", stat.bg, stat.color)}>
                  <stat.icon className="size-5" />
                </div>
              </CardHeader>
              
              <CardContent className="px-8 pb-8 space-y-1">
                <div className="text-4xl font-black tracking-tighter text-white flex items-baseline gap-2">
                  {stat.value}
                  <ArrowUpRight className="size-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest">{stat.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="grid gap-6 lg:grid-cols-12">
        <motion.div variants={item} className="lg:col-span-8">
          <Card className="h-full glass border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col">
            <CardHeader className="px-8 py-6 border-b border-white/5 flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <Activity className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-white tracking-tight">Recent Activity</CardTitle>
                  <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Latest task updates</p>
                </div>
              </div>
              <Badge variant="outline" className="rounded-xl px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border-white/10 text-muted-foreground">
                Last 24 Hours
              </Badge>
            </CardHeader>
            <CardContent className="p-4 flex-1 overflow-y-auto max-h-[500px] custom-scrollbar">
              <div className="grid gap-2">
                {(data.recentActivity?.length || 0) === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-center opacity-20">
                    <Activity className="size-16 mb-4" />
                    <p className="text-xs font-black uppercase tracking-[0.3em]">No Activity Yet</p>
                  </div>
                ) : (
                  data.recentActivity?.map((task, i) => (
                    <motion.div 
                      key={task._id} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-4 p-4 rounded-3xl hover:bg-white/[0.03] border border-transparent hover:border-white/5 transition-all group"
                    >
                      <div className="size-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center text-muted-foreground group-hover:text-white group-hover:border-primary/30 transition-all">
                        <ListTodo className="size-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">{task.title}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.15em]">{task.project?.title || 'System'}</span>
                          <div className="size-1 rounded-full bg-white/10" />
                          <span className="text-[10px] font-medium text-muted-foreground/40">{format(new Date(task.updatedAt), 'MMM d, h:mm a')}</span>
                        </div>
                      </div>
                      <Badge className={cn(
                        "rounded-xl px-4 h-8 text-[9px] font-black uppercase tracking-widest border-0",
                        task.status === 'DONE' ? 'bg-emerald-500/20 text-emerald-400' : 
                        task.status === 'IN_PROGRESS' ? 'bg-secondary/20 text-secondary' : 
                        'bg-white/10 text-muted-foreground'
                      )}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </motion.div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item} className="lg:col-span-4">
          <Card className="h-full glass border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col">
            <CardHeader className="px-8 py-6 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
                  <Target className="size-5" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-white tracking-tight">Status Distribution</CardTitle>
                  <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">Tasks by status</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-10">
              {[
                { label: 'Backlog', value: data.statusSummary?.TODO || 0, color: 'bg-white/10', glow: 'shadow-none' },
                { label: 'In Progress', value: data.statusSummary?.IN_PROGRESS || 0, color: 'bg-secondary', glow: 'neon-glow-purple' },
                { label: 'Completed', value: data.statusSummary?.DONE || 0, color: 'bg-emerald-500', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]' }
              ].map((status, i) => {
                const percentage = Math.round((status.value / (data.totalTasks || 1)) * 100);
                return (
                  <div key={i} className="space-y-4">
                    <div className="flex items-end justify-between px-1">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">{status.label}</span>
                        <div className="text-2xl font-black text-white leading-none">{status.value} <span className="text-xs font-medium text-muted-foreground/20 italic ml-1">items</span></div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-white/50">{percentage}%</span>
                      </div>
                    </div>
                    <div className="h-3 w-full bg-white/[0.03] rounded-full overflow-hidden p-0.5 border border-white/5 relative">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className={cn("h-full rounded-full transition-all duration-700", status.color, status.glow)}
                      />
                    </div>
                  </div>
                );
              })}

              <div className="mt-6 p-6 rounded-[2rem] bg-gradient-to-br from-white/[0.04] to-transparent border border-white/5 relative overflow-hidden text-center">
                <div className="absolute top-0 right-0 p-4 opacity-5 rotate-12">
                  <Activity className="size-12" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mb-3">Progress Summary</p>
                <h5 className="text-sm font-bold text-white px-2">
                  Your workspace is <span className="text-primary font-black">{Math.round((data.completedTasks / (data.totalTasks || 1)) * 100)}%</span> complete.
                </h5>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;

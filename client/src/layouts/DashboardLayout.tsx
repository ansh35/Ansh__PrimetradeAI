import { useState, useEffect } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/useAuthStore';
import api from '../services/api';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  LogOut, 
  Users2, 
  Search, 
  X, 
  Mail, 
  Shield, 
  Clock, 
  Edit2, 
  Save,
  ChevronRight,
  Command,
  FileCode2,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const DashboardLayout = () => {
  const { user, logout, updateUser } = useAuthStore();
  const location = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [projectsCount, setProjectsCount] = useState(0);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ name: user?.name || '', email: user?.email || '' });
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchProjectsCount = async () => {
      try {
        const response = await api.get('/projects');
        // Backend returns { success: true, data: [...] }
        setProjectsCount(response.data.data?.length || 0);
      } catch (error) {
        console.error('Failed to fetch projects count', error);
      }
    };
    if (user) fetchProjectsCount();
  }, [user]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, color: 'text-primary' },
    { name: 'Projects', href: '/projects', icon: FolderKanban, color: 'text-secondary' },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare, color: 'text-accent' },
    { name: 'Teams', href: '/teams', icon: Users2, color: 'text-primary' },
  ];

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      const response = await api.put('/auth/profile', editForm);
      updateUser(response.data.data);
      setIsEditingProfile(false);
      setIsUserModalOpen(false);
    } catch (error) {
      console.error('Failed to update profile', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0A0A0F] font-sans text-foreground selection:bg-primary/20 selection:text-primary relative overflow-hidden">
      {/* Global Background Aurora */}
      <div className="absolute inset-0 aurora-bg opacity-30 pointer-events-none" />
      
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -264 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="fixed inset-y-0 left-0 z-40 w-64 glass border-r-0 flex flex-col m-4 rounded-[2rem] overflow-hidden"
      >
        <div className="flex h-20 items-center px-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="size-9 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg neon-glow-purple group-hover:scale-110 transition-transform">
              <LayoutDashboard className="size-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">TaskFlow</span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-8 mt-2">
          <nav className="space-y-1">
            <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30 mb-4">Menu</p>
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-medium transition-all group relative",
                    isActive 
                      ? "bg-white/[0.06] text-white shadow-sm ring-1 ring-white/10" 
                      : "text-muted-foreground hover:text-white hover:bg-white/[0.03]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn("size-5 transition-colors", isActive ? item.color : "text-muted-foreground/50 group-hover:text-white")} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="size-4 text-white/40" />}
                </Link>
              );
            })}
          </nav>

          <nav className="space-y-1">
            <p className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30 mb-4">Developer</p>
            <a
              href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/api-docs`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-2xl px-4 py-3.5 text-sm font-medium transition-all group relative text-muted-foreground hover:text-white hover:bg-white/[0.03]"
            >
              <div className="flex items-center gap-3">
                <FileCode2 className="size-5 transition-colors text-muted-foreground/50 group-hover:text-emerald-400" />
                <span>API Docs</span>
              </div>
              <ExternalLink className="size-3.5 text-white/20 group-hover:text-white/50 transition-colors" />
            </a>
          </nav>
        </div>
        
        <div className="p-4 mt-auto">
          <motion.div 
            whileHover={{ y: -2 }}
            className="flex items-center gap-3 p-4 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-xl group cursor-pointer relative overflow-hidden"
            onClick={() => setIsUserModalOpen(true)}
          >
            <div className="size-10 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-white/10 shadow-inner group-hover:shadow-primary/10 transition-all">
              <span className="text-xs font-black text-white">
                {(user.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-bold text-white truncate">{user.name}</span>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 opacity-60">
                <div className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                {user.role}
              </span>
            </div>
          </motion.div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="pl-72 w-full flex flex-col pr-4">
        <header className="flex h-20 items-center justify-between px-8 mt-4 rounded-3xl glass backdrop-blur-3xl border-0">
          <div className="flex items-center gap-4">
            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
              <div className="size-1.5 rounded-full bg-primary" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Workspace / {location.pathname === '/' ? 'Dashboard' : location.pathname.split('/')[1]}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-3 h-10 px-4 rounded-2xl bg-white/[0.03] border border-white/5 text-muted-foreground/40 hover:bg-white/5 hover:border-white/10 transition-all min-w-[280px]"
            >
              <Search className="size-4" />
              <span className="text-sm">Search</span>
              <div className="ml-auto flex items-center gap-1 opacity-40">
                <Command className="size-3" />
                <span className="text-[10px] font-bold">K</span>
              </div>
            </button>

            <div className="h-6 w-px bg-white/10 mx-1" />

            <button 
              className="size-10 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg hover:scale-105 transition-all relative group"
              onClick={() => setIsUserModalOpen(true)}
            >
              <span className="text-xs font-black">
                {(user.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </span>
            </button>
          </div>
        </header>

        <main className="flex-1 py-8 px-4 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4 bg-[#050508]/80 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-[#0F0F15] border border-white/10 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              <div className="flex items-center p-6 border-b border-white/5">
                <Search className="size-6 text-primary mr-4" />
                <input 
                  autoFocus
                  placeholder="What are you looking for?"
                  className="flex-1 bg-transparent border-none outline-none text-xl text-white placeholder:text-muted-foreground/30 font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Escape' && setIsSearchOpen(false)}
                />
                <button 
                  onClick={() => setIsSearchOpen(false)} 
                  className="size-10 rounded-2xl bg-white/[0.03] hover:bg-white/5 flex items-center justify-center text-muted-foreground transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>
              
              <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
                {!searchQuery ? (
                  <div className="grid grid-cols-2 gap-3 p-2">
                    {navigation.map(item => (
                      <Link 
                        key={item.name} 
                        to={item.href} 
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center gap-4 p-5 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-primary/20 hover:bg-primary/5 transition-all group"
                      >
                        <div className={cn("size-10 rounded-2xl bg-white/5 flex items-center justify-center transition-colors group-hover:bg-white/10", item.color)}>
                          <item.icon className="size-5" />
                        </div>
                        <span className="font-bold text-white uppercase tracking-widest text-[11px] group-hover:text-primary transition-colors">Go to {item.name}</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center space-y-4">
                    <div className="size-16 rounded-3xl bg-white/[0.02] flex items-center justify-center mx-auto text-muted-foreground/20">
                      <Search className="size-8" />
                    </div>
                    <p className="text-muted-foreground text-sm font-medium">No results found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
              
              <div className="p-5 bg-white/[0.01] border-t border-white/5 flex items-center justify-between text-[11px] text-muted-foreground font-black px-10">
                <div className="flex items-center gap-8 uppercase tracking-[0.2em] opacity-40">
                  <span className="flex items-center gap-2"><kbd className="bg-white/10 px-1.5 py-0.5 rounded-lg border border-white/5">ESC</kbd> CLOSE</span>
                  <span className="flex items-center gap-2"><kbd className="bg-white/10 px-1.5 py-0.5 rounded-lg border border-white/5">ENTER</kbd> SELECT</span>
                </div>
                <span className="uppercase tracking-[0.2em] text-primary opacity-60">TaskFlow Engine v1.0</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Details Modal */}
      <Dialog 
        isOpen={isUserModalOpen} 
        onClose={() => {
          setIsUserModalOpen(false);
          setIsEditingProfile(false);
        }} 
        title={isEditingProfile ? "Edit Account" : "User Profile"}
      >
        <AnimatePresence mode="wait">
          {isEditingProfile ? (
            <motion.form 
              key="edit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleUpdateProfile} 
              className="space-y-6 py-2"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Full Name</Label>
                  <Input 
                    value={editForm.name} 
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="rounded-2xl h-12 bg-white/[0.03] border-white/10"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Email Address</Label>
                  <Input 
                    type="email"
                    value={editForm.email} 
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="rounded-2xl h-12 bg-white/[0.03] border-white/10"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 h-12 rounded-2xl border-white/10"
                  onClick={() => setIsEditingProfile(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/20"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                  <Save className="size-4 ml-2" />
                </Button>
              </div>
            </motion.form>
          ) : (
            <motion.div 
              key="view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8 py-2"
            >
              <div className="flex items-center gap-6 p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 relative overflow-hidden group shadow-inner">
                <div className="size-24 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-2xl relative z-10 neon-glow-purple">
                  <span className="text-2xl font-black">
                    {(user.name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </span>
                </div>
                <div className="relative z-10 flex-1">
                  <h3 className="text-3xl font-black tracking-tighter text-white">{user.name}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="px-3 py-1 rounded-xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                      {user.role}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-emerald-500/80 text-[10px] font-bold uppercase tracking-widest">Active</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground/60 mb-1">
                    <Mail className="size-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Email</span>
                  </div>
                  <p className="text-sm font-bold text-white truncate">{user.email}</p>
                </div>
                <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground/60 mb-1">
                    <Shield className="size-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Status</span>
                  </div>
                  <p className="text-sm font-bold text-accent">Active User</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 px-2">Work Summary</h4>
                <div className="grid gap-2">
                  {[
                    { icon: FolderKanban, label: 'Active Projects', value: projectsCount },
                    { icon: Clock, label: 'Access Level', value: 'Unlimited' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.01] border border-transparent hover:border-white/5 hover:bg-white/[0.02] transition-all group">
                      <div className="flex items-center gap-4 text-muted-foreground group-hover:text-white transition-colors">
                        <item.icon className="size-5" />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      <span className="text-sm font-black text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-2 flex gap-4">
                <Button 
                  className="flex-1 h-14 rounded-2xl bg-white text-black hover:bg-white/90 font-black text-[11px] uppercase tracking-widest shadow-xl" 
                  onClick={() => setIsEditingProfile(true)}
                >
                  <Edit2 className="size-4 mr-2" />
                  Edit Profile
                </Button>
                <Button 
                  variant="outline" 
                  className="size-14 rounded-2xl border-white/10 hover:bg-destructive/10 hover:text-destructive group-hover:border-destructive/20 transition-all flex items-center justify-center p-0" 
                  onClick={logout}
                >
                  <LogOut className="size-5" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Dialog>
    </div>
  );
};

export default DashboardLayout;

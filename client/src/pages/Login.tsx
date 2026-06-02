import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../store/useAuthStore';
import api from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LayoutDashboard, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.post('/auth/login', data);
      // Backend returns { success: true, data: { ...user, token } }
      login(response.data.data);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#0A0A0F] relative overflow-hidden font-sans">
      {/* Background with Aurora effect */}
      <div className="absolute inset-0 aurora-bg opacity-40 pointer-events-none" />
      <div className="absolute top-[-20%] left-[-10%] size-[800px] rounded-full bg-primary/10 blur-[150px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] size-[800px] rounded-full bg-secondary/10 blur-[150px] animate-pulse pointer-events-none" />

      {/* Centered Auth Form */}
      <div className="w-full flex items-center justify-center p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[420px] glass-card p-10 space-y-8"
        >
          <div className="space-y-4 text-center">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <div className="size-10 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg neon-glow-purple">
                <LayoutDashboard className="size-6" />
              </div>
              <span className="text-2xl font-bold tracking-tighter text-white">TaskFlow</span>
            </motion.div>
            <h3 className="text-3xl font-bold tracking-tight text-white">Welcome back</h3>
            <p className="text-muted-foreground">Please enter your credentials to login</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 p-4 text-xs font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-2xl"
                >
                  <AlertCircle className="size-4 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-medium text-muted-foreground ml-1">Work Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@company.com" 
                    className="bg-white/[0.03] border-white/5 rounded-2xl h-12 pl-12 pr-6 text-sm focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
                    {...register('email')} 
                  />
                </div>
                {errors.email && <p className="text-[10px] font-medium text-destructive ml-1">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-medium text-muted-foreground ml-1">Security Code</Label>
                  <button type="button" className="text-[10px] uppercase font-bold tracking-widest text-primary hover:text-primary/80 transition-colors">Forgot?</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••"
                    className="bg-white/[0.03] border-white/5 rounded-2xl h-12 pl-12 pr-6 text-sm focus:ring-1 focus:ring-primary/50 transition-all shadow-inner"
                    {...register('password')} 
                  />
                </div>
                {errors.password && <p className="text-[10px] font-medium text-destructive ml-1">{errors.password.message}</p>}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:neon-glow-pink hover:scale-[1.01] transition-all font-bold text-sm tracking-wide relative group" 
              disabled={isLoading}
            >
              <span className={cn("transition-all flex items-center justify-center gap-2", isLoading ? "opacity-0" : "opacity-100")}>
                Sign in to Dashboard
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </span>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an operative account?{' '}
                <Link to="/register" className="text-white font-bold hover:text-primary transition-colors">
                  Join TaskFlow
                </Link>
              </p>
            </div>
            
            <p className="text-center text-[10px] font-medium text-muted-foreground opacity-30 mt-8 uppercase tracking-widest">
              © 2024 TaskFlow Technologies
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

import { create } from 'zustand';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MEMBER';
  token: string;
}

interface AuthState {
  user: User | null;
  login: (userData: User) => void;
  updateUser: (userData: Partial<User>) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => {
  const userInfo = localStorage.getItem('userInfo');
  let user = null;
  
  if (userInfo) {
    try {
      user = JSON.parse(userInfo);
    } catch (e) {
      console.error('Failed to parse user info', e);
    }
  }

  return {
    user,
    login: (userData) => {
      localStorage.setItem('userInfo', JSON.stringify(userData));
      set({ user: userData });
    },
    updateUser: (userData) => {
      set((state) => {
        const newUser = state.user ? { ...state.user, ...userData } : null;
        if (newUser) {
          localStorage.setItem('userInfo', JSON.stringify(newUser));
        }
        return { user: newUser };
      });
    },
    logout: () => {
      localStorage.removeItem('userInfo');
      set({ user: null });
    },
  };
});

export default useAuthStore;

import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Building2, Lock, User, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, ingresa tu correo y contraseña.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (!supabase) {
        throw new Error('El cliente de Supabase no está inicializado.');
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      onLoginSuccess();
    } catch (err: any) {
      console.error('Error de autenticación:', err);
      if (err.message === 'Invalid login credentials') {
        setError('Credenciales inválidas. Por favor, verifica tu correo y contraseña.');
      } else {
        setError(err.message || 'Ocurrió un error inesperado al iniciar sesión.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-[#0c4a6e] to-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-slate-200/50">
        <div>
          <div className="flex justify-center">
            {/* Logotipo cooperativo estilizado */}
            <div className="h-14 w-14 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-[#0284c7] shadow-inner">
              <Building2 className="w-7 h-7" />
            </div>
          </div>
          <h2 className="mt-4 text-center text-2xl font-black text-slate-900 tracking-tight">
            COOPAC SEGUIMIENTO
          </h2>
          <p className="mt-1 text-center text-xs text-slate-500 font-semibold uppercase tracking-wider">
            Portal Ejecutivo de Proyectos
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg flex gap-2.5 items-start">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-red-700">{error}</p>
            </div>
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-lg relative block w-full pl-9 pr-3 py-2 border border-slate-200 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm bg-slate-50/50 focus:bg-white transition-all"
                  placeholder="usuario@cooperativa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                Contraseña
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-lg relative block w-full pl-9 pr-3 py-2 border border-slate-200 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm bg-slate-50/50 focus:bg-white transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-xs font-bold uppercase tracking-wider rounded-lg text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all cursor-pointer ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verificando credenciales...
                </span>
              ) : (
                'Ingresar al Sistema'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


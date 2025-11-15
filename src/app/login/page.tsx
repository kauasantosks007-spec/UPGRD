'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { LogIn, UserPlus, Loader2, Sun, Moon, Zap } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Cadastro
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');

  // Marcar como montado
  useEffect(() => {
    setMounted(true);
    document.documentElement.classList.add('dark');
  }, []);

  // Aplicar tema quando mudar
  useEffect(() => {
    if (!mounted) return;
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark, mounted]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) throw error;

      if (data.session) {
        setMessage({ type: 'success', text: 'Login realizado com sucesso!' });
        // Usar router.push e router.refresh para garantir atualização
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erro ao fazer login' });
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            name: signupName,
          },
          emailRedirectTo: undefined,
        },
      });

      if (error) throw error;

      if (data.user && data.session) {
        setMessage({ 
          type: 'success', 
          text: 'Conta criada com sucesso! Redirecionando...' 
        });
        
        // Usar router.push e router.refresh para garantir atualização
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erro ao criar conta' });
      setLoading(false);
    }
  };

  // Evitar hydration mismatch - renderizar apenas após montar
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      {/* Particles background - renderizado apenas no cliente */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              width: '3px',
              height: '3px',
              left: `${(i * 5) % 100}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: '6s',
            }}
          />
        ))}
      </div>

      {/* Background com logo e grid gamer */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(${isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)'} 1px, transparent 1px),
            linear-gradient(90deg, ${isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)'} 1px, transparent 1px),
            url(https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/26f85632-6e8d-4121-8bec-4e82aeeea111.png)
          `,
          backgroundSize: '50px 50px, 50px 50px, contain',
          backgroundPosition: '0 0, 0 0, center',
          backgroundRepeat: 'repeat, repeat, no-repeat',
          opacity: isDark ? 0.15 : 0.08,
        }}
      />
      
      {/* Overlay gradient gamer */}
      <div 
        className={`absolute inset-0 z-0 transition-all duration-500 ${
          isDark 
            ? 'bg-gradient-to-br from-purple-950 via-gray-900 to-blue-950' 
            : 'bg-gradient-to-br from-purple-100 via-white to-blue-100'
        }`}
      />

      {/* Glow effects */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Theme toggle button */}
      <Button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full neon-glow transition-all duration-300 hover:scale-110"
        variant="outline"
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </Button>

      {/* Card de login/cadastro */}
      <Card className={`w-full max-w-md shadow-2xl relative z-10 backdrop-blur-md border-2 transition-all duration-500 ${
        isDark 
          ? 'bg-gray-900/80 border-purple-500/50 neon-glow' 
          : 'bg-white/90 border-purple-300'
      }`}>
        <CardHeader className="space-y-4">
          {/* Logo no header com efeito neon */}
          <div className="flex justify-center">
            <div className="relative w-28 h-28 animate-pulse-neon">
              <Image
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/26f85632-6e8d-4121-8bec-4e82aeeea111.png"
                alt="UPGRD Logo"
                fill
                className="object-contain drop-shadow-[0_0_15px_rgba(139,92,246,0.8)]"
                priority
              />
            </div>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Zap className="w-6 h-6 text-purple-500 animate-pulse" />
            <CardTitle className={`text-4xl font-black text-center tracking-wider neon-text ${
              isDark ? 'text-purple-400' : 'text-purple-600'
            }`}>
              UPGRD
            </CardTitle>
            <Zap className="w-6 h-6 text-purple-500 animate-pulse" />
          </div>
          <CardDescription className={`text-center font-semibold ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            🎮 Entre ou crie sua conta para começar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className={`grid w-full grid-cols-2 ${
              isDark ? 'bg-gray-800/50' : 'bg-gray-100'
            }`}>
              <TabsTrigger 
                value="login"
                className={`font-bold transition-all ${
                  isDark 
                    ? 'data-[state=active]:bg-purple-600 data-[state=active]:text-white' 
                    : 'data-[state=active]:bg-purple-500 data-[state=active]:text-white'
                }`}
              >
                LOGIN
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className={`font-bold transition-all ${
                  isDark 
                    ? 'data-[state=active]:bg-purple-600 data-[state=active]:text-white' 
                    : 'data-[state=active]:bg-purple-500 data-[state=active]:text-white'
                }`}
              >
                CADASTRO
              </TabsTrigger>
            </TabsList>

            {/* Tab Login */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="font-bold uppercase text-xs tracking-wider">
                    Email
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    disabled={loading}
                    className={`border-2 transition-all focus:scale-[1.02] ${
                      isDark 
                        ? 'bg-gray-800/50 border-purple-500/30 focus:border-purple-500' 
                        : 'bg-white border-purple-300 focus:border-purple-500'
                    }`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="font-bold uppercase text-xs tracking-wider">
                    Senha
                  </Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    disabled={loading}
                    className={`border-2 transition-all focus:scale-[1.02] ${
                      isDark 
                        ? 'bg-gray-800/50 border-purple-500/30 focus:border-purple-500' 
                        : 'bg-white border-purple-300 focus:border-purple-500'
                    }`}
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full font-bold uppercase tracking-wider bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all hover:scale-105 neon-glow" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Entrar
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Tab Cadastro */}
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="font-bold uppercase text-xs tracking-wider">
                    Nome
                  </Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Seu nome"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                    disabled={loading}
                    className={`border-2 transition-all focus:scale-[1.02] ${
                      isDark 
                        ? 'bg-gray-800/50 border-purple-500/30 focus:border-purple-500' 
                        : 'bg-white border-purple-300 focus:border-purple-500'
                    }`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="font-bold uppercase text-xs tracking-wider">
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    disabled={loading}
                    className={`border-2 transition-all focus:scale-[1.02] ${
                      isDark 
                        ? 'bg-gray-800/50 border-purple-500/30 focus:border-purple-500' 
                        : 'bg-white border-purple-300 focus:border-purple-500'
                    }`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="font-bold uppercase text-xs tracking-wider">
                    Senha
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    disabled={loading}
                    minLength={6}
                    className={`border-2 transition-all focus:scale-[1.02] ${
                      isDark 
                        ? 'bg-gray-800/50 border-purple-500/30 focus:border-purple-500' 
                        : 'bg-white border-purple-300 focus:border-purple-500'
                    }`}
                  />
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Mínimo 6 caracteres
                  </p>
                </div>
                <Button 
                  type="submit" 
                  className="w-full font-bold uppercase tracking-wider bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all hover:scale-105 neon-glow" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando conta...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Criar conta
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Mensagens de feedback */}
          {message && (
            <div
              className={`mt-4 p-3 rounded-lg text-sm font-semibold border-2 transition-all ${
                message.type === 'success'
                  ? isDark 
                    ? 'bg-green-900/50 text-green-300 border-green-500/50' 
                    : 'bg-green-50 text-green-800 border-green-300'
                  : isDark
                    ? 'bg-red-900/50 text-red-300 border-red-500/50'
                    : 'bg-red-50 text-red-800 border-red-300'
              }`}
            >
              {message.text}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="link"
            onClick={() => router.push('/')}
            className={`text-sm font-semibold ${
              isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'
            }`}
          >
            ← Voltar para home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

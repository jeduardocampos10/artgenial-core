import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from 'lucide-react';
import saoPauloBg from '@/assets/sao-paulo-bg.jpg';

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${saoPauloBg})` }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-login-overlay" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="card-elevated p-8 animate-fade-in">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center mb-4 shadow-lg">
              <Building2 className="w-9 h-9 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">CNPJ Master</h1>
            <p className="text-sm text-muted-foreground mt-1">Geração de Leads B2B Inteligente</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                E-mail
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-corporate pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-corporate pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                type="button" 
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Esqueci minha senha
              </button>
            </div>

            <Button 
              type="submit" 
              className="w-full btn-corporate h-12 text-base"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Entrar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-3 text-xs text-muted-foreground">
                Novo no CNPJ Master?
              </span>
            </div>
          </div>

          {/* Create Account */}
          <Button 
            variant="outline" 
            className="w-full btn-corporate-outline h-11"
            type="button"
          >
            Criar Conta Grátis
          </Button>

          {/* Social Proof */}
          <div className="mt-8 pt-6 border-t border-border flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 text-success" />
            <span>Mais de <strong className="text-foreground">1 milhão</strong> de empresas auditadas</span>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-6 text-center text-xs text-white/70 space-x-4">
          <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
          <span>•</span>
          <a href="#" className="hover:text-white transition-colors">Privacidade</a>
          <span>•</span>
          <a href="#" className="hover:text-white transition-colors">Suporte</a>
        </div>
      </div>
    </div>
  );
}

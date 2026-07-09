'use client'

import { useActionState, useState } from 'react';
import { loginUser } from '@/app/actions/auth-actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { InputGroup, InputGroupInput, InputGroupButton } from '@/components/ui/input-group';

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginUser, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 w-full">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-extrabold tracking-tight text-center">
            Hefestus<span className="text-primary">.</span>
          </CardTitle>
          <CardDescription className="text-center">
            Forje a sua carreira. Faça login para acessar suas vagas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nome@exemplo.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <InputGroup>
                <InputGroupInput
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                />
                <InputGroupButton
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </InputGroupButton>
              </InputGroup>
            </div>
            
            {state?.error && (
              <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium">
                {state.error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Não tem uma conta?{' '}
            <Link href="/cadastro" className="font-semibold text-primary underline-offset-4 hover:underline">
              Cadastre-se
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

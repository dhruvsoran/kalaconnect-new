'use client';

import { useState, Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KalaConnectIcon } from '@/components/icons';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { FadeIn } from '@/components/motion-wrapper';
import { validatePassword } from '@/lib/password-validation';
import { cn } from '@/lib/utils';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<'buyer' | 'artisan'>(
    (searchParams.get('role') as any) || 'buyer'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);

  const passwordValidation = useMemo(() => validatePassword(password), [password]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: fullName, role }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      const { token, user } = json;
      if (typeof window !== 'undefined' && token) {
        localStorage.setItem('token', token);
        localStorage.setItem('isLoggedIn', 'true');
        if (user?.role) localStorage.setItem('userRole', user.role);
        if (user?.id) localStorage.setItem('userId', user.id);
        window.dispatchEvent(new Event('auth-change'));
      }

      toast({
        title: "Account created!",
        description: `Welcome to कलाConnect, ${fullName}!`,
      });

      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "An error occurred during sign up.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-float-slow" />
      </div>
      <FadeIn direction="up" className="w-full">
        <Card className="mx-auto max-w-sm w-full shadow-2xl">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
                <KalaConnectIcon className="h-8 w-8 text-primary" />
                <span className="font-headline">कलाConnect</span>
              </Link>
            </div>
            <CardTitle className="text-2xl font-headline">Join Community</CardTitle>
            <CardDescription>
              Register to begin your artistic journey.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="grid gap-4">
              <div className="grid gap-2">
                <Label>I want to join as a...</Label>
                <RadioGroup value={role} onValueChange={(val) => setRole(val as any)} className="grid grid-cols-2 gap-4">
                  <div>
                    <RadioGroupItem value="buyer" id="buyer" className="peer sr-only" />
                    <Label
                      htmlFor="buyer"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary w-full text-center cursor-pointer transition-all font-headline"
                    >
                      Buyer
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="artisan" id="artisan" className="peer sr-only" />
                    <Label
                      htmlFor="artisan"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary w-full text-center cursor-pointer transition-all font-headline"
                    >
                      Artisan
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" placeholder="Your Name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  minLength={8}
                />
                {passwordFocused && password.length > 0 && (
                  <div className="space-y-2 mt-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={cn(
                            "h-1 flex-1 rounded-full transition-colors",
                            i <= passwordValidation.score
                              ? passwordValidation.strength === 'strong'
                                ? "bg-green-500"
                                : passwordValidation.strength === 'good'
                                ? "bg-emerald-500"
                                : passwordValidation.strength === 'fair'
                                ? "bg-amber-500"
                                : "bg-red-500"
                              : "bg-muted"
                          )}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {passwordValidation.strength === 'strong' && "Strong password"}
                      {passwordValidation.strength === 'good' && "Good — add a special character for strong"}
                      {passwordValidation.strength === 'fair' && "Fair — add more character types"}
                      {passwordValidation.strength === 'weak' && "Weak — needs more requirements"}
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {[
                        { label: '8+ characters', met: password.length >= 8 },
                        { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
                        { label: 'Lowercase letter', met: /[a-z]/.test(password) },
                        { label: 'Number', met: /[0-9]/.test(password) },
                        { label: 'Special character', met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
                      ].map((req) => (
                        <div key={req.label} className="flex items-center gap-1 text-xs">
                          {req.met ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <X className="h-3 w-3 text-muted-foreground" />
                          )}
                          <span className={req.met ? "text-green-500" : "text-muted-foreground"}>
                            {req.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button type="submit" className="w-full" disabled={isLoading || (password.length > 0 && !passwordValidation.valid)}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
                </Button>
              </motion.div>
            </form>
            <div className="mt-4 text-center text-sm">
              Already a member?{" "}
              <Link href="/login" className="underline font-bold">
                Log In
              </Link>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen font-headline">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}

'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KalaConnectIcon } from '@/components/icons';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldAlert, Info } from 'lucide-react';
import { useFirebase } from '@/firebase';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { auth, firestore } = useFirebase();
  
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<'buyer' | 'artisan'>(
    (searchParams.get('role') as any) || 'buyer'
  );
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [apiError, setApiError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (!auth || !firestore) return;

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Master Admin Credential Check for Dhruv
      let assignedRole = role as string;
      if (fullName.trim() === 'Dhruv' && password === '199999') {
          assignedRole = 'admin';
          toast({
            title: "Admin Access Granted",
            description: "Welcome, Dhruv. You have master control over the platform.",
          });
      }

      await setDoc(doc(firestore, 'users', user.uid), {
        name: fullName,
        email: email,
        role: assignedRole,
        location: '',
        story: '',
        heritage: '',
        avatar: '',
        followingCount: 0,
        followersCount: 0
      });

      toast({
        title: "Account created!",
        description: `Welcome to कलाConnect, ${fullName}!`,
      });
      
      if (assignedRole === 'admin') {
          router.push('/admin');
      } else {
          router.push('/dashboard');
      }
    } catch (error: any) {
      if (error.message.includes('identitytoolkit-method')) {
        setApiError("Identity Toolkit API is restricted. Please unrestrict it in Google Cloud Console.");
      }
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
      <Card className="mx-auto max-w-sm w-full shadow-2xl animate-pop-in">
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
            {apiError && (
              <Alert variant="destructive">
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>API Blocked</AlertTitle>
                <AlertDescription>
                  {apiError}
                </AlertDescription>
              </Alert>
            )}
            
            <Alert className="bg-primary/5 border-primary/20">
              <Info className="h-4 w-4 text-primary" />
              <AlertDescription className="text-xs">
                To set up your <strong>Admin</strong> account, enter your secret Name and Password alongside any valid email.
              </AlertDescription>
            </Alert>

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
              <Input id="email" type="email" placeholder="dhruv@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Secure Account"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already a member?{" "}
            <Link href="/login" className="underline font-bold">
              Log In
            </Link>
          </div>
        </CardContent>
      </Card>
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

'use client';

import { useEffect, useState, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Upload, Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useUser } from "@/auth";
import { useRouter } from "next/navigation";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email(),
  location: z.string().optional(),
  story: z.string().optional(),
  heritage: z.string().optional(),
  avatar: z.string().optional(),
});

type ProfileValues = z.infer<typeof profileSchema>;

type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  location?: string;
  story?: string;
  heritage?: string;
  avatar?: string;
};

export default function ProfilePage() {
  const { toast } = useToast();
  const { user, loading: authLoading } = useUser();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
  });

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const res = await fetch('/api/auth/me', { headers });
      const json = await res.json();
      if (!json.user) {
        if (token) localStorage.removeItem('token');
        localStorage.removeItem('isLoggedIn');
        window.dispatchEvent(new Event('auth-change'));
        router.push('/login');
        return;
      }
      const profileData = json.user as UserProfile;
      setProfile(profileData);
      form.reset({
        name: profileData.name || "",
        email: profileData.email || "",
        location: profileData.location || "",
        story: profileData.story || "",
        heritage: profileData.heritage || "",
        avatar: profileData.avatar || "",
      });
    } catch (e) {
      console.error('Failed to load profile', e);
    } finally {
      setLoading(false);
    }
  }, [router, form]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue("avatar", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async (values: ProfileValues) => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      // Update user document via API
      const res = await fetch(`/api/db/users/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: values.name,
          location: values.location,
          story: values.story,
          heritage: values.heritage,
          avatar: values.avatar,
        }),
      });
      const json = await res.json();
      if (json.ok || json.ok === undefined) {
        setProfile(prev => prev ? { ...prev, ...values } : null);
        toast({
          title: "Profile Saved!",
          description: "Your information has been updated successfully.",
        });
      } else {
        throw new Error(json.error || 'Failed to save');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: error.message || "Could not save your profile.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || loading) {
    return <ProfileSkeleton />;
  }

  if (!user || !profile) {
    return <div className="p-8 text-center">User not found. Please log in again.</div>;
  }

  const isArtisan = profile.role === 'artisan';

  return (
    <div className="grid gap-6 animate-fade-in-up">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">
          {isArtisan ? "Artisan Profile" : "Account Settings"}
        </h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSaveChanges)} className="grid gap-6">
          <Card className="shadow-lg border-none">
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>
                {isArtisan ? "Upload a photo that represents your craft." : "Upload a profile photo."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 ring-4 ring-primary/20">
                  <AvatarImage src={form.watch('avatar')} alt={profile.name} />
                  <AvatarFallback>{profile.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Photo
                </Button>
                <Input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-none">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} disabled /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="location" render={({ field }) => (
                <FormItem><FormLabel>Location</FormLabel><FormControl><Input {...field} placeholder="City, State" /></FormControl><FormMessage /></FormItem>
              )} />
              {isArtisan && (
                <>
                  <FormField control={form.control} name="story" render={({ field }) => (
                    <FormItem><FormLabel>Your Story / Bio</FormLabel><FormControl><Textarea className="min-h-32" {...field} placeholder="Tell buyers about yourself and your craft..." /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="heritage" render={({ field }) => (
                    <FormItem><FormLabel>Cultural Heritage</FormLabel><FormControl><Textarea className="min-h-24" {...field} placeholder="Describe your artistic heritage..." /></FormControl><FormMessage /></FormItem>
                  )} />
                </>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving} className="min-w-[120px]">
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="grid gap-6">
      <Skeleton className="h-8 w-48" />
      <Card><CardContent className="p-6"><Skeleton className="h-24 w-24 rounded-full" /></CardContent></Card>
      <Card><CardContent className="p-6 space-y-4"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /><Skeleton className="h-32 w-full" /></CardContent></Card>
    </div>
  );
}

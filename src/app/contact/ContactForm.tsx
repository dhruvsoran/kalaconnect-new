'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { KalaConnectIcon } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Phone, MapPin } from 'lucide-react';

export default function ContactForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/db/contactMessages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });
      if (!res.ok) throw new Error('Failed to send message');
      toast({ title: 'Message sent!', description: 'We will get back to you soon.' });
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to send message. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Link href="/" className="flex items-center justify-center gap-2 font-bold text-2xl mb-6">
            <KalaConnectIcon className="h-10 w-10 text-primary" />
            <span className="font-headline">कलाConnect</span>
          </Link>
          <h1 className="text-4xl font-headline font-bold mb-4">Contact Us</h1>
          <p className="text-lg text-muted-foreground">
            Have a question? We&apos;re here to help.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Mail className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-1">Email</h3>
              <p className="text-sm text-muted-foreground">support@kalaconnect.me</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Phone className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-1">Phone</h3>
              <p className="text-sm text-muted-foreground">+91 7818093944</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <MapPin className="h-8 w-8 text-primary mx-auto mb-3" />
              <h3 className="font-bold mb-1">Address</h3>
              <p className="text-sm text-muted-foreground">Meerut, Uttar Pradesh, India</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Send a Message</CardTitle>
            <CardDescription>Fill out the form below and we&apos;ll get back to you.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" required value={subject} onChange={(e) => setSubject(e.target.value)} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

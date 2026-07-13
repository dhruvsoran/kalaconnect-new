'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2 } from 'lucide-react';
import { FadeIn } from '@/components/motion-wrapper';
import { useState } from 'react';

export function ContactSection() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitting(true);
    setContactSuccess(false);
    try {
      const res = await fetch('/api/db/contactMessages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });
      if (res.ok) {
        setContactSuccess(true);
        setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch (e) {
      console.error('Failed to send message', e);
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <section className="py-16 md:py-24 bg-card/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <FadeIn direction="left">
            <Badge variant="outline" className="mb-4">Get In Touch</Badge>
            <h2 className="text-3xl md:text-4xl font-bold font-headline mb-6">
              Connect With Us
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Have a question, suggestion, or want to collaborate? We&apos;d love to hear from you.
              Whether you&apos;re an artisan looking to join, a buyer with feedback, or a partner with ideas — drop us a message.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email us at</p>
                  <p className="font-medium">support@kalaconnect.me</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Call us at</p>
                  <p className="font-medium">+91 7818093944</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Visit us at</p>
                  <p className="font-medium">Meerut, Uttar Pradesh, India</p>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn direction="right">
            <Card>
              <CardContent className="p-6">
                {contactSuccess ? (
                  <div className="text-center py-12">
                    <div className="inline-flex p-4 rounded-full bg-green-500/10 mb-4">
                      <CheckCircle className="h-10 w-10 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold font-headline mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground mb-6">
                      Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                    </p>
                    <Button variant="outline" onClick={() => setContactSuccess(false)}>
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Name *</label>
                        <Input
                          placeholder="Your name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Email *</label>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Phone</label>
                        <Input
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Subject *</label>
                        <Input
                          placeholder="How can we help?"
                          value={contactForm.subject}
                          onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Message *</label>
                      <Textarea
                        placeholder="Tell us what's on your mind..."
                        className="min-h-[120px]"
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={contactSubmitting}>
                      {contactSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

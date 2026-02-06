
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  User,
  Stethoscope,
  Shield,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

export default function LoginPage() {
  const router = useRouter();
const { reloadUser } = useAuth();

  const [userType, setUserType] = useState('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const endpoint =
      userType === 'doctor'
        ? '/api/auth/doctor-login'
        : '/api/auth/login';

    const payload =
      userType === 'doctor'
        ? { email, password }
        : { email, password, role: userType };

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Login failed');
      return;
    }

    // await reloadUser();

    // const role = userType === 'doctor' ? 'doctor' : data.role;
    // router.push(`/dashboard/${role}`);
    await reloadUser();

const role = userType === 'doctor' ? 'doctor' : data.role;

// 🔑 force full navigation so middleware can read the cookie
window.location.href = `/dashboard/${role}`;

  } catch (err) {
    setError('Something went wrong. Try again.');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-hospital-teal-light via-background to-hospital-blue-light flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background glow */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">

        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        {/* Card */}
        <div className="bg-card rounded-2xl shadow-xl border border-border/50 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-emerald-400 p-6 text-center text-white">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white/20 flex items-center justify-center mb-4">
              <span className="font-bold text-2xl">SK</span>
            </div>
            <h1 className="text-xl font-semibold">
              Sheikh Khalifa Hospital
            </h1>
            <p className="text-white/70 text-sm mt-1">
              Fujairah
            </p>
          </div>

          {/* Form */}
          <div className="p-6">
            <Tabs value={userType} onValueChange={setUserType}>

              {/* Role Tabs */}
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="patient" className="flex gap-2 text-xs sm:text-sm">
                  <User className="w-4 h-4" /> Patient
                </TabsTrigger>
                <TabsTrigger value="doctor" className="flex gap-2 text-xs sm:text-sm">
                  <Stethoscope className="w-4 h-4" /> Doctor
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex gap-2 text-xs sm:text-sm">
                  <Shield className="w-4 h-4" /> Admin
                </TabsTrigger>
              </TabsList>

              {/* Forms */}
              {['patient', 'doctor', 'admin'].map((type) => (
                <TabsContent key={type} value={type}>
                  <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="h-12"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Password</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="h-12 pr-12"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Error */}
                    {error && (
                      <p className="text-sm text-red-500 font-medium">
                        {error}
                      </p>
                    )}

                    {/* MFA Notice */}
                    {(type === 'doctor' || type === 'admin') && (
                      <div className="p-3 bg-accent/10 rounded-lg border border-accent/20 text-xs">
                        🔐 Multi-factor authentication required after login
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full h-12"
                      variant="hero"
                      disabled={loading}
                    >
                      {loading ? 'Signing in…' : 'Sign In'}
                    </Button>

                    {type === 'patient' && (
                      <div className="text-center pt-3">
                        <Link
                          href="/register"
                          className="inline-block text-sm font-medium text-primary hover:underline"
                        >
                          New patient? Create your account
                        </Link>
                      </div>
                    )}

                  </form>
                </TabsContent>
              ))}
            </Tabs>

            {/* Forgot */}
            <div className="mt-4 text-center">
              <button className="text-sm text-primary hover:underline">
                Forgot your password?
              </button>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-xs text-muted-foreground text-center mt-6 max-w-sm mx-auto">
          Your data is encrypted and protected. We follow healthcare data protection standards.
        </p>
      </div>
    </div>
  );
}

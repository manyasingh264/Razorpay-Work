import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { ROUTES } from '../constants/routes';
import { errorToast } from '../utils/toast';
import { IoPersonAddOutline } from 'react-icons/io5';

export default function Register({ auth }) {
  const navigate = useNavigate();
  const { register, loading } = auth;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return errorToast('Please fill in all fields');
    }
    if (!email.endsWith('@org.com')) {
      return errorToast('Email must belong to the @org.com domain');
    }
    if (password.length < 8) {
      return errorToast('Password must be at least 8 characters');
    }
    try {
      await register(name, email, password);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      // Handled by register hook
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#0b0f19] via-[#111827] to-[#0b0f19]">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header Logo */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600/10 rounded-2xl border border-blue-500/20 text-blue-500 mb-4">
            <IoPersonAddOutline className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">RAZORPAY REIMBURSE</h1>
          <p className="text-gray-400 mt-2">Create a new Employee account</p>
        </div>

        {/* Register Card */}
        <Card className="border-gray-800 bg-gray-900/60 backdrop-blur-md">
          <CardHeader>
            <CardTitle>Register Account</CardTitle>
            <CardDescription>Self-service onboarding for employees</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Full Name</label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</label>
                <Input
                  type="email"
                  placeholder="john.doe@org.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
                <span className="text-[10px] text-gray-500 block mt-1">Must use the @org.com domain</span>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
                <Input
                  type="password"
                  placeholder="•••••••• (Min 8 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating account...' : 'Register'}
              </Button>
              <div className="text-sm text-gray-400 text-center">
                Already have an account?{' '}
                <Link to={ROUTES.LOGIN} className="text-blue-400 hover:text-blue-300 font-semibold">
                  Sign In
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

      </div>
    </div>
  );
}

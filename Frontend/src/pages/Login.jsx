import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { ROUTES } from '../constants/routes';
import { errorToast, successToast } from '../utils/toast';
import { IoShieldCheckmark, IoPerson, IoBriefcase, IoKey } from 'react-icons/io5';
import api from '../api/axiosInstance';
import { API_ENDPOINTS } from '../api/endpoints';

export default function Login({ auth }) {
  const navigate = useNavigate();
  const { login, loading } = auth;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return errorToast('Please fill in all fields');
    }
    if (!email.endsWith('@org.com')) {
      return errorToast('Email must belong to the @org.com domain');
    }
    try {
      await login(email, password);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      // Error handled by hook toast
    }
  };

  const handleQuickLogin = async (presetEmail, presetPassword) => {
    try {
      await login(presetEmail, presetPassword);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      // If the preset account doesn't exist, we try to register it first (except for CFO which is seeded)
      if (presetEmail !== 'cfo@org.com') {
        const prefix = presetEmail.split('@')[0];
        const name = prefix.toUpperCase() + ' User';
        try {
          // Register
          await api.post(API_ENDPOINTS.REGISTER, {
            name,
            email: presetEmail,
            password: presetPassword
          });
          // Then login
          await login(presetEmail, presetPassword);
          navigate(ROUTES.DASHBOARD);
        } catch (regErr) {
          errorToast('Failed to auto-provision account: ' + (regErr?.response?.data?.message || regErr.message));
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#0b0f19] via-[#111827] to-[#0b0f19]">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header Logo */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600/10 rounded-2xl border border-blue-500/20 text-blue-500 mb-4">
            <IoShieldCheckmark className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">RAZORPAY REIMBURSE</h1>
          <p className="text-gray-400 mt-2">Role-Based Access Control Console</p>
        </div>

        {/* Login Card */}
        <Card className="border-gray-800 bg-gray-900/60 backdrop-blur-md">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access the portal</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</label>
                <Input
                  type="email"
                  placeholder="name@org.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
              <div className="text-sm text-gray-400 text-center">
                Need an employee account?{' '}
                <Link to={ROUTES.REGISTER} className="text-blue-400 hover:text-blue-300 font-semibold">
                  Register here
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Demo Presets Panel */}
        <Card className="border-blue-500/20 bg-blue-950/10 backdrop-blur-xs">
          <CardHeader className="py-4">
            <CardTitle className="text-base text-blue-400 flex items-center gap-2">
              <IoKey className="h-4 w-4" /> Tester Presets
            </CardTitle>
            <CardDescription className="text-xs text-blue-300/70">
              One-click quick login or auto-provision accounts for sandbox testing.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2 pt-0 pb-4">
            <Button
              variant="outline"
              size="sm"
              className="justify-start gap-2 border-blue-500/20 text-blue-300 hover:bg-blue-950/40 text-xs py-5"
              onClick={() => handleQuickLogin('cfo@org.com', 'CFO#ORG@April2026')}
              disabled={loading}
            >
              <IoShieldCheckmark className="text-red-400 shrink-0 h-4 w-4" />
              <div className="text-left leading-tight">
                <p className="font-semibold text-white">CFO (Root)</p>
                <p className="text-[10px] text-gray-400">cfo@org.com</p>
              </div>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="justify-start gap-2 border-gray-800 text-gray-300 hover:bg-gray-800/40 text-xs py-5"
              onClick={() => handleQuickLogin('emp1@org.com', 'Password123')}
              disabled={loading}
            >
              <IoPerson className="text-green-400 shrink-0 h-4 w-4" />
              <div className="text-left leading-tight">
                <p className="font-semibold text-white">Employee</p>
                <p className="text-[10px] text-gray-400">emp1@org.com</p>
              </div>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="justify-start gap-2 border-gray-800 text-gray-300 hover:bg-gray-800/40 text-xs py-5"
              onClick={() => handleQuickLogin('rm1@org.com', 'Password123')}
              disabled={loading}
            >
              <IoBriefcase className="text-yellow-400 shrink-0 h-4 w-4" />
              <div className="text-left leading-tight">
                <p className="font-semibold text-white">Manager (RM)</p>
                <p className="text-[10px] text-gray-400">rm1@org.com</p>
              </div>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="justify-start gap-2 border-gray-800 text-gray-300 hover:bg-gray-800/40 text-xs py-5"
              onClick={() => handleQuickLogin('ape1@org.com', 'Password123')}
              disabled={loading}
            >
              <IoShieldCheckmark className="text-purple-400 shrink-0 h-4 w-4" />
              <div className="text-left leading-tight">
                <p className="font-semibold text-white">AP Exec (APE)</p>
                <p className="text-[10px] text-gray-400">ape1@org.com</p>
              </div>
            </Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

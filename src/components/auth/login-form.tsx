"use client";

import { useState } from "react";
import { useLogin } from "@/lib/hooks/useTrpcAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ email, password });
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-background'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Login to ClubStack</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            {login.error && (
              <Alert variant='destructive'>
                <AlertDescription>
                  Login failed. Please check your credentials and try again.
                </AlertDescription>
              </Alert>
            )}

            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={login.isPending}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                placeholder='Enter your password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={login.isPending}
              />
            </div>
            <Button type='submit' className='w-full' disabled={login.isPending}>
              {login.isPending && (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              )}
              Sign In
            </Button>
          </form>
          <div className='mt-4 text-center text-sm'>
            Don&apos;t have an account?{" "}
            <a href='/register' className='text-primary hover:underline'>
              Register here
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

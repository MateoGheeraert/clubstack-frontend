"use client";

import { useState } from "react";
import { useRegister } from "@/lib/hooks/auth";
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

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const register = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register.mutate({ email, password });
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-background'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Register for ClubStack</CardTitle>
          <CardDescription>Create your account to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            {register.error && (
              <Alert variant='destructive'>
                <AlertDescription>
                  Registration failed. Please check your information and try
                  again.
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
                disabled={register.isPending}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                placeholder='Create a password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={register.isPending}
                minLength={6}
              />
            </div>
            <Button
              type='submit'
              className='w-full'
              disabled={register.isPending}
            >
              {register.isPending && (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              )}
              Register
            </Button>
          </form>
          <div className='mt-4 text-center text-sm'>
            Already have an account?{" "}
            <a href='/login' className='text-primary hover:underline'>
              Sign in here
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

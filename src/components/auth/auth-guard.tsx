"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { tokenUtils } from "@/lib/auth";

function checkAuth(): boolean {
  const token = tokenUtils.getToken();
  
  if (!token) {
    return false;
  }

  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return false;
    }
    
    const payload = JSON.parse(atob(parts[1]));
    
    if (payload.exp) {
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      
      if (currentTime >= expirationTime) {
        // Token expired
        tokenUtils.removeToken();
        tokenUtils.removeRefreshToken();
        return false;
      }
    }
    
    return true;
  } catch {
    // Invalid token
    tokenUtils.removeToken();
    tokenUtils.removeRefreshToken();
    return false;
  }
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // Check auth immediately on component creation (synchronously)
  const [isAuthenticated] = useState<boolean>(() => checkAuth());

  useEffect(() => {
    // If not authenticated, redirect immediately
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

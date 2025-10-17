"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyOrganizations } from "@/lib/hooks";
import { Plus, Building2, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function OrganizationsPage() {
  const { data: organizations, isLoading } = useMyOrganizations();

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Organizations</h1>
          <p className='text-muted-foreground'>
            Manage your organizations and memberships
          </p>
        </div>
        <Button>
          <Plus className='mr-2 h-4 w-4' />
          New Organization
        </Button>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {isLoading ? (
          // Loading state
          [...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className='h-6 w-32' />
                <Skeleton className='h-4 w-48' />
              </CardHeader>
              <CardContent>
                <Skeleton className='h-4 w-24 mb-2' />
                <Skeleton className='h-4 w-20' />
              </CardContent>
            </Card>
          ))
        ) : organizations && organizations.length > 0 ? (
          // Organizations list
          organizations.map((org) => (
            <Card key={org.id} className='hover:shadow-md transition-shadow'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <Building2 className='h-6 w-6 text-muted-foreground' />
                  <Badge variant='outline'>Member</Badge>
                </div>
                <CardTitle>{org.name}</CardTitle>
                <CardDescription>
                  {org.description || "No description available"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex items-center justify-between text-sm'>
                  <div className='flex items-center text-muted-foreground'>
                    <Users className='mr-1 h-4 w-4' />
                    <span>Team member</span>
                  </div>
                  <span className='text-muted-foreground'>
                    Joined{" "}
                    {formatDistanceToNow(new Date(org.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <div className='mt-4 flex space-x-2'>
                  <Button variant='outline' size='sm'>
                    View Details
                  </Button>
                  <Button variant='ghost' size='sm'>
                    Leave
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          // Empty state
          <div className='col-span-full flex flex-col items-center justify-center py-12'>
            <Building2 className='h-12 w-12 text-muted-foreground mb-4' />
            <h3 className='text-lg font-semibold'>No organizations found</h3>
            <p className='text-muted-foreground mb-4'>
              You&apos;re not a member of any organizations yet.
            </p>
            <Button>
              <Plus className='mr-2 h-4 w-4' />
              Create Organization
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

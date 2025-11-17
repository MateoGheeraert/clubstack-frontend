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
import { useOrganizationActivities } from "@/lib/hooks/useTrpcActivities";
import { useOrganizationContext } from "@/contexts/OrganizationContext";
import { Plus, Calendar, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";
import type { Activity } from "@/types";

export default function ActivitiesPage() {
  const { selectedOrganizationId } = useOrganizationContext();
  const { data: activitiesResponse, isLoading } = useOrganizationActivities(
    selectedOrganizationId || ""
  );

  const activities = activitiesResponse?.activities || [];

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Activities</h1>
          <p className='text-muted-foreground'>
            View and manage upcoming activities and events
          </p>
        </div>
        <Button>
          <Plus className='mr-2 h-4 w-4' />
          New Activity
        </Button>
      </div>

      {/* Activities Grid */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {isLoading ? (
          // Loading state
          [...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className='h-6 w-32' />
                <Skeleton className='h-4 w-48' />
              </CardHeader>
              <CardContent>
                <Skeleton className='h-4 w-24 mb-2' />
                <Skeleton className='h-4 w-32 mb-2' />
                <Skeleton className='h-4 w-20' />
              </CardContent>
            </Card>
          ))
        ) : activities && activities.length > 0 ? (
          // Activities list
          activities.map((activity: Activity) => (
            <Card
              key={activity.id}
              className='hover:shadow-md transition-shadow'
            >
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <Calendar className='h-6 w-6 text-muted-foreground' />
                  <Badge variant='outline'>
                    {new Date(activity.starts_at) > new Date()
                      ? "Upcoming"
                      : "Past"}
                  </Badge>
                </div>
                <CardTitle className='line-clamp-2'>{activity.title}</CardTitle>
                <CardDescription className='line-clamp-2'>
                  {activity.description || "No description available"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <div className='flex items-center text-sm text-muted-foreground'>
                    <Clock className='mr-2 h-4 w-4' />
                    <span>{format(new Date(activity.starts_at), "PPp")}</span>
                  </div>

                  <div className='flex items-center text-sm text-muted-foreground'>
                    <span className='mr-2 w-4' />
                    <span>to {format(new Date(activity.ends_at), "PPp")}</span>
                  </div>

                  <div className='flex items-center text-sm text-muted-foreground'>
                    <MapPin className='mr-2 h-4 w-4' />
                    <span>{activity.location}</span>
                  </div>

                  {activity.attendees && activity.attendees.length > 0 && (
                    <div className='flex items-center text-sm text-muted-foreground'>
                      <span className='mr-2 w-4' />
                      <span>{activity.attendees.length} attendees</span>
                    </div>
                  )}

                  <div className='flex space-x-2 pt-2'>
                    <Button variant='outline' size='sm' className='flex-1'>
                      View Details
                    </Button>
                    <Button size='sm' className='flex-1'>
                      {new Date(activity.starts_at) > new Date()
                        ? "Join"
                        : "View"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : !selectedOrganizationId ? (
          // No organization selected
          <div className='col-span-full flex flex-col items-center justify-center text-center p-12'>
            <Calendar className='h-12 w-12 text-muted-foreground mb-4' />
            <h3 className='text-lg font-semibold'>Select an Organization</h3>
            <p className='text-muted-foreground mb-4'>
              Please select an organization in the top bar to view its
              activities.
            </p>
          </div>
        ) : (
          // Empty state
          <div className='col-span-full flex flex-col items-center justify-center text-center p-12'>
            <Calendar className='h-12 w-12 text-muted-foreground mb-4' />
            <h3 className='text-lg font-semibold'>No activities found</h3>
            <p className='text-muted-foreground mb-4'>
              There are no activities for this organization at the moment.
            </p>
            <Button>
              <Plus className='mr-2 h-4 w-4' />
              Create Activity
            </Button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Calendar View</CardTitle>
            <CardDescription>
              View all activities in a calendar format
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant='outline' className='w-full'>
              Open Calendar
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Activities</CardTitle>
            <CardDescription>
              View activities you&apos;re attending
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant='outline' className='w-full'>
              View My Activities
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserProfile, useUserStatsAPI } from "@/lib/hooks";
import {
  Edit,
  Mail,
  Calendar,
  Building2,
  Award,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";

export default function ProfilePage() {
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();
  const { data: userStats, isLoading: statsLoading } = useUserStatsAPI();

  const getUserInitials = (email?: string) => {
    if (!email) return "U";
    return email.charAt(0).toUpperCase();
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Profile</h1>
          <p className='text-muted-foreground'>
            Manage your account information and view your activity
          </p>
        </div>
        <Button>
          <Edit className='mr-2 h-4 w-4' />
          Edit Profile
        </Button>
      </div>

      <div className='grid gap-6 lg:grid-cols-3'>
        {/* Profile Info */}
        <div className='lg:col-span-1'>
          <Card>
            <CardHeader className='text-center'>
              <div className='flex justify-center mb-4'>
                <Avatar className='h-24 w-24'>
                  <AvatarImage src='' alt={userProfile?.email || ""} />
                  <AvatarFallback className='text-2xl'>
                    {getUserInitials(userProfile?.email)}
                  </AvatarFallback>
                </Avatar>
              </div>
              {profileLoading ? (
                <Skeleton className='h-8 w-48 mx-auto' />
              ) : (
                <CardTitle className='text-xl'>
                  {userProfile?.email || "User"}
                </CardTitle>
              )}
              <CardDescription className='flex items-center justify-center'>
                <Mail className='mr-1 h-4 w-4' />
                {profileLoading ? (
                  <Skeleton className='h-4 w-32' />
                ) : (
                  userProfile?.email || ""
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <Separator />
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Role</span>
                  {profileLoading ? (
                    <Skeleton className='h-6 w-16' />
                  ) : (
                    <Badge variant='secondary'>
                      {userProfile?.role || "USER"}
                    </Badge>
                  )}
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Member Since</span>
                  <span className='text-sm text-muted-foreground'>
                    {profileLoading ? (
                      <Skeleton className='h-4 w-24' />
                    ) : userProfile?.createdAt ? (
                      format(new Date(userProfile.createdAt), "MMMM yyyy")
                    ) : (
                      "Recently"
                    )}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-sm font-medium'>Status</span>
                  <Badge variant='default'>Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity & Stats */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Stats Cards */}
          <div className='grid gap-4 md:grid-cols-3'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Tasks Completed
                </CardTitle>
                <Award className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {statsLoading ? "..." : userStats?.totalTasks || 0}
                </div>
                <p className='text-xs text-muted-foreground'>
                  +12 from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Activities Attended
                </CardTitle>
                <Calendar className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {statsLoading ? "..." : userProfile?.recentTasks?.length || 0}
                </div>
                <p className='text-xs text-muted-foreground'>
                  +3 from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Organizations
                </CardTitle>
                <Building2 className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {profileLoading
                    ? "..."
                    : userProfile?.organizations?.length || 0}
                </div>
                <p className='text-xs text-muted-foreground'>
                  Active memberships
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Organizations */}
          <Card>
            <CardHeader>
              <CardTitle>My Organizations</CardTitle>
              <CardDescription>
                Organizations you&apos;re a member of
              </CardDescription>
            </CardHeader>
            <CardContent>
              {profileLoading ? (
                <div>Loading organizations...</div>
              ) : userProfile?.organizations &&
                userProfile.organizations.length > 0 ? (
                <div className='space-y-4'>
                  {userProfile.organizations.map((userOrg) => (
                    <div
                      key={userOrg.id}
                      className='flex items-center justify-between p-4 border rounded'
                    >
                      <div className='flex items-center space-x-4'>
                        <div className='h-10 w-10 bg-muted rounded-full flex items-center justify-center'>
                          <Building2 className='h-5 w-5' />
                        </div>
                        <div>
                          <h3 className='font-semibold'>
                            {userOrg.organization.name}
                          </h3>
                          <p className='text-sm text-muted-foreground'>
                            {userOrg.organization.description ||
                              "No description"}
                          </p>
                        </div>
                      </div>
                      <Badge variant='outline'>Member</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center py-8'>
                  <Building2 className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                  <h3 className='font-semibold'>No organizations</h3>
                  <p className='text-muted-foreground'>
                    You&apos;re not a member of any organizations yet.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest actions and achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex items-center space-x-4'>
                  <div className='h-8 w-8 bg-green-100 rounded-full flex items-center justify-center'>
                    <Award className='h-4 w-4 text-green-600' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>
                      Completed task: Update website content
                    </p>
                    <p className='text-xs text-muted-foreground'>2 hours ago</p>
                  </div>
                </div>

                <div className='flex items-center space-x-4'>
                  <div className='h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center'>
                    <Calendar className='h-4 w-4 text-blue-600' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>
                      Joined activity: Monthly team meeting
                    </p>
                    <p className='text-xs text-muted-foreground'>1 day ago</p>
                  </div>
                </div>

                <div className='flex items-center space-x-4'>
                  <div className='h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center'>
                    <TrendingUp className='h-4 w-4 text-purple-600' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>
                      Profile updated successfully
                    </p>
                    <p className='text-xs text-muted-foreground'>3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

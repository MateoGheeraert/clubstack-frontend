"use client";

import { useState } from "react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useOrganizationMembers,
  useRemoveMember,
  useAddMemberByEmail,
  useUpdateMemberRole,
} from "@/lib/hooks/useTrpcMembers";
import { useOrganizationContext } from "@/contexts/OrganizationContext";
import { Plus, Users, UserMinus, Mail, Calendar, Shield, ChevronDown } from "lucide-react";
import { OrganizationMember } from "@/types";
import { userUtils } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function MembersPage() {
  const { selectedOrganizationId } = useOrganizationContext();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [addMemberError, setAddMemberError] = useState<string>("");
  const [memberToRemove, setMemberToRemove] = useState<OrganizationMember | null>(null);
  const [memberToUpdate, setMemberToUpdate] = useState<OrganizationMember | null>(null);
  const [selectedRole, setSelectedRole] = useState<"USER" | "MODERATOR" | "ADMIN">("USER");

  const currentUser = userUtils.getUser();

  const { data: members, isLoading: membersLoading } = useOrganizationMembers(
    selectedOrganizationId || ""
  );

  const addMemberByEmailMutation = useAddMemberByEmail();
  const removeMemberMutation = useRemoveMember();
  const updateRoleMutation = useUpdateMemberRole();

  const handleAddMember = () => {
    if (!newMemberEmail || !selectedOrganizationId) return;

    // Clear any previous errors
    setAddMemberError("");

    addMemberByEmailMutation.mutate(
      {
        organizationId: selectedOrganizationId,
        email: newMemberEmail,
      },
      {
        onSuccess: () => {
          setNewMemberEmail("");
          setAddMemberError("");
          setIsAddDialogOpen(false);
        },
        onError: (error: unknown) => {
          console.error("Failed to add member:", error);
          
          // Parse TRPC/Axios error structure
          const err = error as { 
            data?: { httpStatus?: number; code?: string }; 
            shape?: { data?: { httpStatus?: number; code?: string } }; 
            message?: string;
            cause?: { response?: { status?: number } };
          };
          
          // Check for 404 status in various error structures
          const httpStatus = 
            err?.data?.httpStatus || 
            err?.shape?.data?.httpStatus || 
            err?.cause?.response?.status;
          
          if (httpStatus === 404) {
            setAddMemberError("User not found");
          } else if (httpStatus === 409) {
            setAddMemberError("User is already a member of this organization");
          } else {
            // Check if the error message contains "404" or "not found"
            const errorMessage = err.message || "";
            if (errorMessage.includes("404") || errorMessage.toLowerCase().includes("not found")) {
              setAddMemberError("User not found");
            } else if (errorMessage.includes("409") || errorMessage.toLowerCase().includes("already")) {
              setAddMemberError("User is already a member of this organization");
            } else {
              setAddMemberError(errorMessage || "Failed to add member");
            }
          }
        },
      }
    );
  };

  const handleRemoveMember = () => {
    if (!memberToRemove || !selectedOrganizationId) return;

    removeMemberMutation.mutate(
      {
        organizationId: selectedOrganizationId,
        userId: memberToRemove.userId,
      },
      {
        onSuccess: () => {
          setMemberToRemove(null);
          setIsRemoveDialogOpen(false);
        },
        onError: (error) => {
          console.error("Failed to remove member:", error);
          alert(`Failed to remove member: ${error.message || "Unknown error"}`);
        },
      }
    );
  };

  const handleUpdateRole = () => {
    if (!memberToUpdate || !selectedOrganizationId) return;

    updateRoleMutation.mutate(
      {
        organizationId: selectedOrganizationId,
        userId: memberToUpdate.userId,
        role: selectedRole,
      },
      {
        onSuccess: () => {
          setMemberToUpdate(null);
          setIsRoleDialogOpen(false);
        },
        onError: (error) => {
          console.error("Failed to update role:", error);
          alert(`Failed to update role: ${error.message || "Unknown error"}`);
        },
      }
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Members</h1>
          <p className="text-muted-foreground">
            Manage your organization&apos;s members
          </p>
        </div>
        <Dialog 
          open={isAddDialogOpen} 
          onOpenChange={(open) => {
            setIsAddDialogOpen(open);
            if (!open) {
              // Clear error when dialog is closed
              setAddMemberError("");
              setNewMemberEmail("");
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Member</DialogTitle>
              <DialogDescription>
                Enter the email address of the user you want to add to this
                organization.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={newMemberEmail}
                  onChange={(e) => {
                    setNewMemberEmail(e.target.value);
                    // Clear error when user starts typing
                    if (addMemberError) {
                      setAddMemberError("");
                    }
                  }}
                />
                {addMemberError && (
                  <p className="text-sm text-destructive">{addMemberError}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddMember}
                disabled={!newMemberEmail || addMemberByEmailMutation.isPending}
              >
                {addMemberByEmailMutation.isPending ? "Adding..." : "Add Member"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Members Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Members
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {membersLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{members?.length || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {membersLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{members?.length || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {membersLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {members?.filter((m) => m.role === "ADMIN").length || 0}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>
            A list of all members in your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          {membersLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : !members || members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No members yet</h3>
              <p className="text-muted-foreground mb-4">
                Add members to get started with your organization
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Member
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{member.user.email}</span>
                        {member.userId === currentUser?.id && (
                          <Badge variant="secondary">You</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          member.role === "ADMIN" ? "default" : "secondary"
                        }
                      >
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(member.createdAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={member.userId === currentUser?.id}
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              Manage Role
                              <ChevronDown className="h-4 w-4 ml-2" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setMemberToUpdate(member);
                                setSelectedRole("USER");
                                setIsRoleDialogOpen(true);
                              }}
                              disabled={member.role === "USER"}
                            >
                              Set as User
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setMemberToUpdate(member);
                                setSelectedRole("MODERATOR");
                                setIsRoleDialogOpen(true);
                              }}
                              disabled={member.role === "MODERATOR"}
                            >
                              Set as Moderator
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setMemberToUpdate(member);
                                setSelectedRole("ADMIN");
                                setIsRoleDialogOpen(true);
                              }}
                              disabled={member.role === "ADMIN"}
                            >
                              Set as Admin
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={member.userId === currentUser?.id}
                          onClick={() => {
                            setMemberToRemove(member);
                            setIsRemoveDialogOpen(true);
                          }}
                        >
                          <UserMinus className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Remove Member Confirmation Dialog */}
      <Dialog
        open={isRemoveDialogOpen}
        onOpenChange={setIsRemoveDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {memberToRemove?.user.email} from the
              organization? They will lose access to all organization resources.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsRemoveDialogOpen(false);
                setMemberToRemove(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemoveMember}
              disabled={removeMemberMutation.isPending}
            >
              {removeMemberMutation.isPending ? "Removing..." : "Remove Member"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Role Confirmation Dialog */}
      <Dialog
        open={isRoleDialogOpen}
        onOpenChange={setIsRoleDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Member Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to change {memberToUpdate?.user.email}&apos;s role to{" "}
              <strong>{selectedRole}</strong>? This will change their permissions in the
              organization.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsRoleDialogOpen(false);
                setMemberToUpdate(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateRole}
              disabled={updateRoleMutation.isPending}
            >
              {updateRoleMutation.isPending ? "Updating..." : "Update Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

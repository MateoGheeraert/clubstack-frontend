export interface Organization {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserOrganization {
  id: string;
  userId: string;
  organizationId: string;
  createdAt: string;
  organization: Organization;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    role: "USER" | "ADMIN";
  };
}

export interface TasksResponse {
  tasks: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Activity {
  id: string;
  organizationId: string;
  title: string;
  starts_at: string;
  ends_at: string;
  location: string;
  description: string;
  attendees: string[];
  createdAt: string;
  updatedAt: string;
  organization: {
    id: string;
    name: string;
  };
}

export interface ActivitiesResponse {
  activities: Activity[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Account {
  id: string;
  organizationId: string;
  accountName: string;
  balance: number;
  type: string;
  createdAt: string;
  updatedAt: string;
  organization: {
    id: string;
    name: string;
  };
  Transaction?: Transaction[];
  _count?: {
    Transaction: number;
  };
}

export interface Transaction {
  id: string;
  accountId?: string;
  amount: number;
  transactionType: "DEPOSIT" | "WITHDRAWAL" | "PAYMENT" | "INCOME";
  description: string;
  transactionDate: string;
  transactionCode: string;
  createdAt: string;
  updatedAt?: string;
  account?: {
    id: string;
    organizationId: string;
    accountName: string;
    balance: number;
    type: string;
    organization: {
      id: string;
      name: string;
    };
  };
}

export interface TransactionsResponse {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    totalAmount: number;
    deposits: number;
    withdrawals: number;
    payments: number;
    income: number;
  };
}

export interface UserStats {
  tasksCompleted: number;
  activitiesAttended: number;
  organizationCount: number;
}

export interface UserMe {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
}

export interface UserProfile {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
  organizations: UserOrganization[];
  recentTasks: Task[];
  stats: {
    totalOrganizations: number;
    totalTasks: number;
  };
}

export interface UserStatsAPI {
  totalTasks: number;
  totalOrganizations: number;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'member';
  isAdmin?: boolean;
  createdAt: string;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  creator: User;
  members: User[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  project: Project;
  assignedTo?: User;
  creator: User;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface CreateProjectData {
  name: string;
  description: string;
  members?: string[]; // Array of user IDs
}

export interface CreateTaskData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  project: string;
  assignedTo?: string;
  dueDate?: string;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  project?: string;
  assignedTo?: string;
  dueDate?: string;
}
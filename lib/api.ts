const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

interface AuthTokens {
  access: string
  refresh: string
}

interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
}

interface Project {
  id: number
  name: string
  description: string
  created_at: string
  created_by: User
  issues_count: number
}

interface Issue {
  id: number
  title: string
  description: string
  status: "open" | "in_progress" | "closed"
  priority: "low" | "medium" | "high" | "critical"
  created_at: string
  updated_at: string
  project: number
  project_name: string
  reporter: User
  assignee: User | null
  comments_count: number
}

interface Comment {
  id: number
  content: string
  created_at: string
  author: User
}

// Mock data storage
const STORAGE_KEYS = {
  USERS: "bug_tracker_users",
  PROJECTS: "bug_tracker_projects",
  ISSUES: "bug_tracker_issues",
  COMMENTS: "bug_tracker_comments",
  CURRENT_USER: "bug_tracker_current_user",
  ACCESS_TOKEN: "access_token",
}

class ApiClient {
  private generateId(): number {
    return Date.now() + Math.floor(Math.random() * 1000)
  }

  private getStoredData<T>(key: string): T[] {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  }

  private setStoredData<T>(key: string, data: T[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(key, JSON.stringify(data))
  }

  private initializeDemoData(): void {
    if (typeof window === "undefined") return

    // Initialize with demo data if empty
    const users = this.getStoredData<User>(STORAGE_KEYS.USERS)
    if (users.length === 0) {
      const demoUsers: User[] = [
        {
          id: 1,
          username: "demo",
          email: "demo@example.com",
          first_name: "Demo",
          last_name: "User",
        },
        {
          id: 2,
          username: "admin",
          email: "admin@example.com",
          first_name: "Admin",
          last_name: "User",
        },
      ]
      this.setStoredData(STORAGE_KEYS.USERS, demoUsers)
    }

    const projects = this.getStoredData<Project>(STORAGE_KEYS.PROJECTS)
    if (projects.length === 0) {
      const demoProjects: Project[] = [
        {
          id: 1,
          name: "Demo Project",
          description: "A sample project to demonstrate the bug tracking system",
          created_at: new Date().toISOString(),
          created_by: users[0] || {
            id: 1,
            username: "demo",
            email: "demo@example.com",
            first_name: "Demo",
            last_name: "User",
          },
          issues_count: 2,
        },
      ]
      this.setStoredData(STORAGE_KEYS.PROJECTS, demoProjects)
    }

    const issues = this.getStoredData<Issue>(STORAGE_KEYS.ISSUES)
    if (issues.length === 0) {
      const demoIssues: Issue[] = [
        {
          id: 1,
          title: "Sample Bug Report",
          description: "This is a sample bug report to demonstrate the system",
          status: "open",
          priority: "medium",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          project: 1,
          project_name: "Demo Project",
          reporter: users[0] || {
            id: 1,
            username: "demo",
            email: "demo@example.com",
            first_name: "Demo",
            last_name: "User",
          },
          assignee: null,
          comments_count: 1,
        },
        {
          id: 2,
          title: "Feature Request",
          description: "This is a sample feature request",
          status: "in_progress",
          priority: "high",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          project: 1,
          project_name: "Demo Project",
          reporter: users[0] || {
            id: 1,
            username: "demo",
            email: "demo@example.com",
            first_name: "Demo",
            last_name: "User",
          },
          assignee: users[1] || null,
          comments_count: 0,
        },
      ]
      this.setStoredData(STORAGE_KEYS.ISSUES, demoIssues)
    }
  }

  private async simulateNetworkDelay(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200))
  }

  // Auth methods
  async login(username: string, password: string): Promise<{ user: User; tokens: AuthTokens }> {
    await this.simulateNetworkDelay()
    this.initializeDemoData()

    const users = this.getStoredData<User>(STORAGE_KEYS.USERS)
    const user = users.find((u) => u.username === username)

    if (!user) {
      throw new Error("Invalid username or password")
    }

    // For demo purposes, accept any password
    const tokens = {
      access: `demo_token_${user.id}_${Date.now()}`,
      refresh: `demo_refresh_${user.id}_${Date.now()}`,
    }

    // Store tokens and user
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.access)
    localStorage.setItem("refresh_token", tokens.refresh)
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))

    return { user, tokens }
  }

  async register(userData: {
    username: string
    email: string
    password: string
    first_name?: string
    last_name?: string
  }): Promise<{ user: User; tokens: AuthTokens }> {
    await this.simulateNetworkDelay()
    this.initializeDemoData()

    const users = this.getStoredData<User>(STORAGE_KEYS.USERS)

    // Check if username already exists
    if (users.find((u) => u.username === userData.username)) {
      throw new Error("Username already exists")
    }

    // Check if email already exists
    if (users.find((u) => u.email === userData.email)) {
      throw new Error("Email already exists")
    }

    const newUser: User = {
      id: this.generateId(),
      username: userData.username,
      email: userData.email,
      first_name: userData.first_name || "",
      last_name: userData.last_name || "",
    }

    users.push(newUser)
    this.setStoredData(STORAGE_KEYS.USERS, users)

    const tokens = {
      access: `demo_token_${newUser.id}_${Date.now()}`,
      refresh: `demo_refresh_${newUser.id}_${Date.now()}`,
    }

    // Store tokens and user
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.access)
    localStorage.setItem("refresh_token", tokens.refresh)
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser))

    return { user: newUser, tokens }
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem("refresh_token")
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  }

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null
    const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
    return userStr ? JSON.parse(userStr) : null
  }

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false
    return !!localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
  }

  // Project methods
  async getProjects(): Promise<{ results: Project[] }> {
    await this.simulateNetworkDelay()
    this.initializeDemoData()

    const projects = this.getStoredData<Project>(STORAGE_KEYS.PROJECTS)
    const issues = this.getStoredData<Issue>(STORAGE_KEYS.ISSUES)

    // Update issues count for each project
    const projectsWithCounts = projects.map((project) => ({
      ...project,
      issues_count: issues.filter((issue) => issue.project === project.id).length,
    }))

    return { results: projectsWithCounts }
  }

  async createProject(projectData: { name: string; description: string }): Promise<Project> {
    await this.simulateNetworkDelay()

    const currentUser = this.getCurrentUser()
    if (!currentUser) {
      throw new Error("Authentication required")
    }

    const projects = this.getStoredData<Project>(STORAGE_KEYS.PROJECTS)

    const newProject: Project = {
      id: this.generateId(),
      name: projectData.name,
      description: projectData.description,
      created_at: new Date().toISOString(),
      created_by: currentUser,
      issues_count: 0,
    }

    projects.push(newProject)
    this.setStoredData(STORAGE_KEYS.PROJECTS, projects)

    return newProject
  }

  async getProject(id: number): Promise<Project> {
    await this.simulateNetworkDelay()

    const projects = this.getStoredData<Project>(STORAGE_KEYS.PROJECTS)
    const project = projects.find((p) => p.id === id)

    if (!project) {
      throw new Error("Project not found")
    }

    const issues = this.getStoredData<Issue>(STORAGE_KEYS.ISSUES)
    project.issues_count = issues.filter((issue) => issue.project === id).length

    return project
  }

  // Issue methods
  async getIssues(
    projectId: number,
    params?: {
      status?: string
      priority?: string
      search?: string
    },
  ): Promise<{ results: Issue[] }> {
    await this.simulateNetworkDelay()

    let issues = this.getStoredData<Issue>(STORAGE_KEYS.ISSUES)
    issues = issues.filter((issue) => issue.project === projectId)

    // Apply filters
    if (params?.status) {
      issues = issues.filter((issue) => issue.status === params.status)
    }
    if (params?.priority) {
      issues = issues.filter((issue) => issue.priority === params.priority)
    }
    if (params?.search) {
      const searchLower = params.search.toLowerCase()
      issues = issues.filter(
        (issue) =>
          issue.title.toLowerCase().includes(searchLower) || issue.description.toLowerCase().includes(searchLower),
      )
    }

    return { results: issues }
  }

  async createIssue(
    projectId: number,
    issueData: {
      title: string
      description: string
      priority: string
      assignee_id?: number
    },
  ): Promise<Issue> {
    await this.simulateNetworkDelay()

    const currentUser = this.getCurrentUser()
    if (!currentUser) {
      throw new Error("Authentication required")
    }

    const projects = this.getStoredData<Project>(STORAGE_KEYS.PROJECTS)
    const project = projects.find((p) => p.id === projectId)
    if (!project) {
      throw new Error("Project not found")
    }

    const users = this.getStoredData<User>(STORAGE_KEYS.USERS)
    const assignee = issueData.assignee_id ? users.find((u) => u.id === issueData.assignee_id) || null : null

    const issues = this.getStoredData<Issue>(STORAGE_KEYS.ISSUES)

    const newIssue: Issue = {
      id: this.generateId(),
      title: issueData.title,
      description: issueData.description,
      status: "open",
      priority: issueData.priority as Issue["priority"],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      project: projectId,
      project_name: project.name,
      reporter: currentUser,
      assignee,
      comments_count: 0,
    }

    issues.push(newIssue)
    this.setStoredData(STORAGE_KEYS.ISSUES, issues)

    return newIssue
  }

  async updateIssue(
    issueId: number,
    updates: {
      status?: string
      assignee_id?: number | null
    },
  ): Promise<Issue> {
    await this.simulateNetworkDelay()

    const issues = this.getStoredData<Issue>(STORAGE_KEYS.ISSUES)
    const issueIndex = issues.findIndex((i) => i.id === issueId)

    if (issueIndex === -1) {
      throw new Error("Issue not found")
    }

    const users = this.getStoredData<User>(STORAGE_KEYS.USERS)

    if (updates.status) {
      issues[issueIndex].status = updates.status as Issue["status"]
    }

    if (updates.assignee_id !== undefined) {
      issues[issueIndex].assignee = updates.assignee_id ? users.find((u) => u.id === updates.assignee_id) || null : null
    }

    issues[issueIndex].updated_at = new Date().toISOString()

    this.setStoredData(STORAGE_KEYS.ISSUES, issues)

    return issues[issueIndex]
  }

  async getIssue(issueId: number): Promise<Issue & { comments: Comment[] }> {
    await this.simulateNetworkDelay()

    const issues = this.getStoredData<Issue>(STORAGE_KEYS.ISSUES)
    const issue = issues.find((i) => i.id === issueId)

    if (!issue) {
      throw new Error("Issue not found")
    }

    const comments = this.getStoredData<Comment>(STORAGE_KEYS.COMMENTS)
    const issueComments = comments.filter((c) => c.id === issueId) // Note: This should be filtered by issue_id in real implementation

    return { ...issue, comments: issueComments }
  }

  // Comment methods
  async getComments(issueId: number): Promise<{ results: Comment[] }> {
    await this.simulateNetworkDelay()

    const comments = this.getStoredData<Comment>(STORAGE_KEYS.COMMENTS)
    const issueComments = comments.filter((c) => c.id === issueId) // Note: This should be filtered by issue_id in real implementation

    return { results: issueComments }
  }

  async createComment(issueId: number, content: string): Promise<Comment> {
    await this.simulateNetworkDelay()

    const currentUser = this.getCurrentUser()
    if (!currentUser) {
      throw new Error("Authentication required")
    }

    const comments = this.getStoredData<Comment>(STORAGE_KEYS.COMMENTS)

    const newComment: Comment = {
      id: this.generateId(),
      content,
      created_at: new Date().toISOString(),
      author: currentUser,
    }

    comments.push(newComment)
    this.setStoredData(STORAGE_KEYS.COMMENTS, comments)

    // Update issue comments count
    const issues = this.getStoredData<Issue>(STORAGE_KEYS.ISSUES)
    const issueIndex = issues.findIndex((i) => i.id === issueId)
    if (issueIndex !== -1) {
      issues[issueIndex].comments_count += 1
      this.setStoredData(STORAGE_KEYS.ISSUES, issues)
    }

    return newComment
  }

  // Users methods
  async getUsers(): Promise<{ results: User[] }> {
    await this.simulateNetworkDelay()
    this.initializeDemoData()

    const users = this.getStoredData<User>(STORAGE_KEYS.USERS)
    return { results: users }
  }
}

export const api = new ApiClient()
export type { User, Project, Issue, Comment }

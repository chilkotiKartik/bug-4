"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Bug,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  Calendar,
  Download,
} from "lucide-react"

// Mock data for charts
const bugTrendData = [
  { month: "Jan", reported: 45, resolved: 38, open: 7 },
  { month: "Feb", reported: 52, resolved: 48, open: 11 },
  { month: "Mar", reported: 38, resolved: 42, open: 7 },
  { month: "Apr", reported: 61, resolved: 55, open: 13 },
  { month: "May", reported: 49, resolved: 51, open: 11 },
  { month: "Jun", reported: 43, resolved: 47, open: 7 },
]

const priorityData = [
  { name: "Critical", value: 12, color: "#ef4444" },
  { name: "High", value: 28, color: "#f97316" },
  { name: "Medium", value: 45, color: "#eab308" },
  { name: "Low", value: 31, color: "#22c55e" },
]

const teamPerformanceData = [
  { name: "Alice Johnson", resolved: 23, assigned: 28, efficiency: 82 },
  { name: "Bob Smith", resolved: 19, assigned: 22, efficiency: 86 },
  { name: "Carol Davis", resolved: 31, assigned: 35, efficiency: 89 },
  { name: "David Wilson", resolved: 17, assigned: 21, efficiency: 81 },
  { name: "Eva Brown", resolved: 25, assigned: 27, efficiency: 93 },
]

const resolutionTimeData = [
  { day: "Mon", avgTime: 2.4 },
  { day: "Tue", avgTime: 1.8 },
  { day: "Wed", avgTime: 3.2 },
  { day: "Thu", avgTime: 2.1 },
  { day: "Fri", avgTime: 2.8 },
  { day: "Sat", avgTime: 1.5 },
  { day: "Sun", avgTime: 1.2 },
]

const kpiData = [
  {
    title: "Total Bugs",
    value: "1,247",
    change: "+12%",
    trend: "up",
    icon: Bug,
    color: "text-chart-1",
  },
  {
    title: "Resolved This Month",
    value: "342",
    change: "+8%",
    trend: "up",
    icon: CheckCircle,
    color: "text-chart-3",
  },
  {
    title: "Avg Resolution Time",
    value: "2.3 days",
    change: "-15%",
    trend: "down",
    icon: Clock,
    color: "text-chart-4",
  },
  {
    title: "Critical Issues",
    value: "12",
    change: "-25%",
    trend: "down",
    icon: AlertTriangle,
    color: "text-chart-5",
  },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [selectedTeam, setSelectedTeam] = useState("all")

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive insights into your bug tracking and team performance</p>
          </div>

          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="w-[140px]">
                <Users className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teams</SelectItem>
                <SelectItem value="frontend">Frontend</SelectItem>
                <SelectItem value="backend">Backend</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="qa">QA</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {kpiData.map((kpi, index) => {
            const Icon = kpi.icon
            const TrendIcon = kpi.trend === "up" ? TrendingUp : TrendingDown
            return (
              <Card key={kpi.title} className="hover-lift">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${kpi.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <TrendIcon className={`mr-1 h-3 w-3 ${kpi.trend === "up" ? "text-chart-3" : "text-chart-5"}`} />
                    <span className={kpi.trend === "up" ? "text-chart-3" : "text-chart-5"}>{kpi.change}</span>
                    <span className="ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Main Analytics Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="team">Team Performance</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Bug Trends Chart */}
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle>Bug Trends</CardTitle>
                  <CardDescription>Monthly bug reporting and resolution trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={bugTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="reported" fill="hsl(var(--chart-1))" name="Reported" />
                      <Bar dataKey="resolved" fill="hsl(var(--chart-3))" name="Resolved" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Priority Distribution */}
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle>Priority Distribution</CardTitle>
                  <CardDescription>Current open bugs by priority level</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={priorityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {priorityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {priorityData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-muted-foreground">
                          {item.name} ({item.value})
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Resolution Time Trend */}
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle>Average Resolution Time</CardTitle>
                <CardDescription>Daily average time to resolve bugs (in days)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={resolutionTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="avgTime"
                      stroke="hsl(var(--chart-2))"
                      fill="hsl(var(--chart-2))"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle>Bug Reporting Trends</CardTitle>
                <CardDescription>Detailed analysis of bug reporting patterns over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={bugTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="reported"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={2}
                      name="Reported"
                    />
                    <Line
                      type="monotone"
                      dataKey="resolved"
                      stroke="hsl(var(--chart-3))"
                      strokeWidth={2}
                      name="Resolved"
                    />
                    <Line type="monotone" dataKey="open" stroke="hsl(var(--chart-5))" strokeWidth={2} name="Open" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
                <CardDescription>Individual team member performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamPerformanceData.map((member) => (
                    <div key={member.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {member.resolved} resolved / {member.assigned} assigned
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={member.efficiency >= 85 ? "default" : "secondary"}>
                          {member.efficiency}% efficiency
                        </Badge>
                        <div className="w-24 bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${member.efficiency}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle>Weekly Report</CardTitle>
                  <CardDescription>Summary of this week's bug tracking activity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Bugs Reported</span>
                    <span className="font-medium">47</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Bugs Resolved</span>
                    <span className="font-medium">52</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Net Change</span>
                    <span className="font-medium text-chart-3">-5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Team Efficiency</span>
                    <span className="font-medium">87%</span>
                  </div>
                  <Button className="w-full mt-4">
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover-lift">
                <CardHeader>
                  <CardTitle>Monthly Report</CardTitle>
                  <CardDescription>Comprehensive monthly performance analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Bugs Handled</span>
                    <span className="font-medium">203</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Resolution Rate</span>
                    <span className="font-medium">94%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avg Resolution Time</span>
                    <span className="font-medium">2.3 days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Customer Satisfaction</span>
                    <span className="font-medium">4.8/5</span>
                  </div>
                  <Button className="w-full mt-4">
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

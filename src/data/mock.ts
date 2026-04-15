export interface Category {
  id: string
  name: string
  description: string
  documentCount: number
  lastUpdated: string
  color: string
  createdBy: string
  permissionGroups: string[]  // group ids with non-none access
}

export interface Document {
  id: string
  categoryId: string
  name: string
  type: 'PDF' | 'DOCX' | 'TXT' | 'XLSX' | 'PPTX'
  size: string
  uploadDate: string
  uploadedBy: string
}

export interface UserGroup {
  id: string
  name: string
  memberCount: number
  description: string
}

export interface Permission {
  groupId: string
  categoryId: string
  level: 'none' | 'view' | 'edit'
}

export interface AccessRequest {
  id: string
  requester: string
  groupId: string
  categoryId: string
  levels: ('view' | 'edit')[]
  status: 'pending' | 'approved' | 'rejected'
  requestedAt: string
  comment?: string
  reviewedBy?: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  sources?: string[]
}

export interface Activity {
  id: string
  action: string
  target: string
  user: string
  time: string
  type: 'upload' | 'delete' | 'access' | 'create'
}

// --- Categories ---
export const categories: Category[] = [
  { id: 'c1', name: 'Product Documentation', description: 'Technical specs, user guides, and release notes for all products.', documentCount: 24, lastUpdated: '2026-04-14', color: 'bg-blue-100 text-blue-700', createdBy: 'Alice Johnson', permissionGroups: ['g1', 'g2', 'g3', 'g4'] },
  { id: 'c2', name: 'HR Policies', description: 'Company policies, onboarding materials, and employee handbook.', documentCount: 18, lastUpdated: '2026-04-10', color: 'bg-green-100 text-green-700', createdBy: 'HR Team', permissionGroups: ['g1', 'g2', 'g4', 'g5'] },
  { id: 'c3', name: 'Engineering Wiki', description: 'Architecture decisions, coding standards, and runbooks.', documentCount: 41, lastUpdated: '2026-04-13', color: 'bg-purple-100 text-purple-700', createdBy: 'Carol Lee', permissionGroups: ['g1', 'g2'] },
  { id: 'c4', name: 'Sales Playbook', description: 'Sales scripts, case studies, and competitive analysis.', documentCount: 12, lastUpdated: '2026-04-08', color: 'bg-orange-100 text-orange-700', createdBy: 'Eve Wilson', permissionGroups: ['g2', 'g3'] },
  { id: 'c5', name: 'Legal & Compliance', description: 'Contracts, regulatory filings, and compliance checklists.', documentCount: 9, lastUpdated: '2026-04-05', color: 'bg-red-100 text-red-700', createdBy: 'Dave Park', permissionGroups: ['g1', 'g4', 'g5'] },
  { id: 'c6', name: 'Marketing Assets', description: 'Brand guidelines, campaign materials, and media kits.', documentCount: 33, lastUpdated: '2026-04-12', color: 'bg-yellow-100 text-yellow-700', createdBy: 'Eve Wilson', permissionGroups: ['g2', 'g3', 'g1'] },
]

// --- Documents ---
export const documents: Document[] = [
  { id: 'd1', categoryId: 'c1', name: 'Product_v2.4_Release_Notes.pdf', type: 'PDF', size: '2.3 MB', uploadDate: '2026-04-14', uploadedBy: 'Alice Johnson' },
  { id: 'd2', categoryId: 'c1', name: 'User_Guide_Mobile.docx', type: 'DOCX', size: '4.1 MB', uploadDate: '2026-04-12', uploadedBy: 'Bob Smith' },
  { id: 'd3', categoryId: 'c1', name: 'API_Reference.pdf', type: 'PDF', size: '1.8 MB', uploadDate: '2026-04-10', uploadedBy: 'Carol Lee' },
  { id: 'd4', categoryId: 'c1', name: 'Integration_Checklist.xlsx', type: 'XLSX', size: '320 KB', uploadDate: '2026-04-08', uploadedBy: 'Alice Johnson' },
  { id: 'd5', categoryId: 'c1', name: 'Architecture_Overview.pptx', type: 'PPTX', size: '6.5 MB', uploadDate: '2026-04-06', uploadedBy: 'Dave Park' },
  { id: 'd6', categoryId: 'c2', name: 'Employee_Handbook_2026.pdf', type: 'PDF', size: '3.2 MB', uploadDate: '2026-04-10', uploadedBy: 'HR Team' },
  { id: 'd7', categoryId: 'c2', name: 'Onboarding_Checklist.docx', type: 'DOCX', size: '210 KB', uploadDate: '2026-04-07', uploadedBy: 'HR Team' },
  { id: 'd8', categoryId: 'c3', name: 'System_Design_ADR.txt', type: 'TXT', size: '48 KB', uploadDate: '2026-04-13', uploadedBy: 'Carol Lee' },
  { id: 'd9', categoryId: 'c3', name: 'Deployment_Runbook.pdf', type: 'PDF', size: '1.1 MB', uploadDate: '2026-04-11', uploadedBy: 'Dave Park' },
  { id: 'd10', categoryId: 'c4', name: 'Sales_Script_Q2.docx', type: 'DOCX', size: '560 KB', uploadDate: '2026-04-08', uploadedBy: 'Eve Wilson' },
]

// --- User Groups ---
export const userGroups: UserGroup[] = [
  { id: 'g1', name: 'Engineering', memberCount: 12, description: 'Software engineers and architects.' },
  { id: 'g2', name: 'Product', memberCount: 6, description: 'Product managers and designers.' },
  { id: 'g3', name: 'Sales', memberCount: 9, description: 'Account executives and SDRs.' },
  { id: 'g4', name: 'HR', memberCount: 4, description: 'Human resources team.' },
  { id: 'g5', name: 'Legal', memberCount: 3, description: 'Legal and compliance team.' },
]

// --- Permissions ---
export const permissions: Permission[] = [
  { groupId: 'g1', categoryId: 'c1', level: 'edit' },
  { groupId: 'g1', categoryId: 'c2', level: 'view' },
  { groupId: 'g1', categoryId: 'c3', level: 'edit' },
  { groupId: 'g1', categoryId: 'c4', level: 'none' },
  { groupId: 'g1', categoryId: 'c5', level: 'view' },
  { groupId: 'g1', categoryId: 'c6', level: 'view' },
  { groupId: 'g2', categoryId: 'c1', level: 'edit' },
  { groupId: 'g2', categoryId: 'c2', level: 'view' },
  { groupId: 'g2', categoryId: 'c3', level: 'view' },
  { groupId: 'g2', categoryId: 'c4', level: 'edit' },
  { groupId: 'g2', categoryId: 'c5', level: 'none' },
  { groupId: 'g2', categoryId: 'c6', level: 'edit' },
  { groupId: 'g3', categoryId: 'c1', level: 'view' },
  { groupId: 'g3', categoryId: 'c2', level: 'none' },
  { groupId: 'g3', categoryId: 'c3', level: 'none' },
  { groupId: 'g3', categoryId: 'c4', level: 'edit' },
  { groupId: 'g3', categoryId: 'c5', level: 'none' },
  { groupId: 'g3', categoryId: 'c6', level: 'view' },
  { groupId: 'g4', categoryId: 'c1', level: 'view' },
  { groupId: 'g4', categoryId: 'c2', level: 'edit' },
  { groupId: 'g4', categoryId: 'c3', level: 'none' },
  { groupId: 'g4', categoryId: 'c4', level: 'none' },
  { groupId: 'g4', categoryId: 'c5', level: 'view' },
  { groupId: 'g4', categoryId: 'c6', level: 'none' },
  { groupId: 'g5', categoryId: 'c1', level: 'none' },
  { groupId: 'g5', categoryId: 'c2', level: 'view' },
  { groupId: 'g5', categoryId: 'c3', level: 'none' },
  { groupId: 'g5', categoryId: 'c4', level: 'none' },
  { groupId: 'g5', categoryId: 'c5', level: 'edit' },
  { groupId: 'g5', categoryId: 'c6', level: 'none' },
]

// --- Recent Activities ---
export const activities: Activity[] = [
  { id: 'a1', action: 'Uploaded', target: 'Product_v2.4_Release_Notes.pdf', user: 'Alice Johnson', time: '2 hours ago', type: 'upload' },
  { id: 'a2', action: 'Created category', target: 'Marketing Assets', user: 'Eve Wilson', time: '5 hours ago', type: 'create' },
  { id: 'a3', action: 'Deleted', target: 'Old_Policy_2024.pdf', user: 'HR Team', time: '1 day ago', type: 'delete' },
  { id: 'a4', action: 'Accessed', target: 'Engineering Wiki', user: 'Dave Park', time: '1 day ago', type: 'access' },
  { id: 'a5', action: 'Uploaded', target: 'Sales_Script_Q2.docx', user: 'Eve Wilson', time: '2 days ago', type: 'upload' },
  { id: 'a6', action: 'Uploaded', target: 'System_Design_ADR.txt', user: 'Carol Lee', time: '2 days ago', type: 'upload' },
]

// --- Chart Data ---
export const documentsByCategory = categories.map(c => ({
  name: c.name.split(' ')[0],
  docs: c.documentCount,
}))

export const heartVotesByKB: { id: string; name: string; votes: number }[] = [
  { id: 'c3', name: 'Engineering Wiki',      votes: 87 },
  { id: 'c1', name: 'Product Documentation', votes: 74 },
  { id: 'c6', name: 'Marketing Assets',      votes: 61 },
  { id: 'c2', name: 'HR Policies',           votes: 45 },
  { id: 'c4', name: 'Sales Playbook',        votes: 38 },
  { id: 'c5', name: 'Legal & Compliance',    votes: 22 },
]

export const uploadTrend = [
  { month: 'Nov', uploads: 14 },
  { month: 'Dec', uploads: 22 },
  { month: 'Jan', uploads: 18 },
  { month: 'Feb', uploads: 31 },
  { month: 'Mar', uploads: 27 },
  { month: 'Apr', uploads: 19 },
]

// --- Access Requests ---
export const accessRequests: AccessRequest[] = [
  { id: 'r1', requester: 'Bob Smith',    groupId: 'g3', categoryId: 'c3', levels: ['view'],         status: 'pending',  requestedAt: '2026-04-14' },
  { id: 'r2', requester: 'Carol Lee',    groupId: 'g4', categoryId: 'c1', levels: ['view', 'edit'], status: 'pending',  requestedAt: '2026-04-13' },
  { id: 'r3', requester: 'Dave Park',    groupId: 'g5', categoryId: 'c4', levels: ['view'],         status: 'approved', requestedAt: '2026-04-11' },
  { id: 'r4', requester: 'Eve Wilson',   groupId: 'g1', categoryId: 'c5', levels: ['edit'],         status: 'rejected', requestedAt: '2026-04-10' },
  { id: 'r5', requester: 'Alice Johnson',groupId: 'g2', categoryId: 'c6', levels: ['view', 'edit'], status: 'pending',  requestedAt: '2026-04-09' },
  { id: 'r6', requester: 'Bob Smith',    groupId: 'g5', categoryId: 'c2', levels: ['edit'],         status: 'approved', requestedAt: '2026-04-08' },
]

// --- Chat messages per category ---
export const chatMessages: Record<string, ChatMessage[]> = {
  c1: [
    { id: 'm1', role: 'assistant', content: 'Hello! I can answer questions about Product Documentation. What would you like to know?', timestamp: '10:00 AM' },
    { id: 'm2', role: 'user', content: 'What changed in v2.4?', timestamp: '10:01 AM' },
    { id: 'm3', role: 'assistant', content: 'Version 2.4 includes performance improvements to the mobile SDK, a new dark mode for the UI, and fixes for 3 critical bugs reported in v2.3. See the release notes for full details.', timestamp: '10:01 AM', sources: ['Product_v2.4_Release_Notes.pdf'] },
  ],
}

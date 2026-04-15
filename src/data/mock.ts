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

export interface AuditLog {
  id: string
  timestamp: string
  user: string
  module: 'KB Store' | 'Access Request' | 'Document' | 'User'
  action: 'create' | 'update' | 'delete' | 'upload' | 'approve' | 'reject' | 'access'
  target: string
  detail: string
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
  { id: 'c1', name: 'Product Documentation', description: 'Technical specs, user guides, and release notes for all products.', documentCount: 24, lastUpdated: '2026-04-14', color: 'bg-blue-100 text-blue-700', createdBy: 'Nguyễn Thị Lan', permissionGroups: ['g1', 'g2', 'g3', 'g4'] },
  { id: 'c2', name: 'HR Policies', description: 'Company policies, onboarding materials, and employee handbook.', documentCount: 18, lastUpdated: '2026-04-10', color: 'bg-green-100 text-green-700', createdBy: 'Phòng Nhân Sự', permissionGroups: ['g1', 'g2', 'g4', 'g5'] },
  { id: 'c3', name: 'Engineering Wiki', description: 'Architecture decisions, coding standards, and runbooks.', documentCount: 41, lastUpdated: '2026-04-13', color: 'bg-purple-100 text-purple-700', createdBy: 'Lê Thị Mai', permissionGroups: ['g1', 'g2'] },
  { id: 'c4', name: 'Sales Playbook', description: 'Sales scripts, case studies, and competitive analysis.', documentCount: 12, lastUpdated: '2026-04-08', color: 'bg-orange-100 text-orange-700', createdBy: 'Hoàng Thị Thu', permissionGroups: ['g2', 'g3'] },
  { id: 'c5', name: 'Legal & Compliance', description: 'Contracts, regulatory filings, and compliance checklists.', documentCount: 9, lastUpdated: '2026-04-05', color: 'bg-red-100 text-red-700', createdBy: 'Phạm Văn Đức', permissionGroups: ['g1', 'g4', 'g5'] },
  { id: 'c6', name: 'Marketing Assets', description: 'Brand guidelines, campaign materials, and media kits.', documentCount: 33, lastUpdated: '2026-04-12', color: 'bg-yellow-100 text-yellow-700', createdBy: 'Hoàng Thị Thu', permissionGroups: ['g2', 'g3', 'g1'] },
]

// --- Documents ---
export const documents: Document[] = [
  { id: 'd1', categoryId: 'c1', name: 'Product_v2.4_Release_Notes.pdf', type: 'PDF', size: '2.3 MB', uploadDate: '2026-04-14', uploadedBy: 'Nguyễn Thị Lan' },
  { id: 'd2', categoryId: 'c1', name: 'User_Guide_Mobile.docx', type: 'DOCX', size: '4.1 MB', uploadDate: '2026-04-12', uploadedBy: 'Trần Văn Hùng' },
  { id: 'd3', categoryId: 'c1', name: 'API_Reference.pdf', type: 'PDF', size: '1.8 MB', uploadDate: '2026-04-10', uploadedBy: 'Lê Thị Mai' },
  { id: 'd4', categoryId: 'c1', name: 'Integration_Checklist.xlsx', type: 'XLSX', size: '320 KB', uploadDate: '2026-04-08', uploadedBy: 'Nguyễn Thị Lan' },
  { id: 'd5', categoryId: 'c1', name: 'Architecture_Overview.pptx', type: 'PPTX', size: '6.5 MB', uploadDate: '2026-04-06', uploadedBy: 'Phạm Văn Đức' },
  { id: 'd6', categoryId: 'c2', name: 'Employee_Handbook_2026.pdf', type: 'PDF', size: '3.2 MB', uploadDate: '2026-04-10', uploadedBy: 'Phòng Nhân Sự' },
  { id: 'd7', categoryId: 'c2', name: 'Onboarding_Checklist.docx', type: 'DOCX', size: '210 KB', uploadDate: '2026-04-07', uploadedBy: 'Phòng Nhân Sự' },
  { id: 'd8', categoryId: 'c3', name: 'System_Design_ADR.txt', type: 'TXT', size: '48 KB', uploadDate: '2026-04-13', uploadedBy: 'Lê Thị Mai' },
  { id: 'd9', categoryId: 'c3', name: 'Deployment_Runbook.pdf', type: 'PDF', size: '1.1 MB', uploadDate: '2026-04-11', uploadedBy: 'Phạm Văn Đức' },
  { id: 'd10', categoryId: 'c4', name: 'Sales_Script_Q2.docx', type: 'DOCX', size: '560 KB', uploadDate: '2026-04-08', uploadedBy: 'Hoàng Thị Thu' },
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
  { id: 'a1', action: 'Uploaded', target: 'Product_v2.4_Release_Notes.pdf', user: 'Nguyễn Thị Lan', time: '2 hours ago', type: 'upload' },
  { id: 'a2', action: 'Created category', target: 'Marketing Assets', user: 'Hoàng Thị Thu', time: '5 hours ago', type: 'create' },
  { id: 'a3', action: 'Deleted', target: 'Old_Policy_2024.pdf', user: 'Phòng Nhân Sự', time: '1 day ago', type: 'delete' },
  { id: 'a4', action: 'Accessed', target: 'Engineering Wiki', user: 'Phạm Văn Đức', time: '1 day ago', type: 'access' },
  { id: 'a5', action: 'Uploaded', target: 'Sales_Script_Q2.docx', user: 'Hoàng Thị Thu', time: '2 days ago', type: 'upload' },
  { id: 'a6', action: 'Uploaded', target: 'System_Design_ADR.txt', user: 'Lê Thị Mai', time: '2 days ago', type: 'upload' },
]

// --- Chart Data ---
export const documentsByCategory = categories.map(c => ({
  name: c.name.split(' ')[0],
  docs: c.documentCount,
}))

export const apiRequestsByKB: { id: string; name: string; requests: number; errors: number }[] = [
  { id: 'c1', name: 'Product Docs',   requests: 1420, errors: 38 },
  { id: 'c3', name: 'Eng Wiki',       requests: 980,  errors: 12 },
  { id: 'c6', name: 'Marketing',      requests: 754,  errors: 21 },
  { id: 'c4', name: 'Sales Playbook', requests: 530,  errors: 9  },
  { id: 'c2', name: 'HR Policies',    requests: 310,  errors: 5  },
  { id: 'c5', name: 'Legal',          requests: 180,  errors: 17 },
]

export const apiRequestsTrend: { date: string; c1: number; c3: number; c6: number }[] = [
  { date: 'Apr 10', c1: 180, c3: 120, c6: 90  },
  { date: 'Apr 11', c1: 210, c3: 140, c6: 100 },
  { date: 'Apr 12', c1: 195, c3: 130, c6: 110 },
  { date: 'Apr 13', c1: 240, c3: 160, c6: 95  },
  { date: 'Apr 14', c1: 220, c3: 150, c6: 120 },
  { date: 'Apr 15', c1: 260, c3: 175, c6: 130 },
  { date: 'Apr 16', c1: 115, c3: 105, c6: 109 },
]

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
  { id: 'r1', requester: 'Trần Văn Hùng',    groupId: 'g3', categoryId: 'c3', levels: ['view'],         status: 'pending',  requestedAt: '2026-04-14' },
  { id: 'r2', requester: 'Lê Thị Mai',    groupId: 'g4', categoryId: 'c1', levels: ['view', 'edit'], status: 'pending',  requestedAt: '2026-04-13' },
  { id: 'r3', requester: 'Phạm Văn Đức',    groupId: 'g5', categoryId: 'c4', levels: ['view'],         status: 'approved', requestedAt: '2026-04-11' },
  { id: 'r4', requester: 'Hoàng Thị Thu',   groupId: 'g1', categoryId: 'c5', levels: ['edit'],         status: 'rejected', requestedAt: '2026-04-10' },
  { id: 'r5', requester: 'Nguyễn Thị Lan',groupId: 'g2', categoryId: 'c6', levels: ['view', 'edit'], status: 'pending',  requestedAt: '2026-04-09' },
  { id: 'r6', requester: 'Trần Văn Hùng',    groupId: 'g5', categoryId: 'c2', levels: ['edit'],         status: 'approved', requestedAt: '2026-04-08' },
]

// --- Audit Logs ---
export const auditLogs: AuditLog[] = [
  { id: 'al1',  timestamp: '2026-04-16 09:42:11', user: 'Nguyễn Thị Lan', module: 'KB Store',       action: 'create',  target: 'Marketing Assets',             detail: 'Created new KB category' },
  { id: 'al2',  timestamp: '2026-04-16 09:30:05', user: 'Trần Văn Hùng',     module: 'Document',       action: 'upload',  target: 'Product_v2.4_Release_Notes.pdf',detail: 'Uploaded to Product Documentation' },
  { id: 'al3',  timestamp: '2026-04-16 08:55:22', user: 'Nguyễn Thị Lan', module: 'Access Request', action: 'approve', target: 'Lê Thị Mai → Engineering Wiki',  detail: 'Approved View Only access. Comment: Looks good' },
  { id: 'al4',  timestamp: '2026-04-15 17:10:44', user: 'Lê Thị Mai',     module: 'KB Store',       action: 'update',  target: 'Engineering Wiki',              detail: 'Updated description and permission groups' },
  { id: 'al5',  timestamp: '2026-04-15 16:03:31', user: 'Phạm Văn Đức',     module: 'Document',       action: 'delete',  target: 'Old_Policy_2024.pdf',           detail: 'Deleted from HR Policies' },
  { id: 'al6',  timestamp: '2026-04-15 14:22:09', user: 'Nguyễn Thị Lan', module: 'Access Request', action: 'reject',  target: 'Hoàng Thị Thu → Legal & Compliance',detail: 'Rejected Edit access. Comment: Insufficient clearance' },
  { id: 'al7',  timestamp: '2026-04-15 13:45:00', user: 'Hoàng Thị Thu',    module: 'Document',       action: 'upload',  target: 'Sales_Script_Q2.docx',          detail: 'Uploaded to Sales Playbook' },
  { id: 'al8',  timestamp: '2026-04-15 11:30:18', user: 'Trần Văn Hùng',     module: 'KB Store',       action: 'access',  target: 'HR Policies',                   detail: 'Viewed KB category' },
  { id: 'al9',  timestamp: '2026-04-14 16:55:37', user: 'Lê Thị Mai',     module: 'Document',       action: 'upload',  target: 'System_Design_ADR.txt',         detail: 'Uploaded to Engineering Wiki' },
  { id: 'al10', timestamp: '2026-04-14 15:20:14', user: 'Nguyễn Thị Lan', module: 'KB Store',       action: 'update',  target: 'Product Documentation',         detail: 'Changed name and color tag' },
  { id: 'al11', timestamp: '2026-04-14 14:08:52', user: 'Phạm Văn Đức',     module: 'Access Request', action: 'approve', target: 'Trần Văn Hùng → Sales Playbook',    detail: 'Approved View Only access' },
  { id: 'al12', timestamp: '2026-04-13 10:33:41', user: 'Hoàng Thị Thu',    module: 'KB Store',       action: 'delete',  target: 'Archived Docs 2023',            detail: 'Deleted KB category' },
]

// --- Chat messages per category ---
export const chatMessages: Record<string, ChatMessage[]> = {
  c1: [
    { id: 'm1', role: 'assistant', content: 'Hello! I can answer questions about Product Documentation. What would you like to know?', timestamp: '10:00 AM' },
    { id: 'm2', role: 'user', content: 'What changed in v2.4?', timestamp: '10:01 AM' },
    { id: 'm3', role: 'assistant', content: 'Version 2.4 includes performance improvements to the mobile SDK, a new dark mode for the UI, and fixes for 3 critical bugs reported in v2.3. See the release notes for full details.', timestamp: '10:01 AM', sources: ['Product_v2.4_Release_Notes.pdf'] },
  ],
}

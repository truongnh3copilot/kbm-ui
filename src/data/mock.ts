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

export interface Feedback {
  id: string
  fromUser: string      // sender
  toUser: string        // KB owner / recipient
  categoryId: string
  subject: string
  message: string
  sentAt: string
  status: 'unread' | 'read' | 'resolved'
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

export interface User {
  id: string
  name: string
  email: string
  role: string
  groupIds: string[]   // a user can belong to multiple groups
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

// --- Users ---
export const users: User[] = [
  { id: 'u1',  name: 'Nguyễn Thị Lan',   email: 'lan.nguyen@company.vn',   role: 'Admin',              groupIds: ['g1', 'g2'] },
  { id: 'u2',  name: 'Trần Văn Hùng',    email: 'hung.tran@company.vn',    role: 'Engineer',           groupIds: ['g1'] },
  { id: 'u3',  name: 'Lê Thị Mai',       email: 'mai.le@company.vn',       role: 'Engineer',           groupIds: ['g1', 'g2'] },
  { id: 'u4',  name: 'Phạm Văn Đức',     email: 'duc.pham@company.vn',     role: 'Legal Counsel',      groupIds: ['g5'] },
  { id: 'u5',  name: 'Hoàng Thị Thu',    email: 'thu.hoang@company.vn',    role: 'Sales Manager',      groupIds: ['g2', 'g3'] },
  { id: 'u6',  name: 'Phòng Nhân Sự',    email: 'hr@company.vn',           role: 'HR Manager',         groupIds: ['g4'] },
  { id: 'u7',  name: 'Nguyễn Văn Minh',  email: 'minh.nguyen@company.vn',  role: 'Product Manager',    groupIds: ['g2'] },
  { id: 'u8',  name: 'Trần Thị Hoa',     email: 'hoa.tran@company.vn',     role: 'Sales Rep',          groupIds: ['g3'] },
  { id: 'u9',  name: 'Lê Văn Khoa',      email: 'khoa.le@company.vn',      role: 'Engineer',           groupIds: ['g1', 'g2', 'g3'] },
  { id: 'u10', name: 'Vũ Thị Linh',      email: 'linh.vu@company.vn',      role: 'Compliance Officer', groupIds: ['g4', 'g5'] },
]

// --- Current logged-in user ---
export const currentUser = {
  name: 'Nguyễn Thị Lan',
  role: 'Admin',
  groupIds: ['g1', 'g2'], // groups this user belongs to
}

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
// My Requests (requester = Nguyễn Thị Lan): covers pending / approved / rejected / multi-level
// Needs My Approval (groupId in g1|g2, requester != Nguyễn Thị Lan): covers pending / approved / rejected / with comments
export const accessRequests: AccessRequest[] = [
  // ── My Requests ──────────────────────────────────────────────────────────
  { id: 'r1',  requester: 'Nguyễn Thị Lan', groupId: 'g3', categoryId: 'c4', levels: ['view'],         status: 'pending',  requestedAt: '2026-04-16' },
  { id: 'r2',  requester: 'Nguyễn Thị Lan', groupId: 'g4', categoryId: 'c2', levels: ['view', 'edit'], status: 'pending',  requestedAt: '2026-04-15' },
  { id: 'r3',  requester: 'Nguyễn Thị Lan', groupId: 'g5', categoryId: 'c5', levels: ['view'],         status: 'approved', requestedAt: '2026-04-13', comment: 'Duyệt cho truy cập tài liệu pháp lý.', reviewedBy: 'Phạm Văn Đức' },
  { id: 'r4',  requester: 'Nguyễn Thị Lan', groupId: 'g3', categoryId: 'c6', levels: ['edit'],         status: 'approved', requestedAt: '2026-04-11', comment: 'OK, có thể chỉnh sửa.', reviewedBy: 'Hoàng Thị Thu' },
  { id: 'r5',  requester: 'Nguyễn Thị Lan', groupId: 'g4', categoryId: 'c1', levels: ['view', 'edit'], status: 'rejected', requestedAt: '2026-04-10', comment: 'Chưa đủ thẩm quyền để chỉnh sửa.', reviewedBy: 'Lê Thị Mai' },
  { id: 'r6',  requester: 'Nguyễn Thị Lan', groupId: 'g5', categoryId: 'c3', levels: ['view'],         status: 'rejected', requestedAt: '2026-04-08', comment: 'Nội dung nội bộ, không chia sẻ.', reviewedBy: 'Phạm Văn Đức' },

  // ── Needs My Approval (groupId = g1 or g2) ───────────────────────────────
  { id: 'r7',  requester: 'Trần Văn Hùng',  groupId: 'g1', categoryId: 'c3', levels: ['view'],         status: 'pending',  requestedAt: '2026-04-16' },
  { id: 'r8',  requester: 'Lê Thị Mai',     groupId: 'g2', categoryId: 'c1', levels: ['view', 'edit'], status: 'pending',  requestedAt: '2026-04-15' },
  { id: 'r9',  requester: 'Phạm Văn Đức',   groupId: 'g1', categoryId: 'c6', levels: ['edit'],         status: 'pending',  requestedAt: '2026-04-14' },
  { id: 'r10', requester: 'Hoàng Thị Thu',  groupId: 'g2', categoryId: 'c4', levels: ['view'],         status: 'approved', requestedAt: '2026-04-13', comment: 'Cho phép xem tài liệu bán hàng.', reviewedBy: 'Nguyễn Thị Lan' },
  { id: 'r11', requester: 'Trần Văn Hùng',  groupId: 'g1', categoryId: 'c1', levels: ['view', 'edit'], status: 'approved', requestedAt: '2026-04-11', comment: 'Đã xác nhận với trưởng nhóm.', reviewedBy: 'Nguyễn Thị Lan' },
  { id: 'r12', requester: 'Lê Thị Mai',     groupId: 'g2', categoryId: 'c6', levels: ['edit'],         status: 'rejected', requestedAt: '2026-04-10', comment: 'Chưa hoàn thành đào tạo bắt buộc.', reviewedBy: 'Nguyễn Thị Lan' },
  { id: 'r13', requester: 'Phạm Văn Đức',   groupId: 'g1', categoryId: 'c3', levels: ['view'],         status: 'rejected', requestedAt: '2026-04-09', comment: 'Không thuộc phạm vi công việc.', reviewedBy: 'Nguyễn Thị Lan' },
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

// --- Feedback ---
export const feedbacks: Feedback[] = [
  { id: 'fb1',  fromUser: 'Trần Văn Hùng',   toUser: 'Nguyễn Thị Lan',  categoryId: 'c1', subject: 'Tài liệu phiên bản 2.4 thiếu phần hướng dẫn cài đặt', message: 'Chào chị Lan,\n\nEm đọc tài liệu Product v2.4 nhưng không thấy phần hướng dẫn cài đặt cho môi trường Linux. Chị có thể bổ sung thêm không ạ? Em cần tham khảo để triển khai cho khách hàng.', sentAt: '2026-04-16 10:15:00', status: 'unread' },
  { id: 'fb2',  fromUser: 'Lê Thị Mai',       toUser: 'Nguyễn Thị Lan',  categoryId: 'c1', subject: 'Cần cập nhật API Reference cho endpoint mới', message: 'Hi Lan,\n\nAPI Reference hiện tại chưa có tài liệu cho các endpoint /v2/webhooks vừa ra mắt tuần trước. Team backend đã deploy rồi nhưng chưa có docs. Bạn có thể nhờ ai update không?', sentAt: '2026-04-15 16:40:22', status: 'unread' },
  { id: 'fb3',  fromUser: 'Nguyễn Văn Minh',  toUser: 'Lê Thị Mai',      categoryId: 'c3', subject: 'Runbook triển khai cần bổ sung bước rollback', message: 'Chào Mai,\n\nMình đọc Deployment Runbook thấy thiếu phần hướng dẫn rollback khi deploy thất bại. Lần trước incident xảy ra mà không có quy trình rõ ràng nên mất khá nhiều thời gian xử lý. Mong bạn bổ sung thêm nhé.', sentAt: '2026-04-15 14:20:05', status: 'read' },
  { id: 'fb4',  fromUser: 'Hoàng Thị Thu',    toUser: 'Lê Thị Mai',      categoryId: 'c3', subject: 'Tài liệu Architecture Overview rất hữu ích!', message: 'Chào Mai,\n\nMình vừa đọc xong tài liệu Architecture Overview và thấy rất chi tiết, dễ hiểu. Cảm ơn bạn đã dành thời gian viết tài liệu này. Phần diagram hệ thống đặc biệt rõ ràng và giúp mình hiểu nhanh luồng xử lý. 👍', sentAt: '2026-04-14 11:30:45', status: 'resolved' },
  { id: 'fb5',  fromUser: 'Phạm Văn Đức',     toUser: 'Phòng Nhân Sự',   categoryId: 'c2', subject: 'Chính sách làm việc từ xa cần được cập nhật', message: 'Kính gửi Phòng Nhân Sự,\n\nChính sách làm việc từ xa trong Employee Handbook 2026 chưa đề cập đến quy định về bảo mật thông tin khi làm việc ngoài văn phòng. Đề nghị bổ sung phần này để nhân viên nắm rõ trách nhiệm.', sentAt: '2026-04-14 09:05:18', status: 'read' },
  { id: 'fb6',  fromUser: 'Trần Thị Hoa',     toUser: 'Hoàng Thị Thu',   categoryId: 'c4', subject: 'Script bán hàng Q2 cần thêm kịch bản xử lý từ chối', message: 'Chị Thu ơi,\n\nEm dùng Sales Script Q2 nhưng thấy chưa có phần xử lý khi khách hàng từ chối vì giá. Chị có thể bổ sung thêm một số mẫu câu phản hồi không ạ? Em nghĩ sẽ rất hữu ích cho cả team.', sentAt: '2026-04-13 15:55:30', status: 'unread' },
  { id: 'fb7',  fromUser: 'Lê Văn Khoa',      toUser: 'Nguyễn Thị Lan',  categoryId: 'c1', subject: 'Integration Checklist thiếu bước kiểm tra SSL', message: 'Chào chị,\n\nEm vừa hoàn thành integration cho client ABC và phát hiện trong Checklist chưa có bước verify SSL certificate. Đây là bước quan trọng nên em đề xuất bổ sung vào tài liệu ạ.', sentAt: '2026-04-13 10:22:14', status: 'resolved' },
  { id: 'fb8',  fromUser: 'Vũ Thị Linh',      toUser: 'Phạm Văn Đức',    categoryId: 'c5', subject: 'Compliance checklist 2026 đã được cập nhật chưa?', message: 'Anh Đức ơi,\n\nEm cần xác nhận Compliance Checklist đã được cập nhật theo quy định mới của Nghị định 13/2023 chưa ạ? Tháng sau có đợt kiểm tra nội bộ nên cần tài liệu chính xác.', sentAt: '2026-04-12 14:10:00', status: 'read' },
  { id: 'fb9',  fromUser: 'Nguyễn Thị Lan',   toUser: 'Hoàng Thị Thu',   categoryId: 'c6', subject: 'Brand guideline cần bổ sung màu sắc cho digital ads', message: 'Thu ơi,\n\nMình đang làm campaign Q2 nhưng Brand Guideline chưa có phần màu sắc và font chữ cho digital ads (banner, social media). Bạn có thể cập nhật phần này không? Deadline tuần tới rồi.', sentAt: '2026-04-12 09:48:33', status: 'resolved' },
  { id: 'fb10', fromUser: 'Phòng Nhân Sự',    toUser: 'Nguyễn Thị Lan',  categoryId: 'c2', subject: 'Onboarding checklist cần link tới tài khoản hệ thống', message: 'Chào chị Lan,\n\nOnboarding Checklist hiện tại chưa có link hoặc hướng dẫn tạo tài khoản cho các hệ thống nội bộ (Jira, Confluence, Slack). Nhân viên mới hay hỏi mà không biết chỉ đường. Chị có thể bổ sung giúp không ạ?', sentAt: '2026-04-11 13:25:47', status: 'unread' },
  { id: 'fb11', fromUser: 'Trần Văn Hùng',    toUser: 'Lê Thị Mai',      categoryId: 'c3', subject: 'ADR cho microservices cần thêm section về observability', message: 'Chào Mai,\n\nMình đọc Architecture Decision Record thấy chưa có phần về observability strategy (logging, metrics, tracing). Đây là phần quan trọng khi team muốn mở rộng hệ thống. Bạn có kế hoạch bổ sung không?', sentAt: '2026-04-10 16:00:00', status: 'resolved' },
  { id: 'fb12', fromUser: 'Lê Văn Khoa',      toUser: 'Hoàng Thị Thu',   categoryId: 'c4', subject: 'Case study khách hàng XYZ rất ấn tượng', message: 'Chào chị Thu,\n\nEm vừa đọc case study về khách hàng XYZ trong Sales Playbook và thấy rất ấn tượng. Cách trình bày số liệu ROI rất thuyết phục. Em sẽ dùng làm tham khảo cho pitch deck tuần tới. Cảm ơn chị!', sentAt: '2026-04-09 08:30:22', status: 'read' },
]

// --- Chat messages per category ---
export const chatMessages: Record<string, ChatMessage[]> = {
  c1: [
    { id: 'm1', role: 'assistant', content: 'Hello! I can answer questions about Product Documentation. What would you like to know?', timestamp: '10:00 AM' },
    { id: 'm2', role: 'user', content: 'What changed in v2.4?', timestamp: '10:01 AM' },
    { id: 'm3', role: 'assistant', content: 'Version 2.4 includes performance improvements to the mobile SDK, a new dark mode for the UI, and fixes for 3 critical bugs reported in v2.3. See the release notes for full details.', timestamp: '10:01 AM', sources: ['Product_v2.4_Release_Notes.pdf'] },
  ],
}

'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, Cell,
} from 'recharts'
import { documentsByCategory, uploadTrend, heartVotesByKB, apiRequestsByKB, apiRequestsTrend } from '@/data/mock'
import { Heart, Zap } from 'lucide-react'

const HEART_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#14b8a6',
]


function HeartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow px-3 py-2 text-xs">
      <p className="font-medium text-gray-700 mb-0.5">{payload[0].payload.name}</p>
      <p className="flex items-center gap-1 text-red-500 font-semibold">
        <Heart size={10} className="fill-red-500" /> {payload[0].value} votes
      </p>
    </div>
  )
}


const sortedByVotes = [...heartVotesByKB].sort((a, b) => b.votes - a.votes).slice(0, 10)



export default function Charts() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Bar chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Documents by Category</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={documentsByCategory} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Bar dataKey="docs" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Upload Trend (6 months)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={uploadTrend} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="uploads" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>


      {/* API Requests charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Bar — total requests + errors per KB */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={15} className="text-blue-500" />
            <h3 className="text-sm font-semibold text-gray-700">API Requests per KB</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={apiRequestsByKB} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="requests" name="Requests" fill="#3b82f6" radius={[4,4,0,0]} />
              <Bar dataKey="errors"   name="Errors"   fill="#ef4444" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line — request trend (top 3 KBs) */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={15} className="text-blue-500" />
            <h3 className="text-sm font-semibold text-gray-700">API Request Trend (Top 3 KBs)</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={apiRequestsTrend} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="c1" name="Product Docs" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="c3" name="Eng Wiki"     stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="c6" name="Marketing"    stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Heart votes chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Heart size={15} className="fill-red-500 text-red-500" />
          <h3 className="text-sm font-semibold text-gray-700">Top KB by Heart Votes</h3>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart
            data={sortedByVotes}
            layout="vertical"
            margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#6b7280' }} />
            <YAxis
              type="category"
              dataKey="name"
              width={160}
              tick={{ fontSize: 11, fill: '#374151' }}
            />
            <Tooltip content={<HeartTooltip />} />
            <Bar dataKey="votes" radius={[0, 4, 4, 0]} maxBarSize={28}>
              {sortedByVotes.map((_, i) => (
                <Cell key={i} fill={HEART_COLORS[i % HEART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

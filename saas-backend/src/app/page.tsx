// saas-backend/src/app/page.tsx

import prisma from '@/src/lib/prisma';
import { revalidatePath } from 'next/cache';

// Next.js Server Action to manually refresh the data
async function refreshData() {
  'use server';
  revalidatePath('/');
}

export default async function Dashboard() {
  // Fetch all leads from the database, ordered by newest first
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">ClawRouter Leads</h1>
            <p className="text-gray-500 mt-1">Real-time leads extracted via Telegram AI Agents.</p>
          </div>
          <form action={refreshData}>
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Refresh Data
            </button>
          </form>
        </header>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm uppercase text-gray-500">
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Company Size</th>
                <th className="px-6 py-4 font-semibold">Use Case</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No leads captured yet. Send a message to your Telegram bot to get started!
                  </td>
                </tr>
              ) : (
                leads.map((lead:any) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{lead.email}</td>
                    <td className="px-6 py-4">{lead.companySize || '-'}</td>
                    <td className="px-6 py-4 truncate max-w-xs" title={lead.useCase || ''}>
                      {lead.useCase || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
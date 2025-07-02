import { AdminDashboard } from '@/components/admin/admin-dashboard'
import { fetchBusinessRecords } from '@/actions/admin-actions'

export default async function DashboardPage() {
  try {
    // Fetch business records
    const { records, error } = await fetchBusinessRecords()

    // Render the dashboard
    return (
      <div className="p-4 md:p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-900/20 border border-red-700 rounded-md text-red-500">
            <p className="font-bold">Error loading data:</p>
            <p>{error}</p>
          </div>
        )}
        <AdminDashboard initialData={records} initialError={error} />
      </div>
    )
  } catch (error) {
    console.error('Error in dashboard page:', error)
    return (
      <div className="p-4 md:p-6">
        <div className="mb-4 p-4 bg-red-900/20 border border-red-700 rounded-md text-red-500">
          <p className="font-bold">Error loading dashboard:</p>
          <p>{error instanceof Error ? error.message : 'An unexpected error occurred'}</p>
        </div>
        <AdminDashboard initialData={[]} initialError="Failed to load data" />
      </div>
    )
  }
}

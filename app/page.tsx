import { DashboardPage } from "@/components/dashboard/dashboard-page"

export default function Home() {
  // In a real app, we would check if the user is logged in server-side
  // For now, we'll redirect to the login page
  // This would be replaced with actual server-side auth check

  // Uncomment this to enable redirect to login
  // redirect('/login');

  return <DashboardPage />
}

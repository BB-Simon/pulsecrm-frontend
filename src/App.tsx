import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/app-layout'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { UpgradeRequiredDialog } from '@/components/billing/upgrade-required-dialog'
import { LoginPage } from '@/pages/login-page'
import { SignupPage } from '@/pages/signup-page'
import { AcceptInvitePage } from '@/pages/accept-invite-page'
import { DashboardPage } from '@/pages/dashboard-page'
import { ContactsPage } from '@/pages/contacts-page'
import { ContactDetailPage } from '@/pages/contact-detail-page'
import { DealsPage } from '@/pages/deals-page'
import { DealDetailPage } from '@/pages/deal-detail-page'
import { TasksPage } from '@/pages/tasks-page'
import { CalendarPage } from '@/pages/calendar-page'
import { SettingsPage } from '@/pages/settings-page'
import { BillingPage } from '@/pages/billing-page'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/accept-invite" element={<AcceptInvitePage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/contacts/:id" element={<ContactDetailPage />} />
            <Route path="/deals" element={<DealsPage />} />
            <Route path="/deals/:id" element={<DealDetailPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/billing" element={<BillingPage />} />
            {/* Stripe's checkout/portal return_url is hardcoded to /billing */}
            <Route path="/billing" element={<BillingPage />} />
          </Route>
        </Route>
      </Routes>

      <UpgradeRequiredDialog />
    </>
  )
}

export default App

import { AppSidebar } from "@/components/modules/dashboard/sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import DashboardNavbar from "@/components/modules/dashboard/navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardNavbar />
        <div className="p-6 min-h-screen bg-muted/10">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}

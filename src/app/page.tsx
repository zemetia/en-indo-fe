
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, CalendarDays, Shapes, Users } from 'lucide-react';
import { AttendanceChart } from '@/components/dashboard/attendance-chart';
import { Separator } from '@/components/ui/separator';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground font-headline">Dashboard</h1>
        <p className="text-muted-foreground">A summary of church health and engagement.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-center gap-4">
                <div className="flex flex-col items-center justify-center p-2 rounded-md bg-secondary">
                  <span className="text-sm font-bold text-secondary-foreground">JUL</span>
                  <span className="text-lg font-bold text-primary">28</span>
                </div>
                <div>
                  <p className="font-semibold">Sunday Service</p>
                  <p className="text-sm text-muted-foreground">10:00 AM - Main Hall</p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="flex flex-col items-center justify-center p-2 rounded-md bg-secondary">
                  <span className="text-sm font-bold text-secondary-foreground">AUG</span>
                  <span className="text-lg font-bold text-primary">03</span>
                </div>
                <div>
                  <p className="font-semibold">Youth Night</p>
                  <p className="text-sm text-muted-foreground">7:00 PM - Youth Center</p>
                </div>
              </li>
              <li className="flex items-center gap-4">
                <div className="flex flex-col items-center justify-center p-2 rounded-md bg-secondary">
                  <span className="text-sm font-bold text-secondary-foreground">AUG</span>
                  <span className="text-lg font-bold text-primary">17</span>
                </div>
                <div>
                  <p className="font-semibold">Community Outreach</p>
                  <p className="text-sm text-muted-foreground">9:00 AM - City Park</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Attendance Overview</CardTitle>
            <BarChart className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <AttendanceChart />
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
            <CardHeader>
                <CardTitle className="text-sm font-medium">Key Statistics</CardTitle>
            </CardHeader>
            <CardContent>
                 <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-secondary">
                           <Users className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">482</p>
                            <p className="text-sm text-muted-foreground">Total Members</p>
                        </div>
                    </div>
                     <div className="flex items-center gap-4">
                        <div className="p-3 rounded-lg bg-secondary">
                           <Shapes className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">12</p>
                            <p className="text-sm text-muted-foreground">Active Ministries</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>

      </div>
    </div>
  );
}

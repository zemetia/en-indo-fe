
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const members = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+62 812-3456-7890",
    joined: "2023-01-15",
    ministry: "Music",
    status: "Active"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+62 812-3456-7891",
    joined: "2023-02-20",
    ministry: "Kids",
    status: "Active"
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    phone: "+62 812-3456-7892",
    joined: "2022-11-10",
    ministry: "Usher",
    status: "Active"
  },
  {
    id: "4",
    name: "Sarah Lee",
    email: "sarah.lee@example.com",
    phone: "+62 812-3456-7893",
    joined: "2023-05-01",
    ministry: "Community Group",
    status: "Active"
  },
  {
    id: "5",
    name: "David Garcia",
    email: "david.garcia@example.com",
    phone: "+62 812-3456-7894",
    joined: "2023-08-12",
    ministry: "N/A",
    status: "New"
  },
];

export default function MembersPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold text-foreground font-headline">Member Management</h1>
            <p className="text-muted-foreground">View, add, and manage church members.</p>
        </div>
        <Button>
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Contact</TableHead>
                <TableHead className="hidden lg:table-cell">Joined Date</TableHead>
                <TableHead>Ministry</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground md:hidden">{member.email}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div>{member.email}</div>
                    <div className="text-sm text-muted-foreground">{member.phone}</div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">{new Date(member.joined).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={member.ministry === "N/A" ? "secondary" : "default"}>{member.ministry}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-8 h-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

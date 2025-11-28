import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Home, BookOpen, Users, MessageSquare, Bell, User, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/overlay";
import { Avatar, AvatarFallback } from "@/components/ui/display";

interface NavbarProps {
  user: any;
}

const Navbar = ({ user }: NavbarProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border backdrop-blur-sm bg-card/95 shadow-[var(--shadow-card)]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary transition-transform group-hover:scale-105">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-primary)' }}>
              EduConnect
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            <Button variant="ghost" asChild className="hover:bg-muted">
              <Link to="/" className="flex items-center space-x-2">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
            </Button>
            <Button variant="ghost" asChild className="hover:bg-muted">
              <Link to="/courses" className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>Courses</span>
              </Link>
            </Button>
            <Button variant="ghost" asChild className="hover:bg-muted">
              <Link to="/groups" className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Groups</span>
              </Link>
            </Button>
            <Button variant="ghost" asChild className="hover:bg-muted">
              <Link to="/messages" className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>Messages</span>
              </Link>
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative hover:bg-muted">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.user_metadata?.name ? getInitials(user.user_metadata.name) : <User className="w-5 h-5" />}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

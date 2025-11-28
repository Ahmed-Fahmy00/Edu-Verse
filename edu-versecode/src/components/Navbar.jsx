import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  GraduationCap,
  Home,
  BookOpen,
  Users,
  MessageSquare,
  Bell,
  User,
  LogOut,
} from "lucide-react";
import { clearSession } from "../api/session";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/overlay";
import { Avatar, AvatarFallback } from "./ui/display";

const styles = {
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderBottom: "1px solid #ccc",
    backdropFilter: "blur(10px)",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "64px",
  },
  logoLink: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    color: "inherit",
  },
  logoIconWrapper: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0d6efd",
    transition: "transform 0.2s",
    marginRight: "8px",
  },
  logoText: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    backgroundImage: "linear-gradient(90deg,#0d6efd,#6610f2)",
    WebkitBackgroundClip: "text",
    color: "transparent",
  },
  menu: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  menuButton: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "6px",
  },
  iconButton: {
    position: "relative",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "50%",
  },
  notificationDot: {
    position: "absolute",
    top: "4px",
    right: "4px",
    width: "8px",
    height: "8px",
    backgroundColor: "#dc3545",
    borderRadius: "50%",
  },
  dropdownContent: {
    width: "224px",
  },
  destructiveItem: {
    color: "#dc3545",
    cursor: "pointer",
  },
};

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    clearSession();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <Link to="/" style={styles.logoLink}>
          <div style={styles.logoIconWrapper}>
            <GraduationCap
              style={{ width: "24px", height: "24px", color: "#fff" }}
            />
          </div>
          <span style={styles.logoText}>EduConnect</span>
        </Link>

        <div style={styles.menu}>
          <Button variant="ghost" asChild>
            <Link to="/" style={styles.menuButton}>
              <Home style={{ width: "16px", height: "16px" }} />
              <span>Home</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/courses" style={styles.menuButton}>
              <BookOpen style={{ width: "16px", height: "16px" }} />
              <span>Courses</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/chats" style={styles.menuButton}>
              <MessageSquare style={{ width: "16px", height: "16px" }} />
              <span>Chats</span>
            </Link>
          </Button>
        </div>

        <div style={styles.menu}>
          <button style={styles.iconButton}>
            <Bell style={{ width: "20px", height: "20px" }} />
            <span style={styles.notificationDot}></span>
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" style={styles.iconButton}>
                <Avatar>
                  <AvatarFallback
                    style={{ backgroundColor: "#0d6efd", color: "#fff" }}
                  >
                    {user?.user_metadata?.name ? (
                      getInitials(user.user_metadata.name)
                    ) : (
                      <User style={{ width: "20px", height: "20px" }} />
                    )}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" style={styles.dropdownContent}>
              <DropdownMenuItem asChild>
                <Link to="/profile" style={styles.menuButton}>
                  <User
                    style={{
                      width: "16px",
                      height: "16px",
                      marginRight: "8px",
                    }}
                  />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                style={styles.destructiveItem}
              >
                <LogOut
                  style={{ width: "16px", height: "16px", marginRight: "8px" }}
                />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

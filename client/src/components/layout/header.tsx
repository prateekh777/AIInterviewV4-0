import React from "react";
import { Link, useLocation } from "wouter";
import Logo from "../ui/logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, MessageSquare, Globe, HelpCircle } from "lucide-react";

const Header: React.FC = () => {
  // Get user from localStorage directly for now
  // This is a temporary solution until we fully implement auth context
  const [user, setUser] = React.useState<any>(null);
  const [, navigate] = useLocation();
  
  // Initialize user from localStorage
  React.useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/sign-in");
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "All jobs", path: "/jobs" },
    { label: "Categories", path: "/categories" },
    { label: "People", path: "/people" },
    { label: "Career Advisors", path: "/advisors" },
  ];

  const [currentPath] = useLocation();

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/">
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <span 
                  className={`text-sm font-medium cursor-pointer ${
                    window.location.pathname === item.path
                      ? "text-primary hover:text-primary-dark"
                      : "text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-3">
          {!user ? (
            <div className="flex space-x-2">
              <Link href="/sign-in">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          ) : (
            <>
              <button className="text-neutral-500 hover:text-neutral-800 p-1.5 rounded-full bg-neutral-100">
                <Bell className="h-4 w-4" />
              </button>
              <button className="text-neutral-500 hover:text-neutral-800 p-1.5 rounded-full bg-neutral-100">
                <MessageSquare className="h-4 w-4" />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white cursor-pointer">
                    <span className="text-sm font-medium">
                      {user.fullName
                        ? `${user.fullName.split(" ")[0][0]}${
                            user.fullName.split(" ")[1]?.[0] || ""
                          }`
                        : user.username.substring(0, 2).toUpperCase()}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center gap-2 p-2">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                      <span className="text-sm font-medium">
                        {user.fullName
                          ? `${user.fullName.split(" ")[0][0]}${
                              user.fullName.split(" ")[1]?.[0] || ""
                            }`
                          : user.username.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {user.fullName || user.username}
                      </p>
                      <p className="text-xs text-neutral-500">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <span className="cursor-pointer w-full">Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/applications">
                      <span className="cursor-pointer w-full">My Applications</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/saved-jobs">
                      <span className="cursor-pointer w-full">Saved Jobs</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          <div className="flex items-center space-x-3 ml-2">
            <button className="text-neutral-600 hover:text-neutral-800">
              <Globe className="h-4 w-4" />
            </button>
            <button className="text-neutral-600 hover:text-neutral-800">
              <HelpCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

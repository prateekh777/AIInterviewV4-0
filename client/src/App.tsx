import React, { useEffect, useState, useContext } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient, apiRequest } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import SignUp from "@/pages/sign-up";
import SignIn from "@/pages/sign-in";
import Jobs from "@/pages/jobs";
import JobDetails from "@/pages/job-details";
import { User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  refreshUser: () => Promise<User | null>;
}

// Create an auth context to manage user authentication
export const AuthContext = React.createContext<AuthContextType | null>(null);

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

function Router() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  // Login function that stores user in state and localStorage
  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    toast({
      title: "Login successful",
      description: `Welcome back, ${userData.fullName || userData.username}!`,
    });
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    queryClient.clear();
    navigate("/sign-in");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  // Function to refresh user data from server
  const refreshUser = async (): Promise<User | null> => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return null;
      
      const parsedUser = JSON.parse(storedUser);
      if (!parsedUser.id) return null;
      
      const res = await apiRequest("GET", "/api/user", undefined, true);
      const userData = await res.json();
      
      // Update stored user data
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error("Failed to refresh user:", error);
      return null;
    }
  };

  // Check if user is already logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Try to refresh the user data from server
          try {
            await refreshUser();
          } catch (err) {
            console.log("Could not refresh user data from server");
          }
        }
      } catch (error) {
        console.error("Auth error:", error);
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refreshUser }}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/sign-up" component={SignUp} />
        <Route path="/sign-in" component={SignIn} />
        <Route path="/jobs" component={Jobs} />
        <Route path="/jobs/:id" component={JobDetails} />
        <Route component={NotFound} />
      </Switch>
    </AuthContext.Provider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

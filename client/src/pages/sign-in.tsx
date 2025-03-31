import React, { useState, useContext } from "react";
import { useLocation } from "wouter";
import Logo from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Globe, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { AuthContext } from "@/App";

const SignIn: React.FC = () => {
  const [, navigate] = useLocation();
  const { setUser } = useContext(AuthContext);
  const { toast } = useToast();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!credentials.username || !credentials.password) {
      toast({
        title: "Missing information",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      setIsSigningIn(true);
      
      // Show loading state for a moment
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await apiRequest("POST", "/api/auth/login", credentials);
      const userData = await response.json();
      
      // Save user to context and localStorage
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in",
      });
      
      navigate("/jobs");
    } catch (error) {
      console.error("Login error:", error);
      setIsSigningIn(false);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid username or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If already in the signing in state, show loading screen
  if (isSigningIn) {
    return (
      <div className="min-h-screen">
        <header className="border-b border-neutral-200">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Logo />
            <div className="flex items-center space-x-4">
              <button className="text-neutral-600 hover:text-neutral-800">
                <Globe className="h-4 w-4" />
              </button>
              <button className="text-neutral-600 hover:text-neutral-800">
                <HelpCircle className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>
        
        <main className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
          <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="relative w-full md:w-1/2 max-w-md mx-auto md:mx-0">
              <div className="w-72 h-72 bg-primary-light rounded-full mx-auto relative">
                <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" alt="Professional woman" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 object-cover rounded-full" />
                
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
                  <div className="w-10 h-10 bg-teal-200 rounded-full overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" alt="User" className="w-full h-full object-cover" />
                  </div>
                </div>
                
                <div className="absolute top-12 -right-4 w-16 h-16 bg-primary-light rounded-full flex items-center justify-center">
                  <div className="w-14 h-14 bg-blue-200 rounded-full overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" alt="User" className="w-full h-full object-cover" />
                  </div>
                </div>
                
                <div className="absolute -bottom-2 left-10 flex space-x-2">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-comment-dots text-blue-500"></i>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-comment-dots text-purple-500"></i>
                  </div>
                </div>
                
                <div className="absolute bottom-16 -right-2 w-6 h-6 bg-pink-300 rounded-full"></div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 max-w-md mx-auto md:mx-0">
              <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-semibold text-neutral-800 mb-1">Welcome back 👋</h2>
                  <p className="text-neutral-500">Log in your account</p>
                </div>
                
                <div className="flex justify-center my-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
                
                <div className="text-center text-neutral-600 my-6">
                  Just one second...
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-neutral-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <div className="flex items-center space-x-4">
            <button className="text-neutral-600 hover:text-neutral-800">
              <Globe className="h-4 w-4" />
            </button>
            <button className="text-neutral-600 hover:text-neutral-800">
              <HelpCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
        <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="relative w-full md:w-1/2 max-w-md mx-auto md:mx-0">
            <div className="w-72 h-72 bg-primary-light rounded-full mx-auto relative">
              <img src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" alt="Professional woman" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 object-cover rounded-full" />
              
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
                <div className="w-10 h-10 bg-teal-200 rounded-full overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" alt="User" className="w-full h-full object-cover" />
                </div>
              </div>
              
              <div className="absolute top-12 -right-4 w-16 h-16 bg-primary-light rounded-full flex items-center justify-center">
                <div className="w-14 h-14 bg-blue-200 rounded-full overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" alt="User" className="w-full h-full object-cover" />
                </div>
              </div>
              
              <div className="absolute -bottom-2 left-10 flex space-x-2">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-comment-dots text-blue-500"></i>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-comment-dots text-purple-500"></i>
                </div>
              </div>
              
              <div className="absolute bottom-16 -right-2 w-6 h-6 bg-pink-300 rounded-full"></div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 max-w-md mx-auto md:mx-0">
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-semibold text-neutral-800 mb-1">Welcome back 👋</h2>
                <p className="text-neutral-500">Log in your account</p>
              </div>
              
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <Label htmlFor="username" className="block text-sm font-medium text-neutral-700 mb-1">
                    <i className="fas fa-envelope mr-1 text-neutral-400"></i> Username or Email
                  </Label>
                  <Input 
                    type="text" 
                    id="username" 
                    name="username"
                    value={credentials.username}
                    onChange={handleInputChange}
                    className="w-full p-2.5 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-primary" 
                    required
                  />
                </div>
                
                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                      <i className="fas fa-lock mr-1 text-neutral-400"></i> Password
                    </Label>
                  </div>
                  <div className="relative">
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      id="password" 
                      name="password"
                      value={credentials.password}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-primary" 
                      required
                    />
                    <button 
                      type="button" 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Checkbox 
                      id="remember-me"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked === true)}
                      className="h-4 w-4 text-primary border-neutral-300 rounded focus:ring-primary"
                    />
                    <Label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700">
                      Remember me
                    </Label>
                  </div>
                  <a href="#" className="text-sm text-primary hover:text-primary-dark">
                    Forgot password?
                  </a>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full py-2.5"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Continue"}
                </Button>
              </form>
              
              <div className="mt-6 text-center text-sm">
                <p>Don't have an account? <a href="#" className="text-primary font-medium" onClick={(e) => { e.preventDefault(); navigate("/sign-up"); }}>Sign up</a></p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignIn;

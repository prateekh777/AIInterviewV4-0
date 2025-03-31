import React, { useState, useContext } from "react";
import { useLocation } from "wouter";
import Logo from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, Globe, HelpCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { AuthContext } from "@/App";

const SignUp: React.FC = () => {
  const [, navigate] = useLocation();
  const { setUser } = useContext(AuthContext);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"options" | "email">("options");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters",
        variant: "destructive",
      });
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const userData = await apiRequest("POST", "/api/auth/register", {
        username: formData.username || formData.email.split("@")[0],
        email: formData.email,
        password: formData.password,
      });
      
      // Save user to context and localStorage
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      
      toast({
        title: "Account created",
        description: "You have successfully created an account",
      });
      
      navigate("/jobs");
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
                <h2 className="text-2xl font-semibold text-neutral-800 mb-1">Let's Get Started 🚀</h2>
                <p className="text-neutral-500">Sign up your account</p>
              </div>
              
              {step === "options" ? (
                <div className="space-y-3">
                  <Button 
                    variant="outline"
                    className="w-full py-2.5 px-4 border border-neutral-300 rounded-lg flex items-center justify-center text-neutral-700 hover:bg-neutral-50 transition duration-150"
                    onClick={() => setStep("email")}
                  >
                    <Mail className="h-5 w-5 mr-3 text-neutral-500" />
                    Sign Up with Email
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full py-2.5 px-4 border border-neutral-300 rounded-lg flex items-center justify-center text-neutral-700 hover:bg-neutral-50 transition duration-150"
                    onClick={() => toast({
                      title: "Not implemented",
                      description: "Social sign-up is not available in this demo",
                    })}
                  >
                    <i className="fab fa-google mr-3 text-red-500"></i>
                    Sign up with Google
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full py-2.5 px-4 border border-neutral-300 rounded-lg flex items-center justify-center text-neutral-700 hover:bg-neutral-50 transition duration-150"
                    onClick={() => toast({
                      title: "Not implemented",
                      description: "Social sign-up is not available in this demo",
                    })}
                  >
                    <i className="fab fa-facebook-f mr-3 text-blue-600"></i>
                    Sign up with Facebook
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full py-2.5 px-4 border border-neutral-300 rounded-lg flex items-center justify-center text-neutral-700 hover:bg-neutral-50 transition duration-150"
                    onClick={() => toast({
                      title: "Not implemented",
                      description: "Social sign-up is not available in this demo",
                    })}
                  >
                    <i className="fab fa-apple mr-3"></i>
                    Sign up with Apple
                  </Button>
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <Label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                      <Mail className="inline-block mr-1 h-4 w-4 text-neutral-400" /> What is your e-mail?
                    </Label>
                    <Input 
                      type="email" 
                      id="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-primary" 
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="username" className="block text-sm font-medium text-neutral-700 mb-1">
                      <i className="fas fa-user mr-1 text-neutral-400"></i> Username (optional)
                    </Label>
                    <Input 
                      type="text" 
                      id="username" 
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full p-2.5 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-primary" 
                      placeholder="Choose a username"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                      <Lock className="inline-block mr-1 h-4 w-4 text-neutral-400" /> Enter your password
                    </Label>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        id="password" 
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full p-2.5 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-primary" 
                        placeholder="Create a secure password"
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
                  
                  <div>
                    <Label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                      <Lock className="inline-block mr-1 h-4 w-4 text-neutral-400" /> Confirm your password
                    </Label>
                    <div className="relative">
                      <Input 
                        type={showConfirmPassword ? "text" : "password"} 
                        id="confirmPassword" 
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full p-2.5 rounded-lg border border-neutral-300 focus:ring-2 focus:ring-primary focus:border-primary" 
                        placeholder="Confirm your password"
                        required
                      />
                      <button 
                        type="button" 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full py-2.5"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Continue"}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="link"
                    className="w-full py-2.5"
                    onClick={() => setStep("options")}
                  >
                    Back to options
                  </Button>
                </form>
              )}
              
              <div className="mt-6 text-center text-sm text-neutral-500">
                <p>By continuing you agree to our <a href="#" className="text-neutral-800 font-medium">Terms & Conditions</a> and <a href="#" className="text-neutral-800 font-medium">Privacy Policy</a></p>
              </div>
              
              <div className="mt-6 text-center text-sm">
                <p>Already have an account? <a href="#" className="text-primary font-medium" onClick={(e) => { e.preventDefault(); navigate("/sign-in"); }}>Log in</a></p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignUp;

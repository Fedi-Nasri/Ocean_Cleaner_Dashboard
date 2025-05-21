
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Waves, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { authenticateUser } from "@/lib/auth";
import { useAuth } from "@/contexts/AuthContext";

// Define the form schema with validation rules
const formSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  password: z.string().min(2, {
    message: "Password must be at least 6 characters.",
  }),
});

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Initialize the form with zod resolver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      // Attempt to authenticate the user using the Firebase service
      const result = await authenticateUser(values.username, values.password);
      
      if (result.success && result.role) {
        // Log the user's role for development purposes
        console.log(`User authenticated successfully. Role: ${result.role}`);
        
        // Update authentication context
        login(values.username, result.role);
        
        // Show success message
        toast.success(`Welcome back, ${values.username}!`);
        
        // Check user privileges and redirect accordingly
        if (result.role === "admin") {
          console.log("Admin privileges detected - full access granted");
          navigate("/"); // Redirect to dashboard
        } else if (result.role === "user") {
          console.log("User privileges detected - limited access granted");
          navigate("/"); // Redirect to dashboard
        }
      } else {
        // Authentication failed, show error message
        toast.error(result.error || "Authentication failed");
        console.log("Authentication failed:", result.error);
      }
    } catch (error) {
      // Handle any unexpected errors
      console.error("Login error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-ocean-50 to-white p-4">
      <div className="flex max-w-4xl w-full rounded-xl overflow-hidden shadow-2xl bg-white">
        {/* Left side - Ocean image */}
        <div className="hidden md:block w-1/2 relative">
          <img 
            src="https://images.unsplash.com/photo-1531297484001-80022131f5a1" 
            alt="Ocean technology" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-ocean-600/30 backdrop-blur-sm flex items-center justify-center">
            <div className="text-white text-center p-6">
              <h2 className="text-3xl font-bold mb-2">OceanClean</h2>
              <p className="text-lg">Advanced Robot Monitoring System</p>
            </div>
          </div>
        </div>
        
        {/* Right side - Login form */}
        <div className="w-full md:w-1/2 px-8 py-10">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-ocean-100 rounded-full p-3 mb-3">
              <Waves className="h-10 w-10 text-ocean-600" />
            </div>
            <h1 className="text-2xl font-bold text-ocean-800">OceanClean</h1>
            <p className="text-ocean-600 text-sm">Robot Monitoring System</p>
          </div>
          
          <CardHeader className="px-0 pb-2">
            <CardTitle className="text-center text-xl">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ocean-500" />
                          <Input 
                            placeholder="Enter your username" 
                            className="pl-10" 
                            {...field} 
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ocean-500" />
                          <Input 
                            placeholder="Enter your password" 
                            type="password"
                            className="pl-10" 
                            {...field} 
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-ocean-600 hover:bg-ocean-700 py-5 mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? "Authenticating..." : "Login"}
                </Button>
              </form>
            </Form>
          </CardContent>
          
          <CardFooter className="flex justify-center pt-4 px-0">
            <p className="text-xs text-muted-foreground">
              OceanClean Monitoring System | © {new Date().getFullYear()}
            </p>
          </CardFooter>
        </div>
      </div>
    </div>
  );
};

export default Login;

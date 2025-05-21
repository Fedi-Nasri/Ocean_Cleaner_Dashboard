
import { createContext, useContext, useState, ReactNode } from "react";

// Define the structure of the authentication state
interface AuthState {
  isAuthenticated: boolean;
  role: "admin" | "user" | null;
  username: string | null;
}

// Define the context interface with state and functions
interface AuthContextType {
  auth: AuthState;
  login: (username: string, role: "admin" | "user") => void;
  logout: () => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  auth: {
    isAuthenticated: false,
    role: null,
    username: null,
  },
  login: () => {},
  logout: () => {},
});

// Export the useAuth hook for easy access to the auth context
export const useAuth = () => useContext(AuthContext);

// Auth Provider component that will wrap the application
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    role: null,
    username: null,
  });

  // Function to handle user login
  const login = (username: string, role: "admin" | "user") => {
    setAuth({
      isAuthenticated: true,
      role,
      username,
    });
  };

  // Function to handle user logout
  const logout = () => {
    setAuth({
      isAuthenticated: false,
      role: null,
      username: null,
    });
  };

  // Provide auth state and functions to children
  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

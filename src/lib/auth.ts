
import { database } from './firebase';
import { ref, get } from 'firebase/database';

// Define the structure of a user
interface User {
  username: string;
  password: string;
  privileges: 'admin' | 'user';
}

// Define the authentication result structure
interface AuthResult {
  success: boolean;
  role?: 'admin' | 'user';
  error?: string;
}

/**
 * Authenticates a user by checking username and password against Firebase database
 * 
 * @param username - The username to check
 * @param password - The password to verify
 * @returns Promise resolving to an AuthResult object
 */
export const authenticateUser = async (
  username: string,
  password: string
): Promise<AuthResult> => {
  try {
    console.log("Attempting to authenticate user:", username);
    
    // Reference to the users node in Firebase Realtime Database
    const usersRef = ref(database, 'users');
    
    // Get all users from the database
    const snapshot = await get(usersRef);
    
    // Check if users node exists in the database
    if (!snapshot.exists()) {
      console.log("No users found in database");
      return { 
        success: false, 
        error: "Authentication failed. User database not found." 
      };
    }
    
    const usersData = snapshot.val();
    let foundUser: User | null = null;
    let userId: string | null = null;
    
    // Iterate through all users to find a matching username
    // Each user is stored under a unique ID
    Object.entries(usersData).forEach(([id, userData]: [string, any]) => {
      if (userData.username === username) {
        foundUser = userData as User;
        userId = id;
      }
    });
    
    // Check if user exists
    if (!foundUser) {
      console.log("User not found:", username);
      return { 
        success: false, 
        error: "Invalid username or password." 
      };
    }
    
    // Verify password
    if (foundUser.password !== password) {
      console.log("Password mismatch for user:", username);
      return { 
        success: false, 
        error: "Invalid username or password." 
      };
    }
    
    // Check user privileges
    if (foundUser.privileges !== 'admin' && foundUser.privileges !== 'user') {
      console.log("Invalid privileges for user:", username);
      return { 
        success: false, 
        error: "User has invalid privileges." 
      };
    }
    
    console.log(`Authentication successful for ${username} (${foundUser.privileges})`);
    
    // Return successful authentication with user role
    return { 
      success: true, 
      role: foundUser.privileges 
    };
  } catch (error) {
    console.error("Authentication error:", error);
    return { 
      success: false, 
      error: "Authentication failed due to a system error." 
    };
  }
};

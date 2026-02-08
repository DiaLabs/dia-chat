// User type definition
export type User = {
  name: string;
  email: string;
  password: string;
};

// Get all users from localStorage
export const getUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  
  const usersJson = localStorage.getItem('users');
  return usersJson ? JSON.parse(usersJson) : [];
};

// Save a new user
export const registerUser = (user: User): { success: boolean; message: string } => {
  const users = getUsers();
  
  // Check if email already exists
  if (users.some(u => u.email === user.email)) {
    return { 
      success: false, 
      message: 'Email already registered. Please use a different email or sign in.' 
    };
  }
  
  // Add new user
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
  
  return { success: true, message: 'Registration successful!' };
};

// Authenticate a user
export const loginUser = (email: string, password: string): { success: boolean; user?: User; message: string } => {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  
  if (!user) {
    return { success: false, message: 'User not found. Please check your email or sign up.' };
  }
  
  if (user.password !== password) {
    return { success: false, message: 'Incorrect password. Please try again.' };
  }
  
  // Store current user in session
  sessionStorage.setItem('currentUser', JSON.stringify(user));
  
  return { success: true, user, message: 'Login successful!' };
};

// Get current logged in user
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  const userJson = sessionStorage.getItem('currentUser');
  return userJson ? JSON.parse(userJson) : null;
};

// Logout user
export const logoutUser = (): void => {
  sessionStorage.removeItem('currentUser');
};
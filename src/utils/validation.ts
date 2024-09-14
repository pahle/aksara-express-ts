export const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  
  export const isValidPhone = (phone: string): boolean => {
    return /^62\d{9,12}$/.test(phone);
  };
  
  export const isValidPassword = (password: string): boolean => {
    return /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
  };
  
export type BookStatus = "Available" | "Borrowed" | "Reserved";

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  year: string;
  status: BookStatus;
  cover: string;
}

export type UserRole = "Student" | "Employee" | "Admin" | "Home" | "Blog" | "Contact";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  age?: number;
  department?: string;
  password?: string;
  borrowedBookIds?: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  image: string;
  mediumLink?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success";
  date: string;
  isRead: boolean;
}

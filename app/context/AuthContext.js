/* eslint-disable */
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = Cookies.get("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        Cookies.set("token", data.token, { 
          expires: 7, 
          path: '/',
          sameSite: 'lax'
        });
        localStorage.setItem("user", JSON.stringify(data.user));
        
        setToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Login failed. Please try again." };
    }
  };

  const adminLogin = async (email, password) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (data.success) {
        Cookies.set("token", data.token, { 
          expires: 7, 
          path: '/',
          sameSite: 'lax'
        });
        localStorage.setItem("user", JSON.stringify(data.user));
        
        setToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Admin login error:", error);
      return { success: false, message: "Admin login failed. Please try again." };
    }
  };

  const register = async (userData) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      const data = await res.json();

      if (data.success) {
        Cookies.set("token", data.token, { 
          expires: 7,
          path: '/',
          sameSite: 'lax'
        });
        localStorage.setItem("user", JSON.stringify(data.user));
        
        setToken(data.token);
        setUser(data.user);
        return { success: true, user: data.user };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return { success: false, message: "Registration failed. Please try again." };
    }
  };

  const logout = () => {
    Cookies.remove("token", { path: '/' });
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    router.push("/");
  };

  const isAdmin = () => {
    return user?.role === "admin";
  };

  const isAuthenticated = () => {
    return !!user && !!token;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        adminLogin,
        register,
        logout,
        isAdmin,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
// 'use client';

// import { createContext, useContext, useEffect, useState } from 'react';

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   async function loadUser() {
//     try {
//       const res = await fetch('/api/auth/me', {
//         credentials: 'include',
//       });
//       const data = await res.json();
//       setUser(data.user || null);
//     } catch {
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function logout() {
//     await fetch('/api/auth/logout', { method: 'POST' });
//     setUser(null);
//     window.location.href = '/login';
//   }

//   useEffect(() => {
//     loadUser();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, loading, setUser, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadUser() {
    try {
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
      });
      const data = await res.json();
      setUser(data.user || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
    window.location.href = '/login';
  }

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, logout, reloadUser: loadUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

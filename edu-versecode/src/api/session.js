// src/api/session.js
// Simple session utility using localStorage

export const setSession = (user) => {
  localStorage.setItem("eduverse_user", JSON.stringify(user));
};

export const getSession = () => {
  const user = localStorage.getItem("eduverse_user");
  return user ? JSON.parse(user) : null;
};

export const clearSession = () => {
  localStorage.removeItem("eduverse_user");
};

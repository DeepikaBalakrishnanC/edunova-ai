export const ROLES = {
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: "Admin",
  [ROLES.TEACHER]: "Teacher",
  [ROLES.STUDENT]: "Student",
};

export const DASHBOARD_PATHS = {
  [ROLES.ADMIN]: "/admin-dashboard",
  [ROLES.TEACHER]: "/teacher",
  [ROLES.STUDENT]: "/dashboard",
};

const USERS_KEY = "edunova_users";

const starterUsers = [
  {
    id: "admin-account",
    name: "Platform Admin",
    username: "admin",
    email: "admin@edunova.local",
    password: "admin123",
    role: ROLES.ADMIN,
    status: "active",
  },
  {
    id: "teacher-account",
    name: "Deepika Teacher",
    username: "teacher",
    email: "teacher@edunova.local",
    password: "teacher123",
    role: ROLES.TEACHER,
    status: "active",
  },
  {
    id: "student-account",
    name: "Student User",
    username: "student",
    email: "student@edunova.local",
    password: "student123",
    role: ROLES.STUDENT,
    status: "active",
  },
];

export function getUsers() {
  const raw = localStorage.getItem(USERS_KEY);

  if (!raw) {
    localStorage.setItem(USERS_KEY, JSON.stringify(starterUsers));
    return starterUsers;
  }

  try {
    const users = JSON.parse(raw);
    return Array.isArray(users) ? users : starterUsers;
  } catch {
    localStorage.setItem(USERS_KEY, JSON.stringify(starterUsers));
    return starterUsers;
  }
}

export function saveUserAccount(user) {
  const users = getUsers();
  const exists = users.some(
    (item) => item.username.toLowerCase() === user.username.toLowerCase()
      || item.email.toLowerCase() === user.email.toLowerCase()
  );

  if (exists) {
    throw new Error("An account with that username or email already exists.");
  }

  const nextUser = {
    ...user,
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    status: user.role === ROLES.TEACHER ? "pending-review" : "active",
  };

  localStorage.setItem(USERS_KEY, JSON.stringify([...users, nextUser]));
  return nextUser;
}

export function updateUserAccount(userId, updates) {
  const users = getUsers();
  const exists = users.some((item) => {
    if (item.id === userId) return false;

    return item.username.toLowerCase() === updates.username.toLowerCase()
      || item.email.toLowerCase() === updates.email.toLowerCase();
  });

  if (exists) {
    throw new Error("Another account already uses that username or email.");
  }

  const nextUsers = users.map((user) => (
    user.id === userId
      ? { ...user, ...updates }
      : user
  ));
  const updatedUser = nextUsers.find((user) => user.id === userId);

  localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));

  const storedUser = getStoredUser();
  if (storedUser?.id === userId) {
    localStorage.setItem("user", JSON.stringify(publicUser(updatedUser)));
  }

  return updatedUser;
}

export function deleteUserAccount(userId) {
  const users = getUsers();
  const nextUsers = users.filter((user) => user.id !== userId);

  localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));

  const storedUser = getStoredUser();
  if (storedUser?.id === userId) {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
  }

  return nextUsers;
}

export function findUser(username, password) {
  return getUsers().find(
    (user) => user.username.toLowerCase() === username.toLowerCase()
      && user.password === password
  );
}

export function publicUser(user) {
  if (!user) return null;
  const safeUser = { ...user };
  delete safeUser.password;
  return safeUser;
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
}

export function dashboardForRole(role) {
  return DASHBOARD_PATHS[role] || DASHBOARD_PATHS[ROLES.STUDENT];
}

export function hasRole(userRole, allowedRoles = []) {
  if (!allowedRoles.length) return true;
  if (userRole === ROLES.ADMIN) return true;
  return allowedRoles.includes(userRole);
}

export function getUser() {
  return getStoredUser();
}

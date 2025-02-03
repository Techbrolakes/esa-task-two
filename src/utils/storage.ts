export type User = {
  fullname: string;
  isLoggedIn: boolean;
  loginTime: string;
};

type StorageResult<T> = {
  data: T | null;
  error: Error | null;
};

// Generic storage operations
export const setItem = <T>(key: string, value: T): StorageResult<T> => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    return { data: value, error: null };
  } catch (error) {
    console.error("Error saving to localStorage:", error);
    return {
      data: null,
      error: new Error("Failed to save data to localStorage"),
    };
  }
};

export const getItem = <T>(key: string): StorageResult<T> => {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      return { data: null, error: null };
    }
    const parsedItem = JSON.parse(item) as T;
    return { data: parsedItem, error: null };
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return {
      data: null,
      error: new Error("Failed to read data from localStorage"),
    };
  }
};

export const removeItem = (key: string): StorageResult<void> => {
  try {
    localStorage.removeItem(key);
    return { data: null, error: null };
  } catch (error) {
    console.error("Error removing from localStorage:", error);
    return {
      data: null,
      error: new Error("Failed to remove data from localStorage"),
    };
  }
};

export const clearStorage = (): StorageResult<void> => {
  try {
    localStorage.clear();
    return { data: null, error: null };
  } catch (error) {
    console.error("Error clearing localStorage:", error);
    return {
      data: null,
      error: new Error("Failed to clear localStorage"),
    };
  }
};

const USER_KEY = "user" as const;

export const setUser = (user: User): StorageResult<User> => setItem<User>(USER_KEY, user);

export const getUser = (): StorageResult<User> => getItem<User>(USER_KEY);

export const removeUser = (): StorageResult<void> => removeItem(USER_KEY);

export const isUserLoggedIn = (): boolean => {
  const { data: user } = getUser();
  return user?.isLoggedIn ?? false;
};

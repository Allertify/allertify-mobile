import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { useToken } from "./useToken";
import { userRefreshManager } from "./userRefreshManager";

export function useUser() {
  const { getStoredUser } = useAuth();
  const { token, isLoading: tokenLoading } = useToken();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const storedUser = await getStoredUser();
        if (storedUser?.user) {
          console.log("Fetched user from storage:", storedUser.user);
          setUser(storedUser.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [token, tokenLoading, refreshTrigger]);

  // Subscribe to global refresh events
  useEffect(() => {
    const unsubscribe = userRefreshManager.subscribe(() => {
      console.log("Global user refresh triggered");
      setRefreshTrigger((prev) => prev + 1);
    });

    return unsubscribe;
  }, []);

  const refreshUser = () => {
    console.log("Refreshing user data...");
    setRefreshTrigger((prev) => prev + 1);
  };

  return { user, isLoading: isLoading || tokenLoading, refreshUser };
}

import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { useToken } from "./useToken";

export function useUser() {
  const { getStoredUser } = useAuth();
  const { token, isLoading: tokenLoading } = useToken();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Always fetch user data
        const storedUser = await getStoredUser();
        if (storedUser?.user) {
          setUser(storedUser.user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [token, tokenLoading]); // Re-run when token changes

  return { user, isLoading: isLoading || tokenLoading };
}

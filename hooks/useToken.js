import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";

export function useToken() {
  const { getStoredUser } = useAuth();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedUser = await getStoredUser();
        if (storedUser?.token) {
          setToken(storedUser.token);
        }
        if (storedUser?.user) {
          setUser(storedUser.user);
        }
      } catch (error) {
        console.error("Error fetching token/user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchToken();
  }, [getStoredUser]);

  return { user, token, isLoading };
}

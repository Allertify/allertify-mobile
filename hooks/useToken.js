import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";

export function useToken() {
  const { getStoredUser } = useAuth();
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedUser = await getStoredUser();
        if (storedUser?.token) {
          setToken(storedUser.token);
        }
      } catch (error) {
        console.error("Error fetching token:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchToken();
  }, [getStoredUser]);

  return { token, isLoading };
}

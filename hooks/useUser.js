import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { useSettings } from "./useSettings";
import { useToken } from "./useToken";

export function useUser() {
  const { getStoredUser } = useAuth();
  const { getAllergies } = useSettings();
  const { token, isLoading: tokenLoading } = useToken();
  const [user, setUser] = useState(null);
  const [allergies, setAllergies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Always fetch user data
        const storedUser = await getStoredUser();
        if (storedUser?.user) {
          setUser(storedUser.user);
        }

        // Only fetch allergies if token is available and not loading
        if (token && !tokenLoading) {
          const storedAllergies = await getAllergies();
          if (storedAllergies?.length !== 0) {
            setAllergies(storedAllergies);
          } else {
            setAllergies([]);
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [token, tokenLoading]); // Re-run when token changes

  return { user, allergies, isLoading: isLoading || tokenLoading };
}

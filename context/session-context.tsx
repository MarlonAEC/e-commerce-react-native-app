import { useSession as useSessionHook } from "@/hooks/use-session";
import { createContext, use, type PropsWithChildren } from "react";

const AuthContext = createContext<{
  signIn: (username: string, password: string) => Promise<boolean>;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
} | null>(null);

// Use this hook to access the user info.
export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }
  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  // Use our Redux-based session hook internally
  const { session, isLoading, signIn, signOut } = useSessionHook();

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

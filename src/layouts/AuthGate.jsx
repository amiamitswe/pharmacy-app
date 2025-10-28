import { useAtomValue } from "jotai";
import { authAtom } from "../atoms/authAtom";

export default function AuthGate({ children }) {
  const auth = useAtomValue(authAtom);

  if (!auth.initialized) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>🔄 Checking authentication...</p>
      </div>
    );
  }

  return children;
}

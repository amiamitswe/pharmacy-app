import { useAtomValue } from "jotai";
import { authAtom } from "../atoms/authAtom";

export default function AuthGate({ children }) {
  const auth = useAtomValue(authAtom);

  if (!auth.initialized) {
    return (
      <div className="flex flex-col h-screen items-center justify-center gap-4 bg-stone-800 text-slate-200">
        <span className="custom_loader"></span>
        <p className="text-xl">🔄 Checking authentication...</p>
      </div>
    );
  }

  return children;
}

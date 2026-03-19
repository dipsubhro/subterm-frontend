import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function SSOCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase handles the OAuth callback automatically
    // This component just redirects to home after auth
    supabase.auth.getSession().then(() => {
      navigate("/");
    });
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <p>Completing sign in...</p>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Home from "./Home";
import { getSession } from "../api/session";

const Index = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const sessionUser = getSession();
    if (!sessionUser) {
      navigate("/auth");
    } else {
      setUser(sessionUser);
    }
  }, [navigate]);

  if (!user) {
    return null;
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--gradient-subtle)" }}
    >
      <Navbar user={user} />
      <Home user={user} />
    </div>
  );
};

export default Index;

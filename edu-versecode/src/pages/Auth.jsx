import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input, Label } from "../components/ui/form-elements";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/display";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";
import "../styles/auth.css";
import { loginUser, registerUser } from "../api/auth";
import { setSession, getSession } from "../api/session";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getSession();
    if (user) navigate("/");
  }, [navigate]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const data = await loginUser(email, password);
        setSession(data);
        toast.success("Welcome back!");
        navigate("/");
      } else {
        const data = await registerUser({ email, password, name });
        setSession(data);
        toast.success("Account created!");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message || error || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <CardHeader className="auth-header">
          <div className="auth-icon">
            <GraduationCap className="auth-icon-svg" />
          </div>
          <div>
            <CardTitle className="auth-title">EduConnect</CardTitle>
            <CardDescription className="auth-subtitle">
              {isLogin
                ? "Welcome back! Sign in to continue"
                : "Join our educational community"}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleAuth} className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-group">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <Button type="submit" className="auth-button" disabled={loading}>
              {loading
                ? "Processing..."
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </Button>
          </form>

          <div className="auth-switch">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="switch-link"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Lock, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { login } from "@/api";

interface LoginModalProps {
  onLogin: (isAdmin: boolean) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export function LoginModal({ onLogin, isLoggedIn, onLogout }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem("admin_auth_token");
    if (token) {
      onLogin(true);
    }
  }, [onLogin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await login(email, password);

      localStorage.setItem("admin_auth_token", response.token);

      onLogin(true);
      setOpen(false);
      setEmail("");
      setPassword("");

      toast({
        title: "Login Successful",
        description: `Welcome, ${response.admin.name}!`,
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Login failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_auth_token");
    onLogout();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  if (isLoggedIn) {
    return (
      <Button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black border-yellow-500 font-medium"
      >
        <Lock className="h-4 w-4" />
        Logout Admin
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black border-yellow-500 font-medium">
          <LogIn className="h-4 w-4" />
          Admin Login
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Admin Login
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@committee.com"
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { cn } from "cn";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/firebase";
import { login } from "@/features/auth";
import { useDispatch } from "react-redux";
import { setUserData } from "@/redux/userSlice";

export function LoginForm({ className, ...props }) {
  const dispatch = useDispatch();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      const data = await login(token);
      console.log(data);
      dispatch(setUserData(data));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <Card className="border border-white/10 bg-white/3 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <CardHeader className="space-y-4 text-center">
          <CardTitle className="text-3xl font-bold text-white">
            Welcome to Automate AI
          </CardTitle>

          <CardDescription className="text-zinc-400 text-base">
            Sign in to build and manage your AI agents.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Button
            onClick={handleGoogleLogin}
            type="button"
            className="h-12 w-full gap-3 bg-white text-black hover:bg-zinc-100 font-medium transition-all duration-300"
          >
            <FcGoogle className="h-5 w-5" />
            Continue with Google
          </Button>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Secure authentication powered by Google
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

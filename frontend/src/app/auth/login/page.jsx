"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { dispatch } from "@/store/store";
import { getCurrentUser, loginUser } from "@/store/thunks/authThunk";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onLoginSubmit = (data) => {
    // console.log(e)
    dispatch(loginUser(data));
  };

  return (
    <div className="flex items-center justify-center w-full h-full bg-secondary-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className={"font-bold text-xl"}>
            Login to your account
          </CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <form className="space-y-6" onSubmit={handleSubmit(onLoginSubmit)}>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-chart-3">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                {errors.password && (
                  <p className="text-chart-3">{errors.password.message}</p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              // onClick={() => dispatch(loginUser())}
              type="submit"
              className="w-full"
            >
              Login
            </Button>
            <Button
             
              type="button"
              variant="neutral"
              className="w-full"
            >
              Login with Google
            </Button>

            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

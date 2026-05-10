"use client";
import FloatingElement from "@/components/local/FloatingElement";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { signupUser } from "@/store/thunks/authThunk";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

export default function Signup() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      role: "customer",
    },
  });
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const onSignupSubmit = (data) => {
    dispatch(signupUser(data));
    reset();
  };

  useEffect(() => {
    if (user) router.push("/");
  });

  return (
    <div className="flex items-center justify-center w-full h-full bg-secondary-background pt-19">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className={"font-bold text-xl"}>
            Create your account
          </CardTitle>
          <CardDescription>
            Enter your All the fields below to create your account
          </CardDescription>
        </CardHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSignupSubmit)}>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Name</Label>
                <Input
                  {...register("name", { required: "Name is required" })}
                  id="name"
                  type="text"
                  placeholder="Ex: Sharat Katwa"
                />
                {errors.name && (
                  <p className="text-chart-3">{errors.name.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...register("email", { required: "Email is required" })}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                />
                {errors.email && (
                  <p className="text-chart-3">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  {...register("password", {
                    required: "Password is required",
                  })}
                  id="password"
                  type="password"
                />
                {errors.password && (
                  <p className="text-chart-3">{errors.password.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Confirm Password</Label>
                <Input
                  {...register("cpassword", {
                    required: "Confirm password is required",
                    validate: (value) =>
                      value === getValues("password") ||
                      "password doesn't match",
                  })}
                  id="cpassword"
                  type="password"
                />
                {errors.cpassword && (
                  <p className="text-chart-3">{errors.cpassword.message}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={watch("role") === "seller"}
                  onCheckedChange={(checked) => {
                    setValue("role", checked ? "seller" : "customer");
                  }}
                />
                <p>Register as a seller</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              variant={loading ? "disabled" : "default"}
              type="submit"
              className="w-full"
            >
              {loading ? (
                <>
                  <Spinner /> Signing up...
                </>
              ) : (
                "signup"
              )}
            </Button>
            <Button type="button" variant="neutral" className="w-full">
              Signup with Google
            </Button>
            <div className="mt-4 text-center text-sm">
              already have an account?{" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
      <FloatingElement
        className={
          "h-20 w-20 animate-floatY rotate-20 bg-chart-3 absolute right-[20%] hidden md:block"
        }
      />
      <FloatingElement
        className={
          "h-15 w-15 animate-floatY rounded-full rotate-0 bg-chart-1 absolute right-[10%] top-[20%] hidden md:block"
        }
      />
      <FloatingElement
        className={
          "h-25 w-25 animate-floatY  rotate-0 bg-chart-1 absolute right-[10%] top-[70%] hidden md:block"
        }
      />
    </div>
  );
}

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
import Link from "next/link";

export default function Login() {
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
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ex: Sharat Katwa"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Confirm Password</Label>
                <Input id="cpassword" type="password" required />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox value="seller" />
                <p>Register as a seller</p>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">
            Signup
          </Button>
          <Button variant="neutral" className="w-full">
            Signup with Google
          </Button>
          <div className="mt-4 text-center text-sm">
            already have an account?{" "}
            <Link href="/auth/login" className="underline underline-offset-4">
              Login
            </Link>
          </div>
        </CardFooter>
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

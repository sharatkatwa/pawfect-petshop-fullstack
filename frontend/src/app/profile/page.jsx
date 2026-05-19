"use client";

import Link from "next/link";
import { ArrowLeft, Save, Trash2, UserRound } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteUser, updateUser } from "@/store/thunks/authThunk";

const getUserId = (user) => user?._id || user?.id;

export default function ProfilePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    initialized,
    isAuthenticated,
    loading: authLoading,
    user,
  } = useSelector((state) => state.auth);
  const userId = getUserId(user);
  const {
    formState: { errors, isDirty },
    handleSubmit,
    register,
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      age: "",
      phone: "",
      address: "",
    },
  });

  useEffect(() => {
    if (!initialized || authLoading) return;

    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [authLoading, initialized, isAuthenticated, router]);

  useEffect(() => {
    if (!user) return;

    reset({
      name: user.name || "",
      age: user.age || "",
      phone: user.phone || "",
      address: user.address || "",
    });
  }, [reset, user]);

  const onSubmit = (data) => {
    if (!userId) return;

    dispatch(
      updateUser({
        id: userId,
        data: {
          name: data.name.trim(),
          age: data.age ? Number(data.age) : undefined,
          phone: data.phone.trim(),
          address: data.address.trim(),
        },
      }),
    );
  };

  const handleDeleteAccount = async () => {
    if (!userId) return;

    const result = await dispatch(deleteUser(userId));

    if (deleteUser.fulfilled.match(result)) {
      router.push("/");
    }
  };

  return (
    <main className="min-h-screen bg-background px-5 pb-20 pt-32 font-heading text-foreground md:px-8">
      <section className="mx-auto max-w-[980px]">
        <Button
          asChild
          variant="neutral"
          className="mb-8 font-heading uppercase"
        >
          <Link href="/shop">
            <ArrowLeft className="h-4 w-4" />
            Back to shop
          </Link>
        </Button>

        <div className="mb-10">
          <h1 className="text-5xl font-black uppercase leading-none md:text-7xl">
            Profile
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-7">
            Manage your account details and default delivery information.
          </p>
        </div>

        {(!initialized || authLoading) ? (
          <div className="border-[4px] border-border bg-secondary-background p-8 text-center text-2xl font-black uppercase shadow-shadow">
            Loading profile...
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Card className="border-[4px] bg-secondary-background shadow-[8px_8px_0_0_var(--border)]">
                <CardHeader className="border-b-[4px] border-border">
                  <CardTitle className="flex items-center gap-3 text-3xl font-black uppercase">
                    <UserRound className="h-7 w-7" />
                    Account details
                  </CardTitle>
                  <CardDescription className="font-heading uppercase">
                    Email and role are read-only for now.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 pt-6">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="uppercase">
                      Name
                    </Label>
                    <Input
                      id="name"
                      className="h-14 border-[4px] px-4 font-heading text-base"
                      {...register("name", {
                        required: "Name is required",
                        pattern: {
                          value: /^[a-zA-Z\s]+$/,
                          message: "Name can only contain letters and spaces",
                        },
                        minLength: {
                          value: 2,
                          message: "Name must be at least 2 characters",
                        },
                      })}
                    />
                    {errors.name && (
                      <p className="text-sm text-[var(--chart-3)]">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="email" className="uppercase">
                        Email
                      </Label>
                      <Input
                        id="email"
                        value={user?.email || ""}
                        disabled
                        className="h-14 border-[4px] px-4 font-heading text-base"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="role" className="uppercase">
                        Role
                      </Label>
                      <Input
                        id="role"
                        value={user?.admin ? "admin" : user?.role || "customer"}
                        disabled
                        className="h-14 border-[4px] px-4 font-heading text-base uppercase"
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="age" className="uppercase">
                        Age
                      </Label>
                      <Input
                        id="age"
                        type="number"
                        min="1"
                        max="120"
                        placeholder="21"
                        className="h-14 border-[4px] px-4 font-heading text-base"
                        {...register("age", {
                          min: {
                            value: 1,
                            message: "Age must be at least 1",
                          },
                          max: {
                            value: 120,
                            message: "Age cannot be more than 120",
                          },
                        })}
                      />
                      {errors.age && (
                        <p className="text-sm text-[var(--chart-3)]">
                          {errors.age.message}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="phone" className="uppercase">
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="9876543210"
                        className="h-14 border-[4px] px-4 font-heading text-base"
                        {...register("phone", {
                          pattern: {
                            value: /^$|^[6-9]\d{9}$/,
                            message: "Enter a valid 10 digit phone number",
                          },
                        })}
                      />
                      {errors.phone && (
                        <p className="text-sm text-[var(--chart-3)]">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="address" className="uppercase">
                      Address
                    </Label>
                    <textarea
                      id="address"
                      rows={5}
                      placeholder="Default delivery address"
                      className="flex w-full resize-none rounded-base border-[4px] border-border bg-secondary-background px-4 py-3 font-heading text-base text-foreground selection:bg-main selection:text-main-foreground placeholder:text-foreground/50 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...register("address", {
                        maxLength: {
                          value: 200,
                          message: "Address cannot be more than 200 characters",
                        },
                      })}
                    />
                    {errors.address && (
                      <p className="text-sm text-[var(--chart-3)]">
                        {errors.address.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={authLoading || !isDirty}
                    className="h-14 w-full border-[4px] font-heading text-lg font-black uppercase"
                  >
                    <Save className="h-5 w-5" />
                    {authLoading ? "Saving..." : "Save changes"}
                  </Button>
                </CardContent>
              </Card>
            </form>

            <Card className="h-fit border-[4px] bg-secondary-background shadow-[8px_8px_0_0_var(--border)]">
              <CardHeader className="border-b-[4px] border-border">
                <CardTitle className="text-2xl font-black uppercase">
                  Danger zone
                </CardTitle>
                <CardDescription className="font-heading uppercase">
                  Deleting your account will log you out.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="neutral"
                      className="h-12 w-full font-heading uppercase"
                      disabled={authLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete account?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will deactivate your account and sign you out.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAccount}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        )}
      </section>
    </main>
  );
}

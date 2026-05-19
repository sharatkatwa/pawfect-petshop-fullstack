"use client";

import Image from "next/image";
import {
  BadgeIndianRupee,
  Box,
  ClipboardList,
  Edit3,
  Eye,
  PackagePlus,
  Save,
  Star,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  createProduct,
  deleteProduct,
  deleteProductReview,
  getMyProducts,
  getProductReviews,
  updateProduct,
} from "@/store/thunks/productThunk";
import {
  getSellerOrders,
  updateOrderStatus,
} from "@/store/thunks/orderThunk";

const categories = ["pet", "food", "toy", "grooming", "medicine", "accessory", "other"];
const petTypes = ["dog", "cat", "bird", "fish", "rabbit", "hamster", "other"];
const genders = ["male", "female", "unknown"];
const productStatuses = ["available", "sold", "out_of_stock"];
const orderStatuses = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const emptyProductForm = {
  productName: "",
  description: "",
  category: "other",
  petType: "dog",
  price: "",
  stock: "1",
  age: "",
  breed: "",
  gender: "unknown",
  isVaccinated: false,
  status: "available",
};

const getProductImage = (product) =>
  product?.images?.[0] ||
  `https://placehold.co/500x500/png?text=${encodeURIComponent(product?.productName || "Product")}`;

const getUserId = (user) => user?._id || user?.id;

const getOrderItemsForSeller = (order, user) => {
  if (user?.admin) return order.items || [];

  const userId = getUserId(user);

  return (order.items || []).filter((item) => {
    const seller = item.product?.seller;
    const sellerId = seller?._id || seller;
    return sellerId?.toString() === userId?.toString();
  });
};

const getOrderRevenue = (order, user) => {
  return getOrderItemsForSeller(order, user).reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
};

const buildProductFormData = (data, images) => {
  const formData = new FormData();
  const fields = {
    productName: data.productName.trim(),
    description: data.description.trim(),
    category: data.category,
    petType: data.petType,
    price: Number(data.price),
    stock: Number(data.stock),
    age: data.age ? Number(data.age) : "",
    breed: data.breed.trim(),
    gender: data.gender,
    isVaccinated: Boolean(data.isVaccinated),
    status: data.status,
  };

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== "") formData.append(key, value);
  });

  Array.from(images || []).forEach((image) => formData.append("images", image));

  return formData;
};

const buildProductUpdateData = (data) => ({
  productName: data.productName.trim(),
  description: data.description.trim(),
  category: data.category,
  petType: data.petType,
  price: Number(data.price),
  stock: Number(data.stock),
  age: data.age ? Number(data.age) : undefined,
  breed: data.breed.trim(),
  gender: data.gender,
  isVaccinated: Boolean(data.isVaccinated),
  status: data.status,
});

function StatCard({ title, value, icon: Icon }) {
  return (
    <Card className="border-[4px] bg-secondary-background shadow-[6px_6px_0_0_var(--border)]">
      <CardContent className="flex items-center justify-between gap-4 p-5">
        <div>
          <p className="text-sm uppercase">{title}</p>
          <p className="mt-2 text-3xl font-black uppercase">{value}</p>
        </div>
        <Icon className="h-9 w-9" />
      </CardContent>
    </Card>
  );
}

export default function SellerDashboardPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [productPage, setProductPage] = useState(1);
  const [orderStatus, setOrderStatus] = useState("all");
  const [editingProduct, setEditingProduct] = useState(null);
  const [reviewProductId, setReviewProductId] = useState("");
  const {
    initialized,
    isAuthenticated,
    loading: authLoading,
    user,
  } = useSelector((state) => state.auth);
  const {
    sellerProducts,
    sellerTotal,
    sellerTotalPages,
    loading: productLoading,
    reviewsByProduct,
  } = useSelector((state) => state.product);
  const { sellerOrders, sellerTotalOrders, loading: orderLoading } = useSelector(
    (state) => state.order,
  );
  const isSeller = user?.role === "seller" || user?.admin;
  const selectedReviewState = reviewsByProduct[reviewProductId];
  const addForm = useForm({ defaultValues: emptyProductForm });
  const editForm = useForm({ defaultValues: emptyProductForm });

  useEffect(() => {
    if (!initialized || authLoading) return;

    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (!isSeller) {
      router.push("/");
    }
  }, [authLoading, initialized, isAuthenticated, isSeller, router]);

  useEffect(() => {
    if (!initialized || !isAuthenticated || !isSeller) return;

    dispatch(getMyProducts({ page: productPage, limit: 6 }));
  }, [dispatch, initialized, isAuthenticated, isSeller, productPage]);

  useEffect(() => {
    if (!initialized || !isAuthenticated || !isSeller) return;

    dispatch(
      getSellerOrders({
        page: 1,
        limit: 1000,
        ...(orderStatus !== "all" ? { status: orderStatus } : {}),
      }),
    );
  }, [dispatch, initialized, isAuthenticated, isSeller, orderStatus]);

  const overview = useMemo(() => {
    return sellerOrders.reduce(
      (stats, order) => {
        stats.revenue += getOrderRevenue(order, user);
        if (order.status === "pending") stats.pending += 1;
        if (order.status === "delivered") stats.delivered += 1;
        return stats;
      },
      { revenue: 0, pending: 0, delivered: 0 },
    );
  }, [sellerOrders, user]);

  const handleCreateProduct = async (data) => {
    const result = await dispatch(
      createProduct(buildProductFormData(data, data.images)),
    );

    if (createProduct.fulfilled.match(result)) {
      addForm.reset(emptyProductForm);
      dispatch(getMyProducts({ page: productPage, limit: 6 }));
    }
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    editForm.reset({
      productName: product.productName || "",
      description: product.description || "",
      category: product.category || "other",
      petType: product.petType || "",
      price: product.price || "",
      stock: product.stock ?? 0,
      age: product.age ?? "",
      breed: product.breed || "",
      gender: product.gender || "unknown",
      isVaccinated: Boolean(product.isVaccinated),
      status: product.status || "available",
    });
  };

  const handleUpdateProduct = async (data) => {
    if (!editingProduct) return;

    const result = await dispatch(
      updateProduct({
        id: editingProduct._id,
        formData: buildProductUpdateData(data),
      }),
    );

    if (updateProduct.fulfilled.match(result)) {
      setEditingProduct(null);
      editForm.reset(emptyProductForm);
    }
  };

  const handleLoadReviews = (productId) => {
    setReviewProductId(productId);
    dispatch(getProductReviews({ productId, params: { page: 1, limit: 20 } }));
  };

  if (!initialized || authLoading) {
    return (
      <main className="min-h-screen bg-background px-5 pb-20 pt-32 font-heading">
        <div className="mx-auto max-w-[1220px] border-[4px] border-border bg-secondary-background p-8 text-center text-2xl font-black uppercase shadow-shadow">
          Loading seller dashboard...
        </div>
      </main>
    );
  }

  if (!isSeller) return null;

  return (
    <main className="min-h-screen bg-background px-5 pb-20 pt-32 font-heading text-foreground md:px-8">
      <section className="mx-auto max-w-[1320px]">
        <div className="mb-10">
          <h1 className="text-5xl font-black uppercase leading-none md:text-7xl">
            Seller Dashboard
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-7">
            Manage products, orders, reviews, and seller performance.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          <StatCard title="Products" value={sellerTotal} icon={Box} />
          <StatCard title="Orders" value={sellerTotalOrders} icon={ClipboardList} />
          <StatCard title="Pending" value={overview.pending} icon={PackagePlus} />
          <StatCard title="Delivered" value={overview.delivered} icon={Save} />
          <StatCard
            title="Revenue"
            value={`Rs. ${overview.revenue}`}
            icon={BadgeIndianRupee}
          />
        </div>

        <div className="mt-10 grid gap-8 xl:grid-cols-[420px_1fr]">
          <Card className="h-fit border-[4px] bg-secondary-background shadow-[8px_8px_0_0_var(--border)]">
            <CardHeader className="border-b-[4px] border-border">
              <CardTitle className="flex items-center gap-3 text-3xl font-black uppercase">
                <PackagePlus className="h-7 w-7" />
                Add Product
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form
                onSubmit={addForm.handleSubmit(handleCreateProduct)}
                className="grid gap-5"
              >
                <ProductFields form={addForm} includeImages />
                <Button
                  type="submit"
                  disabled={productLoading}
                  className="h-13 w-full font-heading uppercase"
                >
                  {productLoading ? "Saving..." : "Create product"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-[4px] bg-secondary-background shadow-[8px_8px_0_0_var(--border)]">
            <CardHeader className="border-b-[4px] border-border">
              <CardTitle className="text-3xl font-black uppercase">
                My Products
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5 pt-6">
              {sellerProducts.map((product) => (
                <article
                  key={product._id}
                  className="grid gap-4 border-[3px] border-border bg-background p-4 md:grid-cols-[96px_1fr_auto]"
                >
                  <Image
                    src={getProductImage(product)}
                    alt={product.productName}
                    width={140}
                    height={140}
                    className="h-24 w-24 border-[3px] border-border object-cover"
                  />
                  <div>
                    <h2 className="text-xl font-black uppercase leading-6">
                      {product.productName}
                    </h2>
                    <p className="mt-2 text-sm uppercase">
                      Stock: {product.stock} / Status: {product.status}
                    </p>
                    <p className="mt-1 text-sm uppercase">
                      Rs. {product.price} / Rating: {product.averageRating || 0}
                    </p>
                  </div>
                  <div className="grid gap-2 md:w-36">
                    <Button
                      type="button"
                      variant="neutral"
                      className="font-heading uppercase"
                      onClick={() => startEdit(product)}
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="neutral"
                      className="font-heading uppercase"
                      onClick={() => handleLoadReviews(product._id)}
                    >
                      <Eye className="h-4 w-4" />
                      Reviews
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          variant="neutral"
                          className="font-heading uppercase"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete product?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This removes the product from your store.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => dispatch(deleteProduct(product._id))}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </article>
              ))}

              {!sellerProducts.length && (
                <div className="border-[3px] border-border bg-background p-6 text-center text-xl font-black uppercase">
                  No seller products yet
                </div>
              )}
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t-[4px] border-border pt-5">
              <Button
                type="button"
                variant="neutral"
                disabled={productPage <= 1 || productLoading}
                onClick={() => setProductPage((page) => Math.max(page - 1, 1))}
              >
                Previous
              </Button>
              <span className="text-sm uppercase">
                Page {productPage} of {sellerTotalPages}
              </span>
              <Button
                type="button"
                variant="neutral"
                disabled={productPage >= sellerTotalPages || productLoading}
                onClick={() => setProductPage((page) => page + 1)}
              >
                Next
              </Button>
            </CardFooter>
          </Card>
        </div>

        {editingProduct && (
          <Card className="mt-8 border-[4px] bg-secondary-background shadow-[8px_8px_0_0_var(--border)]">
            <CardHeader className="border-b-[4px] border-border">
              <CardTitle className="text-3xl font-black uppercase">
                Edit Product
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form
                onSubmit={editForm.handleSubmit(handleUpdateProduct)}
                className="grid gap-5 lg:grid-cols-2"
              >
                <ProductFields form={editForm} />
                <div className="flex gap-3 lg:col-span-2">
                  <Button
                    type="submit"
                    disabled={productLoading}
                    className="h-13 flex-1 font-heading uppercase"
                  >
                    Save product
                  </Button>
                  <Button
                    type="button"
                    variant="neutral"
                    className="h-13 flex-1 font-heading uppercase"
                    onClick={() => setEditingProduct(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card className="mt-8 border-[4px] bg-secondary-background shadow-[8px_8px_0_0_var(--border)]">
          <CardHeader className="border-b-[4px] border-border">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle className="text-3xl font-black uppercase">
                Seller Orders
              </CardTitle>
              <Select value={orderStatus} onValueChange={setOrderStatus}>
                <SelectTrigger className="h-12 border-[4px] font-heading uppercase md:w-56">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All orders</SelectItem>
                  {orderStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="grid gap-5 pt-6">
            {sellerOrders.map((order) => (
              <article
                key={order._id}
                className="border-[3px] border-border bg-background p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-xl font-black uppercase">
                      Order #{order._id.slice(-8)}
                    </h2>
                    <p className="mt-1 text-sm uppercase">
                      Buyer: {order.buyer?.name || "Customer"} / Rs.{" "}
                      {getOrderRevenue(order, user)}
                    </p>
                  </div>
                  <Select
                    value={order.status}
                    onValueChange={(status) =>
                      dispatch(updateOrderStatus({ id: order._id, status }))
                    }
                  >
                    <SelectTrigger className="h-11 border-[3px] font-heading uppercase md:w-44">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {orderStatuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="mt-4 grid gap-2">
                  {getOrderItemsForSeller(order, user).map((item) => {
                    const product = item.product || {};
                    return (
                      <p
                        key={`${order._id}-${product._id || item.product}`}
                        className="border-[2px] border-border bg-secondary-background p-2 text-sm uppercase"
                      >
                        {product.productName || "Product"} / Qty {item.quantity}{" "}
                        / Rs. {item.price}
                      </p>
                    );
                  })}
                </div>
              </article>
            ))}

            {!sellerOrders.length && (
              <div className="border-[3px] border-border bg-background p-6 text-center text-xl font-black uppercase">
                No seller orders found
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-8 border-[4px] bg-secondary-background shadow-[8px_8px_0_0_var(--border)]">
          <CardHeader className="border-b-[4px] border-border">
            <CardTitle className="text-3xl font-black uppercase">
              Reviews Management
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 pt-6">
            {!reviewProductId ? (
              <div className="border-[3px] border-border bg-background p-6 text-center text-xl font-black uppercase">
                Click reviews on a product to manage feedback
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 text-lg font-black uppercase">
                  <Star className="h-5 w-5 fill-current" />
                  Average rating: {selectedReviewState?.averageRating || 0} /
                  Reviews: {selectedReviewState?.totalReviews || 0}
                </div>
                {(selectedReviewState?.reviews || []).map((review) => (
                  <article
                    key={review._id}
                    className="border-[3px] border-border bg-background p-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-lg font-black uppercase">
                          {review.user?.name || "Customer"} / {review.rating} stars
                        </p>
                        <p className="mt-2 text-sm leading-6">
                          {review.comment || "No comment"}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="neutral"
                        className="font-heading uppercase"
                        onClick={() =>
                          dispatch(
                            deleteProductReview({
                              productId: reviewProductId,
                              reviewId: review._id,
                            }),
                          )
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </article>
                ))}
                {!selectedReviewState?.reviews?.length && (
                  <div className="border-[3px] border-border bg-background p-6 text-center text-xl font-black uppercase">
                    No reviews for this product
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

function ProductFields({ form, includeImages = false }) {
  const {
    formState: { errors },
    register,
    setValue,
    watch,
  } = form;

  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor={`${includeImages ? "add" : "edit"}-productName`}>
          Product name
        </Label>
        <Input
          id={`${includeImages ? "add" : "edit"}-productName`}
          className="h-12 border-[4px] font-heading"
          {...register("productName", { required: "Product name is required" })}
        />
        {errors.productName && (
          <p className="text-sm text-[var(--chart-3)]">
            {errors.productName.message}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label>Description</Label>
        <textarea
          rows={4}
          className="resize-none rounded-base border-[4px] border-border bg-secondary-background p-3 font-heading focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          {...register("description", {
            required: "Description is required",
            minLength: {
              value: 10,
              message: "Description must be at least 10 characters",
            },
          })}
        />
        {errors.description && (
          <p className="text-sm text-[var(--chart-3)]">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SelectField
          label="Category"
          value={watch("category")}
          options={categories}
          onChange={(value) => setValue("category", value)}
        />
        <SelectField
          label="Pet type"
          value={watch("petType")}
          options={petTypes}
          onChange={(value) => setValue("petType", value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <NumberField
          label="Price"
          field="price"
          register={register}
          errors={errors}
          required
        />
        <NumberField
          label="Stock"
          field="stock"
          register={register}
          errors={errors}
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <NumberField label="Age" field="age" register={register} errors={errors} />
        <div className="grid gap-2">
          <Label>Breed</Label>
          <Input className="h-12 border-[4px] font-heading" {...register("breed")} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SelectField
          label="Gender"
          value={watch("gender")}
          options={genders}
          onChange={(value) => setValue("gender", value)}
        />
        <SelectField
          label="Status"
          value={watch("status")}
          options={productStatuses}
          onChange={(value) => setValue("status", value)}
        />
      </div>

      <label className="flex items-center gap-3 border-[3px] border-border bg-background p-3 uppercase">
        <input type="checkbox" {...register("isVaccinated")} />
        Vaccinated
      </label>

      {includeImages && (
        <div className="grid gap-2">
          <Label>Images</Label>
          <Input
            type="file"
            multiple
            accept="image/*"
            className="h-12 border-[4px] font-heading"
            {...register("images", {
              validate: (files) =>
                !files?.length ||
                files.length <= 5 ||
                "You can upload maximum 5 images",
            })}
          />
          {errors.images && (
            <p className="text-sm text-[var(--chart-3)]">
              {errors.images.message}
            </p>
          )}
        </div>
      )}
    </>
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-12 border-[4px] font-heading uppercase">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option || "empty"} value={option}>
              {option || "none"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function NumberField({ label, field, register, errors, required = false }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <Input
        type="number"
        min="0"
        className="h-12 border-[4px] font-heading"
        {...register(field, {
          required: required ? `${label} is required` : false,
          min: {
            value: 0,
            message: `${label} cannot be negative`,
          },
        })}
      />
      {errors[field] && (
        <p className="text-sm text-[var(--chart-3)]">
          {errors[field].message}
        </p>
      )}
    </div>
  );
}

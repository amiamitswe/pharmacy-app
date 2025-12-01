import { useSetAtom } from "jotai";
import { authAtom } from "../../atoms/authAtom";
import { Link, useNavigate, useSearchParams } from "react-router";
import * as Yup from "yup";
import { addToast, Button, Card, CardBody, Input } from "@heroui/react";
import { Formik } from "formik";
import userService from "../../api-services/userService";
import { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .required("Required"),
});

// Test credentials from environment variables (only available in dev)
const TEST_CREDENTIALS = {
  admin: {
    email: import.meta.env.VITE_TEST_ADMIN_EMAIL || "",
    password: import.meta.env.VITE_TEST_ADMIN_PASSWORD || "",
  },
  user: {
    email: import.meta.env.VITE_TEST_USER_EMAIL || "",
    password: import.meta.env.VITE_TEST_USER_PASSWORD || "",
  },
};

export default function Login() {
  const setAuth = useSetAtom(authAtom);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [searchParams] = useSearchParams();
  const fallback_url = searchParams.get("fallback_url");

  const loginHandler = async (values) => {
    setIsLoading(true);
    try {
      const response = await userService.login(values.email, values.password);

      if (response?.status === 200 && response?.data?.["access-token"]) {
        const role = response.data.user.role;
        localStorage.setItem("accessToken", response.data["access-token"]);

        // Update Jotai (this triggers AuthWatcher)
        setAuth({
          initialized: true,
          loggedIn: true,
          role,
          name: response?.data?.user?.name,
          cartItemCount: response?.data?.user?.cartItemCount || 0,
          cartItems: response?.data?.cartItems || [],
        });

        // Small delay before redirect ensures Jotai update propagates
        setTimeout(() => {
          navigate(role === "admin" ? "/admin" : fallback_url || "/user", {
            replace: true,
          });
        }, 100);

        addToast({
          title: "Login successful",
          color: "success",
        });
      } else {
        addToast({
          title:
            response?.data?.error ||
            response?.data?.message ||
            "Something went wrong",
          color: "danger",
        });
        setIsLoading(false);
      }
    } catch (e) {
      addToast({
        title:
          e?.data?.error ||
          e?.data?.message ||
          e?.message ||
          "Something went wrong",
        color: "danger",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-130px)] items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardBody className="p-10">
          <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={LoginSchema}
            onSubmit={(values) => loginHandler(values)}
          >
            {({
              values,
              errors,
              touched,
              handleSubmit,
              setFieldValue,
              setFieldTouched,
            }) => (
              <form onSubmit={handleSubmit}>
                {/* Test credentials buttons (only shown in dev environment) */}
                {import.meta.env.VITE_ENVIRONMENT === "dev" && (
                  <div className="flex gap-2 mb-4">
                    <Button
                      type="button"
                      size="sm"
                      variant="bordered"
                      onClick={() => {
                        setFieldValue("email", TEST_CREDENTIALS.user.email);
                        setFieldValue(
                          "password",
                          TEST_CREDENTIALS.user.password
                        );
                      }}
                    >
                      User
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="bordered"
                      onClick={() => {
                        setFieldValue("email", TEST_CREDENTIALS.admin.email);
                        setFieldValue(
                          "password",
                          TEST_CREDENTIALS.admin.password
                        );
                      }}
                    >
                      Admin
                    </Button>
                  </div>
                )}
                <div className="flex flex-col gap-4">
                  <Input
                    label="Email"
                    size="sm"
                    type="email"
                    name="email"
                    value={values.email}
                    onValueChange={(v) => setFieldValue("email", v)}
                    onBlur={() => setFieldTouched("email", true)}
                    isInvalid={touched.email && !!errors.email}
                    errorMessage={touched.email ? errors.email : ""}
                    autoComplete="email"
                    variant="bordered"
                  />

                  <Input
                    label="Password"
                    size="sm"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={values.password}
                    onValueChange={(v) => setFieldValue("password", v)}
                    onBlur={() => setFieldTouched("password", true)}
                    isInvalid={touched.password && !!errors.password}
                    errorMessage={touched.password ? errors.password : ""}
                    autoComplete="current-password"
                    variant="bordered"
                    endContent={
                      <Button
                        type="button"
                        size="sm"
                        variant="light"
                        onPress={() => setShowPassword(!showPassword)}
                        isIconOnly
                        className="mb-0.5"
                      >
                        {!showPassword ? <BsEye className="h-6 w-6" /> : <BsEyeSlash className="h-6 w-6" />}
                      </Button>
                    }
                  />

                  <Button
                    color="primary"
                    type="submit"
                    isLoading={isLoading}
                    className="w-full"
                  >
                    Login
                  </Button>

                  <p className="text-sm text-center text-gray-500">
                    Don’t have an account?{" "}
                    <Link to="/signup" className="text-primary font-medium">
                      Sign up
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </Formik>
        </CardBody>
      </Card>
    </div>
  );
}

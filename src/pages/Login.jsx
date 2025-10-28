import { useSetAtom } from "jotai";
import { authAtom } from "../atoms/authAtom";
import { Link, useNavigate } from "react-router";
import * as Yup from "yup";
import { Button, Card, CardBody, Input } from "@heroui/react";
import { Formik } from "formik";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .required("Required"),
});

export default function Login() {
  const setAuth = useSetAtom(authAtom);
  const navigate = useNavigate();

  function handleLogin(role) {
    // Set cookie
    document.cookie = `user_role=${role}; path=/; max-age=86400`;

    // Update Jotai (this triggers AuthWatcher)
    setAuth({
      initialized: true,
      loggedIn: true,
      role,
      name: role === "admin" ? "Admin Demo" : "User Demo",
    });

    // Small delay before redirect ensures Jotai update propagates
    setTimeout(() => {
      navigate(role === "admin" ? "/admin" : "/user", { replace: true });
    }, 100);
  }

  return (
    <div className="flex min-h-[calc(100vh-130px)] items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardBody className="p-10">
          <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={(values, { setSubmitting }) => {
              // loginHandler(values);
              handleLogin("admin");
              setSubmitting(false);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              setFieldTouched,
            }) => (
              <form onSubmit={handleSubmit}>
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
                    type="password"
                    name="password"
                    value={values.password}
                    onValueChange={(v) => setFieldValue("password", v)}
                    onBlur={() => setFieldTouched("password", true)}
                    isInvalid={touched.password && !!errors.password}
                    errorMessage={touched.password ? errors.password : ""}
                    autoComplete="current-password"
                    variant="bordered"
                  />

                  <Button
                    color="primary"
                    type="submit"
                    disabled={isSubmitting}
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

import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Button, Card, CardBody, Input } from "@heroui/react";
import { Link } from "react-router";

// ✅ Validation Schema
const SignupSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(3, "Full name must be at least 3 characters")
    .required("Required"),
  email: Yup.string().email("Invalid email address").required("Required"),
  phone: Yup.string()
    .matches(/^[0-9]{10,15}$/, "Phone must be 10–15 digits")
    .required("Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .required("Required"),
});

const Signup = () => (
  <div className="flex min-h-[calc(100vh-130px)] items-center justify-center p-4">
    <Card className="w-full max-w-lg shadow-lg">
      <CardBody className="p-10">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>

        <Formik
          initialValues={{ fullName: "", email: "", phone: "", password: "" }}
          validationSchema={SignupSchema}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 400);
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
                  label="Full Name"
                  size="sm"
                  name="fullName"
                  value={values.fullName}
                  onValueChange={(v) => setFieldValue("fullName", v)}
                  onBlur={() => setFieldTouched("fullName", true)}
                  isInvalid={touched.fullName && !!errors.fullName}
                  errorMessage={touched.fullName ? errors.fullName : ""}
                  autoComplete="name"
                  variant="bordered"
                />

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
                  label="Phone"
                  size="sm"
                  type="tel"
                  name="phone"
                  value={values.phone}
                  onValueChange={(v) => setFieldValue("phone", v)}
                  onBlur={() => setFieldTouched("phone", true)}
                  isInvalid={touched.phone && !!errors.phone}
                  errorMessage={touched.phone ? errors.phone : ""}
                  autoComplete="tel"
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
                  autoComplete="new-password"
                  variant="bordered"
                />

                <Button
                  color="primary"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  Sign Up
                </Button>

                <p className="text-sm text-center text-gray-500">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary font-medium">
                    Login
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

export default Signup;

import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { addToast, Button, Card, CardBody, Input } from "@heroui/react";
import { Link, useNavigate } from "react-router";
import userService from "../../api-services/userService";
import { BsEye, BsEyeSlash } from "react-icons/bs";

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

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const signUpHandler = async (values, { setErrors }) => {
    setLoading(true);
    try {
      const response = await userService.signup(
        values.fullName,
        values.email,
        values.phone,
        values.password
      );

      if (response?.status === 201) {
        // Small delay before redirect ensures Jotai update propagates
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 100);

        addToast({
          title: "Login successful",
          color: "success",
        });
      } else {
        addToast({
          title: response?.data?.message || "Something went wrong",
          color: "danger",
        });
        setLoading(false);
      }
    } catch (e) {
      if (e?.data?.error) {
        setErrors(e.data.error);
      }

      addToast({
        title: e?.data?.message || e?.message || "Something went wrong",
        color: "danger",
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-130px)] items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardBody className="p-10">
          <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>

          <Formik
            initialValues={{
              fullName: "Amit",
              email: "amit@gm.co",
              phone: "01918876543",
              password: "Amit1212",
            }}
            validationSchema={SignupSchema}
            onSubmit={(values, { setErrors }) =>
              signUpHandler(values, { setErrors })
            }
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
                        {!showPassword ? (
                          <BsEye className="h-6 w-6" />
                        ) : (
                          <BsEyeSlash className="h-6 w-6" />
                        )}
                      </Button>
                    }
                  />

                  <Button
                    color="primary"
                    type="submit"
                    isLoading={loading}
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
};

export default Signup;

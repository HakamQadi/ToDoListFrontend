"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";
import ErrorAlert from "../components/ErrorAlert";

const validationSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .required("Password is required"),
  role: Yup.number().required("Role is required"),
});

const roleOptions = [
  { value: 0, label: "User" },
  { value: 1, label: "Admin" },
];

const Register = () => {
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError("");
      const userData = await authService.register(values);
      login(userData);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8">
          <Formik
            initialValues={{
              firstName: "",
              lastName: "",
              email: "",
              password: "",
              role: 0,
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              isSubmitting,
            }) => (
              <Form className="space-y-6">
                <ErrorAlert message={error} />

                <Input
                  label="First Name"
                  type="text"
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.firstName && errors.firstName}
                />

                <Input
                  label="Last Name"
                  type="text"
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.lastName && errors.lastName}
                />

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && errors.email}
                />

                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && errors.password}
                />

                <Select
                  label="Role"
                  name="role"
                  value={values.role}
                  // onChange={handleChange}
                  onChange={(e) =>
                    handleChange({
                      target: { name: "role", value: Number(e.target.value) },
                    })
                  }
                  onBlur={handleBlur}
                  options={roleOptions}
                  error={touched.role && errors.role}
                />

                <Button
                  type="submit"
                  className="w-full"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Sign up
                </Button>
              </Form>
            )}
          </Formik>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

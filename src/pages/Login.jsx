"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { useAuth } from "../context/AuthContext"
import { authService } from "../services/authService"
import Input from "../components/Input"
import Button from "../components/Button"
import ErrorAlert from "../components/ErrorAlert"

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().required("Password is required"),
})

const Login = () => {
  const [error, setError] = useState("")
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError("")
      const userData = await authService.login(values)
      login(userData)
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-8">
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
              <Form className="space-y-6">
                <ErrorAlert message={error} />

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

                <Button type="submit" className="w-full" loading={isSubmitting} disabled={isSubmitting}>
                  Sign in
                </Button>
              </Form>
            )}
          </Formik>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

import React from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import swal from 'sweetalert2';
import { BACKEND_URL } from '../constans';


const Signup = () => {
  const validationSchema = Yup.object({
    firstname: Yup.string().required('First name is required'),
    lastname: Yup.string().required('Last name is required'),
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      await axios.post(`${BACKEND_URL}/api/signup`, values);
      swal.fire({
        icon: 'success',
        title: 'Signup successful',
        text: 'You have successfully signed up',
      });
      resetForm();
    } catch (error) {
      console.error('Error signing up', error);
      swal.fire({
        icon: 'error',
        title: 'Error signing up',
        text: error.response.data.error,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstname">
              First Name
            </label>
            <Field name="firstname" type="text" className="input" />
            <ErrorMessage name="firstname" component="div" className="text-red-500 text-xs" />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastname">
              Last Name
            </label>
            <Field name="lastname" type="text" className="input" />
            <ErrorMessage name="lastname" component="div" className="text-red-500 text-xs" />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <Field name="username" type="text" className="input" />
            <ErrorMessage name="username" component="div" className="text-red-500 text-xs" />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <Field name="email" type="email" className="input" />
            <ErrorMessage name="email" component="div" className="text-red-500 text-xs" />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <Field name="password" type="password" className="input" />
            <ErrorMessage name="password" component="div" className="text-red-500 text-xs" />
          </div>

          <div className="flex items-center justify-between">
            <button type="submit" className="button w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing up...' : 'Signup'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Signup;

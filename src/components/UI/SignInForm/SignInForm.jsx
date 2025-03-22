import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../Logo/Logo';
import styles from './SignInForm.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { signInUser } from '../../../redux/auth/operations';
import toast from 'react-hot-toast';
import { selectIsLoading } from '../../../redux/auth/selectors';
import Loader from '../../Utils/Loader/Loader';

import { setPosition, toggleModal } from '../../../redux/modal/slice';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';

const SignInSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Too short!').required('Required'),
});

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = (values, { resetForm }) => {
    dispatch(signInUser(values))
      .unwrap()
      .then(() => {
        toast.success(`Welcome, User!`, {
          style: { backgroundColor: '#9be1a0', fontWeight: 'medium' },
          iconTheme: { primary: 'white', secondary: 'black' },
        });

        resetForm();
        setTimeout(() => navigate('/tracker'), 2000);
      })
      .catch(error => {
        const errorMessages = {
          400: 'Bad request. Invalid input data.',
          401: 'Unauthorized. Session not found.',
          404: 'User not found.',
          409: 'A contact with this email already exists.',
          500: 'Something went wrong. Please try again later.',
        };

        const message = errorMessages[error?.status] || 'An unknown error occurred.';
        toast.error(message, { style: { backgroundColor: '#FFCCCC', fontWeight: 'medium' } });
      });
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await axios.get('/auth/get-oauth-url');
      const url = response.data.data.url;

      window.location.href = url;
    } catch (e) {
      console.log('Error during getting OAuth url:', e);
    }
  };

  return (
    <section className={styles.section}>
      {isLoading && <Loader />}
      <Logo />
      <ThemeToggle />
      <section className={styles.signinSection}>
        <h2 className={styles.title}>Sign In</h2>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={SignInSchema}
          onSubmit={handleSubmit}
          validateOnBlur={false}
          validateOnChange={false}
        >
          {({ errors, touched, handleSubmit, setFieldTouched }) => (
            <Form className={styles.signinForm} noValidate onSubmit={handleSubmit}>
              <label className={styles.label}>Email</label>
              <Field
                name="email"
                type="email"
                placeholder="Enter your email"
                className={`${styles.input} ${
                  touched.email && errors.email ? styles.errorInput : ''
                }`}
                onBlur={() => setFieldTouched('email', true)}
              />
              <ErrorMessage name="email" component="div" className={styles.errorMessage} />

              <label className={styles.label}>Password</label>
              <div className={styles.passwordWrapper}>
                <Field
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className={`${styles.input} ${
                    touched.password && errors.password ? styles.errorInput : ''
                  }`}
                  onBlur={() => setFieldTouched('password', true)}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className={styles.togglePassword}
                >
                  <svg className={styles.icon} width="24" height="24">
                    <use
                      xlinkHref={`/images/icons.svg#${showPassword ? 'icon-eye' : 'icon-eye-off'}`}
                    />
                  </svg>
                </button>
              </div>
              <ErrorMessage name="password" component="div" className={styles.errorMessage} />

              <p className={styles.forgotPassword}>
                Forgot your password?{' '}
                <a
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    dispatch(toggleModal('forgotPassword'), dispatch(setPosition('null')));
                  }}
                  className={styles.forgotPasswordLink}
                >
                  Click here
                </a>{' '}
                to reset your password.
              </p>

              <button type="submit" className={styles.signinBtn}>
                Sign In
              </button>
            </Form>
          )}
        </Formik>
        <button onClick={handleGoogleLogin} className={styles.googlelink}>
          <FcGoogle />
          Sign in with Google
        </button>
        <p className={styles.signupLink}>
          Don't have an account?{' '}
          <Link to="/signup" className={styles.signupLinkText}>
            Sign Up
          </Link>
        </p>
      </section>
    </section>
  );
};

export default SignInPage;

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
import { useTranslation } from 'react-i18next';
import LanguageButtons from '../LanguageButtons/LanguageButtons';

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const isLoading = useSelector(selectIsLoading);

  const SignInSchema = Yup.object().shape({
    email: Yup.string()
      .email(t('validation.invalid_email'))
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, t('validation.valid_email'))
      .required(t('validation.email_required')),
    password: Yup.string()
      .min(6, t('validation.password_min'))
      .required(t('validation.password_required')),
  });

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = (values, { resetForm }) => {
    dispatch(signInUser(values))
      .unwrap()
      .then(() => {
        const userEmail = values.email.split('@')[0];
        toast.success(t('notifications.welcome_login', { userEmail }), {
          style: { backgroundColor: '#9be1a0', fontWeight: 'medium' },
          iconTheme: { primary: 'white', secondary: 'black' },
        });
        resetForm();
        setTimeout(() => navigate('/tracker'), 2000);
      })
      .catch(error => {
        const errorMessages = {
          400: t('errors.err_400'),
          401: t('errors.err_401'),
          404: t('errors.err_404'),
          500: t('errors.err_500'),
        };

        if (typeof error === 'string') {
          toast.error(error, {
            style: { backgroundColor: '#FFCCCC', fontWeight: 'semibold' },
            iconTheme: {
              primary: 'white',
              secondary: 'red',
            },
          });
          return;
        }

        const message = errorMessages[error?.status] || t('errors.unknown_error');
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
      <LanguageButtons />
      <section className={styles.signinSection}>
        <h2 className={styles.title}>{t('common.sign_in')}</h2>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={SignInSchema}
          onSubmit={handleSubmit}
          validateOnBlur={false}
          validateOnChange={false}
        >
          {({ errors, touched, handleSubmit, setFieldTouched }) => (
            <Form className={styles.signinForm} noValidate onSubmit={handleSubmit}>
              <label className={styles.label}>
                {t('common.email_label')}
                <Field
                  name="email"
                  type="email"
                  placeholder={t('notifications.enter_email')}
                  className={`${styles.input} ${
                    touched.email && errors.email ? styles.errorInput : ''
                  }`}
                  onBlur={() => setFieldTouched('email', true)}
                />
                <ErrorMessage name="email" component="div" className={styles.errorMessage} />
              </label>

              <label className={styles.label}>
                {t('common.password_label')}
                <div className={styles.passwordWrapper}>
                  <Field
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('notifications.enter_password')}
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
                        xlinkHref={`/images/icons.svg#${
                          showPassword ? 'icon-eye' : 'icon-eye-off'
                        }`}
                      />
                    </svg>
                  </button>
                </div>
                <ErrorMessage name="password" component="div" className={styles.errorMessage} />
              </label>

              <p className={styles.forgotPassword}>
                {t('signInForm.help')}&nbsp;{' '}
                <a
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    dispatch(toggleModal('forgotPassword'), dispatch(setPosition('null')));
                  }}
                  className={styles.forgotPasswordLink}
                >
                  {t('signInForm.reset_password')}
                </a>{' '}
                {t('signInForm.help_continue')}
              </p>

              <button type="submit" className={styles.signinBtn}>
                {t('common.sign_in')}
              </button>
            </Form>
          )}
        </Formik>
        <button onClick={handleGoogleLogin} className={styles.googlelink}>
          <FcGoogle />
          {t('common.sign_up_google')}{' '}
        </button>
        <p className={styles.signupLink}>
          {t('signInForm.without_account')}&nbsp;{' '}
          <Link to="/signup" className={styles.signupLinkText}>
            {t('common.sign_up')}
          </Link>
        </p>
      </section>
    </section>
  );
};

export default SignInPage;

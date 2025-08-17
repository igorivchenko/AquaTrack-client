import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../Logo/Logo';
import styles from './SignUpForm.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../redux/auth/operations';
import toast from 'react-hot-toast';
import Loader from '../../Utils/Loader/Loader';
import { selectIsLoading } from '../../../redux/auth/selectors';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import { FcGoogle } from 'react-icons/fc';
import { useTranslation } from 'react-i18next';
import LanguageButtons from '../LanguageButtons/LanguageButtons';
import { api } from '../../../utils/axios.config';

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState({
    password: false,
    repeatPassword: false,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const isLoading = useSelector(selectIsLoading);

  const SignUpSchema = Yup.object().shape({
    email: Yup.string()
      .email(t('validation.invalid_email'))
      .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, t('validation.valid_email'))
      .required(t('validation.email_required')),
    password: Yup.string()
      .min(6, t('validation.password_min'))
      .max(30, t('validation.password_max'))
      .required(t('validation.password_required')),
    repeatPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('validation.password_match'))
      .required(t('validation.password_required')),
  });

  const togglePasswordVisibility = field => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = (values, { resetForm }) => {
    const { email, password } = values;
    const userData = {
      email,
      password,
    };
    dispatch(registerUser(userData))
      .unwrap()
      .then(() => {
        toast.success(t('notifications.welcome'), {
          style: { backgroundColor: '#9be1a0', fontWeight: 'semibold' },
          iconTheme: { primary: 'white', secondary: 'black' },
        });

        resetForm();

        setTimeout(() => {
          navigate('/tracker');
        }, 2000);
      })
      .catch(error => {
        const errorMessages = {
          400: t('errors.err_400'),
          409: t('errors.err_409'),
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

        const status = error?.status;
        const message = errorMessages[status] || t('unknown_error');
        toast.error(message, {
          style: { backgroundColor: '#FFCCCC', fontWeight: 'semibold' },
          iconTheme: {
            primary: 'white',
            secondary: 'red',
          },
        });
      });
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await api.get('/auth/get-oauth-url');
      const url = response.data.data.url;

      window.location.href = url;
    } catch (e) {
      console.log('Error during getting OAuth url:', e.message);
    }
  };

  return (
    <section className={styles.section}>
      {isLoading && <Loader />}
      <Logo />
      <ThemeToggle />
      <LanguageButtons />
      <section className={styles.signupSection}>
        <h2 className={styles.title}>{t('common.sign_up')}</h2>
        <Formik
          initialValues={{ email: '', password: '', repeatPassword: '' }}
          validationSchema={SignUpSchema}
          onSubmit={handleSubmit}
          validateOnBlur={false}
          validateOnChange={false}
        >
          {({ errors, touched, handleSubmit, setFieldTouched }) => (
            <Form className={styles.signupForm} noValidate onSubmit={handleSubmit}>
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
                    type={showPassword.password ? 'text' : 'password'}
                    placeholder={t('notifications.enter_password')}
                    className={`${styles.input} ${
                      touched.password && errors.password ? styles.errorInput : ''
                    }`}
                    onBlur={() => setFieldTouched('password', true)}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('password')}
                    className={styles.togglePassword}
                  >
                    <svg className={styles.icon} width="24" height="24">
                      <use
                        xlinkHref={`/images/icons.svg#${
                          showPassword.password ? 'icon-eye' : 'icon-eye-off'
                        }`}
                      />
                    </svg>
                  </button>
                </div>
                <ErrorMessage name="password" component="div" className={styles.errorMessage} />
              </label>

              <label className={styles.label}>
                {t('common.repeat_password_label')}
                <div className={styles.passwordWrapper}>
                  <Field
                    name="repeatPassword"
                    type={showPassword.repeatPassword ? 'text' : 'password'}
                    placeholder={t('notifications.repeat_password')}
                    className={`${styles.input} ${
                      touched.repeatPassword && errors.repeatPassword ? styles.errorInput : ''
                    }`}
                    onBlur={() => setFieldTouched('repeatPassword', true)}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('repeatPassword')}
                    className={styles.togglePassword}
                  >
                    <svg className={styles.icon} width="24" height="24">
                      <use
                        xlinkHref={`/images/icons.svg#${
                          showPassword.repeatPassword ? 'icon-eye' : 'icon-eye-off'
                        }`}
                      />
                    </svg>
                  </button>
                </div>
                <ErrorMessage
                  name="repeatPassword"
                  component="div"
                  className={styles.errorMessage}
                />
              </label>

              <button type="submit" className={styles.signupBtn}>
                {t('common.sign_up')}{' '}
              </button>
            </Form>
          )}
        </Formik>
        <button onClick={handleGoogleLogin} className={styles.googlelink}>
          <FcGoogle />
          {t('common.sign_up_google')}{' '}
        </button>
        <p className={styles.signinLink}>
          {t('signUpForm.with_account')}&nbsp;
          <Link to="/signin" className={styles.signinLinkText}>
            {t('common.sign_in')}
          </Link>
        </p>
      </section>
    </section>
  );
};

export default SignUpPage;

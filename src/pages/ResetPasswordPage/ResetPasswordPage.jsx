import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { resetPassword } from '../../redux/auth/operations';
import toast from 'react-hot-toast';
import clsx from 'clsx';
import styles from './ResetPasswordPage.module.css';
import { useTranslation } from 'react-i18next';
import LanguageButtons from '../../components/UI/LanguageButtons/LanguageButtons';
import { formattedErrorKey } from '../../i18n/utils/formattedErrorKey';

const ResetPasswordPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(location.search).get('token');
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const ResetPasswordSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, t('validation.password_min'))
      .required(t('validation.password_required')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('validation.password_match'))
      .required(t('validation.password_required')),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(prev => !prev);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(prev => !prev);

  const handleSubmit = async (values, { resetForm, setSubmitting }) => {
    setIsSubmitting(true);
    try {
      await dispatch(resetPassword({ token, password: values.password })).unwrap();
      toast.success(t('notifications.changed_password'), {
        style: { backgroundColor: '#9be1a0', fontWeight: 'semibold' },
        iconTheme: { primary: 'white', secondary: 'black' },
      });
      resetForm();
      navigate('/signin');
    } catch (e) {
      toast.error(
        t(`errors.${formattedErrorKey(e.response?.data?.message)}`) ||
          t('errors.failed_change_pwd'),
        {
          style: { backgroundColor: '#FFCCCC', fontWeight: 'semibold' },
          iconTheme: {
            primary: 'white',
            secondary: 'red',
          },
        }
      );
    } finally {
      setSubmitting(false);
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.section}>
      <LanguageButtons />
      <div className="container">
        <section className={styles.ResetPasswordSection}>
          <h2 className={styles.title}>{t('changePasswordPage.change_pwd')}</h2>
          <Formik
            initialValues={{ password: '', confirmPassword: '' }}
            validationSchema={ResetPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, setFieldTouched, submitCount }) => (
              <Form className={styles.ResetPasswordForm}>
                <div className={styles.passwordWrapper}>
                  <Field
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('changePasswordPage.new_password')}
                    className={clsx(styles.input, {
                      [styles.errorInput]: submitCount > 0 && errors.password,
                    })}
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
                <ErrorMessage name="password" component="div" className={styles.ErrorMessage} />

                <div className={styles.passwordWrapper}>
                  <Field
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder={t('notifications.repeat_password')}
                    className={clsx(styles.input, {
                      [styles.errorInput]: submitCount > 0 && errors.confirmPassword,
                    })}
                    onBlur={() => setFieldTouched('confirmPassword', true)}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className={styles.togglePassword}
                  >
                    <svg className={styles.icon} width="24" height="24">
                      <use
                        xlinkHref={`/images/icons.svg#${
                          showConfirmPassword ? 'icon-eye' : 'icon-eye-off'
                        }`}
                      />
                    </svg>
                  </button>
                </div>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className={styles.ErrorMessage}
                />

                <div className={styles.buttonContainer}>
                  <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                    {t('common.change_pwd')}
                  </button>
                  <button
                    type="button"
                    className={styles.closeButton}
                    onClick={() => navigate('/signin')}
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </section>
      </div>
    </section>
  );
};

export default ResetPasswordPage;

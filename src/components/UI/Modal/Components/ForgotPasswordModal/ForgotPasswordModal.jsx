import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { sendResetEmail } from '../../../../../redux/auth/operations';
import toast from 'react-hot-toast';
import { toggleModal } from '../../../../../redux/modal/slice';
import styles from './ForgotPasswordModal.module.css';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
});

const ForgotPasswordModal = () => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      await dispatch(sendResetEmail(values.email)).unwrap();
      toast.success('Reset link sent! Check your email.');
      resetForm();
      dispatch(toggleModal());
    } catch (error) {
      toast.error(error.message || 'Failed to send reset email');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalContent}>
      <h2 className={styles.modalHeader}>Forgot Password?</h2>
      <p className={styles.modalText}>
        We'll send you an email with a link to reset your password.
      </p>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={ForgotPasswordSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, submitCount, setFieldTouched }) => (
          <Form>
            <Field
              name="email"
              type="email"
              placeholder="Enter your email"
              className={`${styles.inputField} ${
                submitCount > 0 && errors.email ? styles.errorInput : ''
              }`}
              onBlur={() => setFieldTouched('email', true)}
            />
            <ErrorMessage name="email" component="div" className={styles.error} />

            <button className={styles['button-send']} type="submit" disabled={isSubmitting}>
              Send Reset Link
            </button>
            <button
              className={styles['button-close']}
              type="button"
              onClick={() => dispatch(toggleModal())}
            >
              Close
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ForgotPasswordModal;

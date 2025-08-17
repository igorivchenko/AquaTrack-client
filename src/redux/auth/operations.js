import { createAsyncThunk } from '@reduxjs/toolkit';
import i18next from 'i18next';
import { api, clearAuthHeader } from '../../utils/axios.config';
import { logoutUser } from './slice';

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/signup', userData);
      return response.data.data;
    } catch (error) {
      if (!error.response) {
        return rejectWithValue(i18next.t('errors.err_500'));
      }

      const status = error.response.status;
      const message = error.response.data?.message || i18next.t('errors.signUp_error');

      return rejectWithValue({ status, message });
    }
  }
);

export const signInUser = createAsyncThunk(
  'auth/signInUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/signin', userData);
      return response.data.data.accessToken;
    } catch (error) {
      if (!error.response) {
        return rejectWithValue(i18next.t('errors.err_500'));
      }

      const status = error.response.status;
      const message = error.response.data?.message || i18next.t('errors.signUp_error');

      return rejectWithValue({ status, message });
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/logout');
    clearAuthHeader();
    localStorage.removeItem('persist:auth');
    return response.data;
  } catch (error) {
    if (!error.response) {
      return rejectWithValue(i18next.t('errors.err_500'));
    }
    return rejectWithValue(error.response?.data);
  }
});

export const refreshUser = createAsyncThunk(
  'auth/refresh',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.post('/auth/refresh');

      return res.data.data.accessToken;
    } catch (err) {
      dispatch(logoutUser());
      return rejectWithValue(err.message);
    }
  }
);

export const getTotalUsers = createAsyncThunk('auth/getLTotalUsers', async (_, thunkAPI) => {
  try {
    const response = await api.get('/auth/totalUsers');
    return response.data.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data);
  }
});

export const sendResetEmail = createAsyncThunk(
  'auth/sendResetEmail',
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/send-reset-email', { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || i18next.t('errors.Failed_to_send_the_email_please_try_again_later')
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/reset-pwd', { token, password });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || i18next.t('errors.failed_change_pwd'));
    }
  }
);

export const signInWithGoogle = createAsyncThunk(
  'auth/signInWithGoogle',
  async (code, { rejectWithValue }) => {
    try {
      const response = await api.post('auth/confirm-oauth', { code });
      return response.data.data.accessToken;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send URL');
    }
  }
);

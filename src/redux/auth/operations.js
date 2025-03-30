import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import i18next from 'i18next';

axios.defaults.baseURL = 'https://aquatrack-api-c2xu.onrender.com';
axios.defaults.withCredentials = true;

export const setAuthHeader = token => {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const clearAuthHeader = () => {
  axios.defaults.headers.common.Authorization = '';
};

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/auth/signup', userData);
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
      const response = await axios.post('/auth/signin', userData, { withCredentials: true });
      return response.data;
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
    const response = await axios.post('/auth/logout');
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

export const refreshUser = createAsyncThunk('auth/refresh', async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const persistedToken = state.auth.token;

  if (!persistedToken) {
    return thunkAPI.rejectWithValue(i18next.t('errors.unable_currentUser'));
  }

  try {
    setAuthHeader(persistedToken);
    const res = await axios.post('/auth/refresh');
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const getTotalUsers = createAsyncThunk('auth/getLTotalUsers', async (_, thunkAPI) => {
  try {
    const response = await axios.get('/auth/totalUsers');
    return response.data.data;
  } catch (e) {
    return thunkAPI.rejectWithValue(e.response?.data);
  }
});

export const sendResetEmail = createAsyncThunk(
  'auth/sendResetEmail',
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post('/auth/send-reset-email', { email });
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
      const response = await axios.post('/auth/reset-pwd', { token, password });
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
      const response = await axios.post('auth/confirm-oauth', { code });
      return response.data.data.accessToken;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send URL');
    }
  }
);

import { createAsyncThunk } from '@reduxjs/toolkit';
import i18next from 'i18next';
import { api } from '../../utils/axios.config';

export const fetchUserInfo = createAsyncThunk(
  'user/fetchUserInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users/current');
      return response.data.data;
    } catch (error) {
      if (!error.response) {
        return rejectWithValue(i18next.t('errors.err_500'));
      }
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateUserInfo = createAsyncThunk(
  'user/updateUserInfo',
  async (formData, thunkAPI) => {
    try {
      const response = await api.patch('/users', formData);
      return response.data.data;
    } catch (error) {
      if (!error.response) {
        return thunkAPI.rejectWithValue(i18next.t('errors.err_500'));
      }
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateUserAvatar = createAsyncThunk(
  'user/updateUserAvatar',
  async (formData, thunkAPI) => {
    try {
      const response = await api.patch('/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

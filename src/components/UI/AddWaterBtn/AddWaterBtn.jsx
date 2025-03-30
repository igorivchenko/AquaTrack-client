import React from 'react';
import s from './AddWaterBtn.module.css';
import { useDispatch } from 'react-redux';
import { setPosition, toggleModal } from '../../../redux/modal/slice';
import { useTranslation } from 'react-i18next';

const AddWaterBtn = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  return (
    <button
      className={s.addWaterBtn}
      onClick={() => dispatch(toggleModal('add'), dispatch(setPosition('null')))}
    >
      + {t('common.add_water')}
    </button>
  );
};

export default AddWaterBtn;

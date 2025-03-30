import React from 'react';
import WaterForm from '../WaterForm/WaterForm.jsx';
import styles from './WaterModal.module.css';
import { useTranslation } from 'react-i18next';

const WaterModal = ({ type, initialData }) => {
  const { t } = useTranslation();
  const title = type === 'add' ? t('common.add_water') : t('waterModal.edit_entered_amount');
  const subtitle = type === 'add' ? t('waterModal.entered_data') : t('waterModal.choose_value');

  return (
    <div className={`${styles.waterModal}`}>
      <h2 className={styles.title}>{title}</h2>
      <h3 className={styles.subtitle}>{subtitle}</h3>
      <WaterForm type={type} initialData={initialData} />
    </div>
  );
};

export default WaterModal;

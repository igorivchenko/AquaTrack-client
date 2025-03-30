import React from 'react';
import s from './WaterDailyNorma.module.css';
import { useSelector } from 'react-redux';
import { selectUserDailyNorm } from '../../../redux/user/selectors';
import { useTranslation } from 'react-i18next';

const WaterDailyNorma = () => {
  const dailyNorma = useSelector(selectUserDailyNorm);
  const dailyNormaLitr = (dailyNorma / 1000).toFixed(1);
  const { t } = useTranslation();
  return (
    <div className={s.waterDailyNorma}>
      <span className={s.normaValue}>
        {dailyNormaLitr} {t('common.l')}
      </span>
      <span className={s.normaText}>{t('trackerPage.daily_norm')}</span>
    </div>
  );
};

export default WaterDailyNorma;

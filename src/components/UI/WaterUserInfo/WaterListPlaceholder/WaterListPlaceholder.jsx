import { useTranslation } from 'react-i18next';
import css from './WaterListPlaceholder.module.css';

const WaterPlaceholder = () => {
  const { t } = useTranslation();
  return (
    <div className={css.placeholderContainer}>
      <h2 className={css.title}>{t('trackerPage.waterList_placeholder_title')}</h2>
      <p className={css.text}>{t('trackerPage.waterList_placeholder_text')}</p>
    </div>
  );
};

export default WaterPlaceholder;

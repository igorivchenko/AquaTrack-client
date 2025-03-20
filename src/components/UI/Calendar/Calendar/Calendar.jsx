import { useEffect } from 'react';
import css from './Calendar.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectToken } from '../../../../redux/auth/selectors';
import CalendarItem from '../CalendarItem/CalendarItem';
import { selectMonthWaterData } from '../../../../redux/water/selectors';
import { getWaterByMonth } from '../../../../redux/water/operations';
import useGetAllDaysMonth from '../hooks/useGetAllDaysMonth';

const Calendar = ({ monthNumber, year }) => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const monthWaterData = useSelector(selectMonthWaterData);
  const date = new Date(year, monthNumber + 1, 0, 0, 0, 0, 0).toISOString();

  useEffect(() => {
    if (date) {
      dispatch(getWaterByMonth({ date, token }));
    }
  }, [dispatch, token, date]);
  const [allDaysWithPercents] = useGetAllDaysMonth(monthWaterData, monthNumber, year);

  return (
    <div className={css.calendarWrapper}>
      {allDaysWithPercents.map(day => {
        const dateNow = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
        const calendarDate = new Date(year, monthNumber, day.day, 0, 0, 0, 0).toISOString();
        const calendarDateBefore = new Date(
          year,
          monthNumber,
          day.day + 1,
          0,
          0,
          0,
          0
        ).toISOString();
        const isCurrentDate = dateNow === calendarDate;
        const isFuture = dateNow < calendarDate;

        return (
          <CalendarItem
            key={day.day}
            day={day.day}
            totalDayWater={day.totalDayWater}
            isCurrentDate={isCurrentDate}
            token={token}
            date={calendarDateBefore}
            isFuture={isFuture}
          />
        );
      })}
    </div>
  );
};

export default Calendar;

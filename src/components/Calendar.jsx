import { useState, useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isWeekend,
  isSaturday,
  isSunday,
} from 'date-fns';
import { publicHolidays, leavePeriods } from '../data/leaveData';
import Lottie from 'lottie-react';
import trophyAnimation from '../assets/trophy_13311710.json';
import styles from './Calendar.module.css';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function Calendar({
  selectedDates,
  onDateSelect,
  activeFilter,
  disableWeekends,
  showHolidays,
  currentYear,
  onYearChange
}) {
  const [hoveredDate, setHoveredDate] = useState(null);

  // Get holidays for current year
  const holidays = useMemo(() => {
    return publicHolidays[currentYear] || [];
  }, [currentYear]);

  // Check if a date is a public holiday
  const getHoliday = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return holidays.find(h => h.date === dateStr);
  };

  // Get leave period status for a date
  const getLeaveStatus = (date) => {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    for (const period of leavePeriods) {
      const startCheck = month > period.startMonth ||
        (month === period.startMonth && day >= period.startDay);
      const endCheck = month < period.endMonth ||
        (month === period.endMonth && day <= period.endDay);

      if (startCheck && endCheck) {
        return period;
      }
    }
    return null;
  };

  // Check if month is a Grand Final month (June = 5, November = 10)
  const isGrandFinalMonth = (monthIndex) => {
    return monthIndex === 5 || monthIndex === 10; // June or November
  };

  // Get tooltip content for a date
  const getTooltipContent = (date) => {
    // Weekend tooltip
    if (isWeekend(date)) {
      const dayName = isSaturday(date) ? 'Saturday' : 'Sunday';
      return { text: `Weekend (${dayName})`, status: null };
    }

    // Holiday tooltip
    const holiday = getHoliday(date);
    if (holiday) {
      return { text: holiday.name, status: null };
    }

    // Leave period tooltip
    const status = getLeaveStatus(date);
    if (status) {
      return { 
        text: status.note || status.label, 
        status: status.status
      };
    }

    return null;
  };

  // Check if date should be highlighted based on active filters
  const shouldHighlight = (date) => {
    if (!activeFilter || activeFilter.length === 0) return null;

    const status = getLeaveStatus(date);
    if (!status) return null;

    return activeFilter.includes(status.status) ? status.status : null;
  };

  // Check if date is selected
  const isSelected = (date) => {
    return selectedDates.some(d => isSameDay(new Date(d), date));
  };

  // Handle date click
  const handleDateClick = (date) => {
    // Weekends are never selectable (no work, no need to apply leave)
    if (isWeekend(date)) return;
    // Holidays are never selectable (no work, no need to apply leave)
    const holiday = getHoliday(date);
    if (holiday) return;

    onDateSelect(date);
  };

  // Get CSS class for date cell
  const getDateClass = (date, monthDate) => {
    const classes = [styles.dateCell];

    if (!isSameMonth(date, monthDate)) {
      classes.push(styles.otherMonth);
      return classes.join(' ');
    }

    const holiday = getHoliday(date);
    const status = getLeaveStatus(date);
    const weekend = isWeekend(date);

    // Weekends - visual styling controlled by toggle, but always non-selectable
    if (weekend) {
      classes.push(styles.weekend);
      // Only apply grayed-out styling when toggle is ON
      if (disableWeekends) {
        classes.push(styles.disabled);
      }
    }

    // Holidays - visual styling controlled by toggle, but always non-selectable
    if (holiday && showHolidays) {
      classes.push(styles.holiday);
    }

    // Apply filter highlight (but not on holidays when holiday styling is active)
    const highlightStatus = shouldHighlight(date);
    if (highlightStatus && !(holiday && showHolidays)) {
      classes.push(styles[`highlight-${highlightStatus}`]);
    }

    // Check if date is selected
    if (isSelected(date)) {
      // Apply color-coded styling based on leave period type
      if (status && status.status === 'grand-final') {
        classes.push(styles.selectedGrandFinal);
      } else if (status && status.status === 'busy') {
        classes.push(styles.selectedBusy);
      } else if (status && status.status === 'long-leave') {
        classes.push(styles.selectedLongLeave);
      } else if (status && status.status === 'leave-ok') {
        classes.push(styles.selectedLeaveOk);
      } else {
        classes.push(styles.selected);
      }
    }

    // Only weekdays that are not holidays are selectable
    if (!weekend && !holiday) {
      classes.push(styles.selectable);
    }

    return classes.join(' ');
  };

  // Render a single month
  const renderMonth = (monthIndex) => {
    const monthDate = new Date(currentYear, monthIndex, 1);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(new Date(day));
      day = addDays(day, 1);
    }

    const isGrandFinal = isGrandFinalMonth(monthIndex);
    const monthCardClass = isGrandFinal 
      ? `${styles.monthCard} ${styles.monthCardGrandFinal}` 
      : styles.monthCard;
    const monthHeaderClass = isGrandFinal 
      ? `${styles.monthHeader} ${styles.monthHeaderGrandFinal}` 
      : styles.monthHeader;

    return (
      <div key={monthIndex} className={monthCardClass}>
        {isGrandFinal && (
          <div className={styles.grandFinalOverlay} aria-hidden="true">
            <div className={styles.grandFinalOverlayContent}>
              <div className={styles.grandFinalLottie}>
                <Lottie animationData={trophyAnimation} loop={true} />
              </div>
              <div className={styles.grandFinalTitle}>Grand Final month</div>
              <div className={styles.grandFinalDesc}>
                Please avoid leave as this is biggest month of the year.
              </div>
            </div>
          </div>
        )}
        <div className={styles.monthContent}>
          <div className={monthHeaderClass}>
            {MONTHS[monthIndex]}
          </div>
          <div className={styles.weekdayHeader}>
            {WEEKDAYS.map(weekday => (
              <div key={weekday} className={styles.weekday}>
                {weekday.charAt(0)}
              </div>
            ))}
          </div>
          <div className={styles.daysGrid}>
            {days.map((date) => {
            const tooltipData = isSameMonth(date, monthDate) ? getTooltipContent(date) : null;
            const dateKey = format(date, 'yyyy-MM-dd');

            return (
              <div
                key={dateKey}
                className={getDateClass(date, monthDate)}
                onClick={() => isSameMonth(date, monthDate) && handleDateClick(date)}
                onMouseEnter={() => setHoveredDate(dateKey)}
                onMouseLeave={() => setHoveredDate(null)}
                data-date={dateKey}
              >
                {isSameMonth(date, monthDate) && (
                  <>
                    <span className={styles.dateNumber}>
                      {format(date, 'd')}
                    </span>
                    {tooltipData && hoveredDate === dateKey && (
                      <div className={`${styles.tooltip} ${
                        tooltipData.status === 'grand-final' ? styles.tooltipGrandFinal :
                        tooltipData.status === 'leave-ok' ? styles.tooltipLeaveOk :
                        tooltipData.status === 'long-leave' ? styles.tooltipLongLeave :
                        tooltipData.status === 'busy' ? styles.tooltipBusy : ''
                      }`}>
                        {tooltipData.text}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.calendarHeader}>
        <div className={styles.selectDatesLabel}>Select Leave Dates</div>
        <div className={styles.yearNav}>
          <button
            className={styles.yearNavBtn}
            onClick={() => onYearChange(currentYear - 1)}
            aria-label="Previous year"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className={styles.yearDisplay}>{currentYear}</span>
          <button
            className={styles.yearNavBtn}
            onClick={() => onYearChange(currentYear + 1)}
            aria-label="Next year"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div className={styles.monthsGrid}>
        {Array.from({ length: 12 }, (_, i) => renderMonth(i))}
      </div>
    </div>
  );
}

export default Calendar;

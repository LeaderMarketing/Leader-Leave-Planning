import { useMemo } from 'react';
import { legendItems, publicHolidays, leavePeriods } from '../data/leaveData';
import styles from './Legend.module.css';

function Legend({
  activeFilter,
  onFilterChange,
  disableWeekends,
  onToggleWeekends,
  showHolidays,
  onToggleHolidays,
  currentYear
}) {
  // Filter out public-holiday from display filters (moved to options)
  const displayFilters = useMemo(() => {
    return legendItems.filter(item => item.id !== 'public-holiday');
  }, []);

  // Generate Outlook calendar ICS file for busy periods
  const generateOutlookCalendar = () => {
    const events = [];
    const year = currentYear;

    // Add busy periods
    leavePeriods.forEach(period => {
      if (period.status === 'busy' || period.status === 'grand-final') {
        const startDate = new Date(year, period.startMonth - 1, period.startDay);
        const endDate = new Date(year, period.endMonth - 1, period.endDay + 1);

        const formatDate = (d) => {
          return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };

        const formatDateOnly = (d) => {
          return d.toISOString().split('T')[0].replace(/-/g, '');
        };

        // Determine category based on period type
        // Outlook uses these category names for colors
        const category = period.status === 'grand-final' ? 'Red Category' : 'Orange Category';

        events.push({
          title: period.status === 'grand-final' ? `GRAND FINAL - ${period.note}` : `BUSY PERIOD - ${period.note}`,
          startDate: formatDateOnly(startDate),
          endDate: formatDateOnly(endDate),
          description: period.status === 'grand-final'
            ? 'Please avoid taking leave during this period. This is the biggest month of the year.'
            : 'Busy period - Maximum 2-3 days leave recommended.',
          isAllDay: true,
          category: category,
          priority: period.status === 'grand-final' ? 1 : 5
        });
      }
    });

    // Generate ICS content with category support
    let icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//LEADER//Leave Planner//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:LEADER Busy Periods ${year}
`;

    events.forEach((event, index) => {
      icsContent += `BEGIN:VEVENT
UID:${index}-${year}-busy@leader.com.au
DTSTART;VALUE=DATE:${event.startDate}
DTEND;VALUE=DATE:${event.endDate}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
CATEGORIES:${event.category}
PRIORITY:${event.priority}
X-MICROSOFT-CDO-BUSYSTATUS:FREE
STATUS:CONFIRMED
TRANSP:TRANSPARENT
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:Reminder: ${event.title}
TRIGGER:-P1W
END:VALARM
END:VEVENT
`;
    });

    icsContent += 'END:VCALENDAR';

    // Download the file
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LEADER_Busy_Periods_${year}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.legend}>
      <div className={styles.legendSection}>
        <span className={styles.sectionLabel}>Display</span>
        <div className={styles.filterGroup}>
          {displayFilters.map(item => (
            <button
              key={item.id}
              className={`${styles.filterBtn} ${activeFilter.includes(item.id) ? styles.active : ''}`}
              onClick={() => onFilterChange(item.id)}
              style={{
                '--filter-color': item.color,
                '--filter-bg': `${item.color}15`,
              }}
              title={item.description}
            >
              <span className={styles.filterDot} />
              <span className={styles.filterLabel}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.legendSection}>
        <span className={styles.sectionLabel}>Options</span>
        <div className={styles.optionsGroup}>
          <button
            className={`${styles.toggleBtn} ${disableWeekends ? styles.active : ''}`}
            onClick={onToggleWeekends}
          >
            <span className={styles.toggleTrack}>
              <span className={styles.toggleThumb} />
            </span>
            <span className={styles.toggleLabel}>Disable weekends</span>
          </button>

          <button
            className={`${styles.toggleBtn} ${styles.holidayToggle} ${showHolidays ? styles.active : ''}`}
            onClick={onToggleHolidays}
          >
            <span className={styles.toggleTrack}>
              <span className={styles.toggleThumb} />
            </span>
            <span className={styles.toggleLabel}>Mark holidays</span>
          </button>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.legendSection}>
        <button
          className={styles.outlookBtn}
          onClick={generateOutlookCalendar}
          title="Download busy periods as calendar file for Outlook"
        >
          <img
            src="https://img.icons8.com/tiny-color/16/appointment-reminders.png"
            alt="Notification"
            className={styles.outlookIcon}
          />
          <span>Add Busy Dates to Outlook</span>
        </button>
      </div>
    </div>
  );
}

export default Legend;

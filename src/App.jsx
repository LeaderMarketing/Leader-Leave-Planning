import { useState, useCallback, useEffect } from 'react';
import { format, isSameDay } from 'date-fns';
import Calendar from './components/Calendar';
import Legend from './components/Legend';
import LeaveRequestPanel from './components/LeaveRequestPanel';
import leaderLogo from './assets/leader_new_logo.png';
import styles from './App.module.css';

function App() {
  const [selectedDates, setSelectedDates] = useState([]);
  const [activeFilter, setActiveFilter] = useState(['grand-final']);
  const [disableWeekends, setDisableWeekends] = useState(true);
  const [showHolidays, setShowHolidays] = useState(true);
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleDateSelect = useCallback((date) => {
    const dateStr = format(date, 'yyyy-MM-dd');

    setSelectedDates(prev => {
      const exists = prev.some(d => d === dateStr);
      if (exists) {
        return prev.filter(d => d !== dateStr);
      }
      return [...prev, dateStr];
    });
  }, []);

  const handleClearDates = useCallback(() => {
    setSelectedDates([]);
  }, []);

  const handleRemoveDate = useCallback((dateStr) => {
    setSelectedDates(prev => prev.filter(d => d !== dateStr));
  }, []);

  const handleFilterChange = useCallback((filter) => {
    setActiveFilter(prev => {
      if (prev.includes(filter)) {
        return prev.filter(item => item !== filter);
      }
      return [...prev, filter];
    });
  }, []);

  const handleToggleWeekends = useCallback(() => {
    setDisableWeekends(prev => !prev);
  }, []);

  const handleToggleHolidays = useCallback(() => {
    setShowHolidays(prev => !prev);
  }, []);

  const handleYearChange = useCallback((year) => {
    setCurrentYear(year);
  }, []);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.brand}>
            <img src={leaderLogo} alt="LEADER" className={styles.logo} />
            <span className={styles.brandTitle}>Leave Planner</span>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.dateTime}>
              <span className={styles.currentDate}>
                {format(currentTime, 'EEEE, d MMMM yyyy')}
              </span>
              <span className={styles.currentTime}>
                {format(currentTime, 'h:mm a')}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.calendarSection}>
          <Legend
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            disableWeekends={disableWeekends}
            onToggleWeekends={handleToggleWeekends}
            showHolidays={showHolidays}
            onToggleHolidays={handleToggleHolidays}
            currentYear={currentYear}
          />
          <Calendar
            selectedDates={selectedDates}
            onDateSelect={handleDateSelect}
            activeFilter={activeFilter}
            disableWeekends={disableWeekends}
            showHolidays={showHolidays}
            currentYear={currentYear}
            onYearChange={handleYearChange}
          />
        </div>

        <aside className={styles.sidebar}>
          <LeaveRequestPanel
            selectedDates={selectedDates}
            onClearDates={handleClearDates}
            onRemoveDate={handleRemoveDate}
            currentYear={currentYear}
          />
        </aside>
      </main>
    </div>
  );
}

export default App;

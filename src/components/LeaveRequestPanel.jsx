import { useState, useMemo } from 'react';
import { format, isWeekend, differenceInCalendarDays, eachDayOfInterval, isBefore, isAfter } from 'date-fns';
import { leaveTypes, leaveReasons, leavePeriods, publicHolidays } from '../data/leaveData';
import styles from './LeaveRequestPanel.module.css';

function LeaveRequestPanel({ selectedDates, onClearDates, onRemoveDate }) {
  const [employeeName, setEmployeeName] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [leaveType, setLeaveType] = useState('');
  const [leaveReason, setLeaveReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Sort selected dates
  const sortedDates = useMemo(() => {
    return [...selectedDates].sort((a, b) => new Date(a) - new Date(b));
  }, [selectedDates]);

  // Calculate date ranges from sorted dates
  const dateRanges = useMemo(() => {
    if (sortedDates.length === 0) return [];

    const ranges = [];
    let rangeStart = new Date(sortedDates[0]);
    let rangeEnd = new Date(sortedDates[0]);

    for (let i = 1; i < sortedDates.length; i++) {
      const current = new Date(sortedDates[i]);
      const prev = new Date(sortedDates[i - 1]);
      const diff = differenceInCalendarDays(current, prev);

      if (diff === 1) {
        rangeEnd = current;
      } else {
        ranges.push({ start: rangeStart, end: rangeEnd });
        rangeStart = current;
        rangeEnd = current;
      }
    }
    ranges.push({ start: rangeStart, end: rangeEnd });

    return ranges;
  }, [sortedDates]);

  // Calculate business days
  const businessDays = useMemo(() => {
    return sortedDates.filter(d => !isWeekend(new Date(d))).length;
  }, [sortedDates]);

  // Check for warnings (busy periods or grand finals)
  const warnings = useMemo(() => {
    const warnings = [];

    for (const dateStr of sortedDates) {
      const date = new Date(dateStr);
      const month = date.getMonth() + 1;
      const day = date.getDate();

      for (const period of leavePeriods) {
        const startCheck = month > period.startMonth ||
          (month === period.startMonth && day >= period.startDay);
        const endCheck = month < period.endMonth ||
          (month === period.endMonth && day <= period.endDay);

        if (startCheck && endCheck) {
          if (period.status === 'grand-final' && !warnings.some(w => w.type === 'grand-final')) {
            warnings.push({
              type: 'grand-final',
              message: `You have selected dates during a Grand Final period (${period.note}). Please reconsider these dates.`
            });
          } else if (period.status === 'busy' && !warnings.some(w => w.type === 'busy')) {
            warnings.push({
              type: 'busy',
              message: `Some selected dates fall within a Busy Period (${period.note}). Maximum 2-3 days recommended.`
            });
          }
          break;
        }
      }
    }

    return warnings;
  }, [sortedDates]);

  // Check if a date is in a Grand Final period
  const isDateInGrandFinal = (dateStr) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    for (const period of leavePeriods) {
      if (period.status !== 'grand-final') continue;
      
      const startCheck = month > period.startMonth ||
        (month === period.startMonth && day >= period.startDay);
      const endCheck = month < period.endMonth ||
        (month === period.endMonth && day <= period.endDay);

      if (startCheck && endCheck) {
        return true;
      }
    }
    return false;
  };

  // Check if a date is in a Busy period
  const isDateInBusy = (dateStr) => {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    for (const period of leavePeriods) {
      if (period.status !== 'busy') continue;
      
      const startCheck = month > period.startMonth ||
        (month === period.startMonth && day >= period.startDay);
      const endCheck = month < period.endMonth ||
        (month === period.endMonth && day <= period.endDay);

      if (startCheck && endCheck) {
        return true;
      }
    }
    return false;
  };

  // Check if a date range contains any Grand Final dates
  const rangeHasGrandFinal = (start, end) => {
    const days = eachDayOfInterval({ start, end });
    return days.some(day => isDateInGrandFinal(format(day, 'yyyy-MM-dd')));
  };

  // Check if a date range contains any Busy dates
  const rangeHasBusy = (start, end) => {
    const days = eachDayOfInterval({ start, end });
    return days.some(day => isDateInBusy(format(day, 'yyyy-MM-dd')));
  };

  // Get the style class for a date range
  const getRangeStyleClass = (start, end) => {
    if (rangeHasGrandFinal(start, end)) return styles.dateChipGrandFinal;
    if (rangeHasBusy(start, end)) return styles.dateChipBusy;
    return '';
  };

  // Format date range for display
  const formatDateRange = (start, end) => {
    if (format(start, 'yyyy-MM-dd') === format(end, 'yyyy-MM-dd')) {
      return format(start, 'EEE, d MMM yyyy');
    }
    if (format(start, 'yyyy-MM') === format(end, 'yyyy-MM')) {
      return `${format(start, 'd')} - ${format(end, 'd MMM yyyy')}`;
    }
    return `${format(start, 'd MMM')} - ${format(end, 'd MMM yyyy')}`;
  };

  // Generate email content
  const generateEmail = () => {
    const reason = leaveReason === 'custom' ? customReason :
      leaveReasons.find(r => r.value === leaveReason)?.label || '';
    const typeLabel = leaveTypes.find(t => t.value === leaveType)?.label || '';

    const dateRangeText = dateRanges.map(r =>
      format(r.start, 'yyyy-MM-dd') === format(r.end, 'yyyy-MM-dd')
        ? format(r.start, 'EEEE, d MMMM yyyy')
        : `${format(r.start, 'EEEE, d MMMM yyyy')} to ${format(r.end, 'EEEE, d MMMM yyyy')}`
    ).join('\n  ');

    let body = `Dear Manager,

I hope this email finds you well. I am writing to formally request ${typeLabel.toLowerCase()} for the following date(s):

Leave Details:
  Type: ${typeLabel}
  Date(s):
  ${dateRangeText}
  Duration: ${sortedDates.length} calendar day(s) / ${businessDays} business day(s)`;

    if (reason) {
      body += `\n  Reason: ${reason}`;
    }

    if (additionalNotes) {
      body += `\n\nAdditional Notes:\n${additionalNotes}`;
    }

    body += `

I will ensure that all my responsibilities are up to date before my leave begins and will coordinate with my colleagues to ensure a smooth handover of any pending tasks.

Please let me know if you require any additional information or if there are any concerns regarding this request.

Thank you for your consideration.

Kind regards,
${employeeName}`;

    return body;
  };

  const subject = useMemo(() => {
    if (sortedDates.length === 0 || !leaveType) return '';
    const typeLabel = leaveTypes.find(t => t.value === leaveType)?.label || '';
    const startDate = new Date(sortedDates[0]);
    const endDate = new Date(sortedDates[sortedDates.length - 1]);

    if (format(startDate, 'yyyy-MM-dd') === format(endDate, 'yyyy-MM-dd')) {
      return `Leave Request: ${typeLabel} - ${format(startDate, 'd MMM yyyy')}`;
    }
    return `Leave Request: ${typeLabel} - ${format(startDate, 'd MMM')} to ${format(endDate, 'd MMM yyyy')}`;
  }, [sortedDates, leaveType]);

  const openMailClient = () => {
    const body = generateEmail();
    const mailtoLink = `mailto:${encodeURIComponent(managerEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  const copyToClipboard = async () => {
    const body = generateEmail();
    const fullText = `Subject: ${subject}\n\n${body}`;

    try {
      await navigator.clipboard.writeText(fullText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = fullText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const isFormValid = employeeName && managerEmail && leaveType && sortedDates.length > 0;

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Leave Request</h2>
        {sortedDates.length > 0 && (
          <button className={styles.clearBtn} onClick={onClearDates}>
            Clear all
          </button>
        )}
      </div>

      {sortedDates.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M3 10H21" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M8 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M16 2V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <p className={styles.emptyText}>Select dates on the calendar to start planning your leave</p>
        </div>
      ) : (
        <div className={styles.panelContent}>
          {/* Warnings */}
          {warnings.map((warning, idx) => (
            <div
              key={idx}
              className={`${styles.warning} ${warning.type === 'grand-final' ? styles.warningDanger : styles.warningCaution}`}
            >
              <svg className={styles.warningIcon} width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>{warning.message}</span>
            </div>
          ))}

          {/* Selected dates summary */}
          <div className={styles.selectedDates}>
            <div className={styles.selectedHeader}>
              <span className={styles.selectedLabel}>Selected dates</span>
              <span className={styles.selectedCount}>{businessDays} business day{businessDays !== 1 ? 's' : ''}</span>
            </div>
            <div className={styles.datesList}>
              {sortedDates.map((dateStr) => {
                const date = new Date(dateStr);
                const chipClass = isDateInGrandFinal(dateStr) 
                  ? styles.dateChipGrandFinal 
                  : isDateInBusy(dateStr) 
                    ? styles.dateChipBusy 
                    : '';
                return (
                  <div key={dateStr} className={`${styles.dateChip} ${chipClass}`}>
                    <span>{format(date, 'EEE, d MMM')}</span>
                    <button 
                      className={styles.dateChipRemove}
                      onClick={() => onRemoveDate(dateStr)}
                      aria-label={`Remove ${format(date, 'd MMM yyyy')}`}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Your name</label>
              <input
                type="text"
                className={styles.input}
                placeholder="Enter your full name"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Manager's email</label>
              <input
                type="email"
                className={styles.input}
                placeholder="manager@company.com"
                value={managerEmail}
                onChange={(e) => setManagerEmail(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Leave type</label>
              <select
                className={styles.select}
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
              >
                <option value="">Select leave type</option>
                {leaveTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Reason (optional)</label>
              <select
                className={styles.select}
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
              >
                <option value="">Select a reason</option>
                {leaveReasons.map(reason => (
                  <option key={reason.value} value={reason.value}>{reason.label}</option>
                ))}
              </select>
            </div>

            {leaveReason === 'custom' && (
              <div className={styles.formGroup}>
                <label className={styles.label}>Custom reason</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Enter your reason"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                />
              </div>
            )}

            <div className={styles.formGroup}>
              <label className={styles.label}>Additional notes (optional)</label>
              <textarea
                className={styles.textarea}
                placeholder="Any additional information for your manager..."
                rows={3}
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Email preview toggle */}
          {isFormValid && (
            <button
              className={styles.previewToggle}
              onClick={() => setShowEmailPreview(!showEmailPreview)}
            >
              <span>{showEmailPreview ? 'Hide' : 'Show'} email preview</span>
              <svg
                className={`${styles.previewChevron} ${showEmailPreview ? styles.open : ''}`}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}

          {/* Email preview */}
          {showEmailPreview && isFormValid && (
            <div className={styles.emailPreview}>
              <div className={styles.emailField}>
                <span className={styles.emailLabel}>To:</span>
                <span className={styles.emailValue}>{managerEmail}</span>
              </div>
              <div className={styles.emailField}>
                <span className={styles.emailLabel}>Subject:</span>
                <span className={styles.emailValue}>{subject}</span>
              </div>
              <div className={styles.emailBody}>
                {generateEmail()}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className={styles.actions}>
            <button
              className={styles.btnPrimary}
              onClick={openMailClient}
              disabled={!isFormValid}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Draft Leave Request
            </button>
            <button
              className={styles.btnSecondary}
              onClick={copyToClipboard}
              disabled={!isFormValid}
            >
              {copySuccess ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  Copy email
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeaveRequestPanel;

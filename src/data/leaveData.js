// Australian Public Holidays 2026-2027
// Note: Some holidays vary by state, these are national holidays
export const publicHolidays = {
  2026: [
    { date: '2026-01-01', name: "New Year's Day" },
    { date: '2026-01-26', name: 'Australia Day' },
    { date: '2026-04-03', name: 'Good Friday' },
    { date: '2026-04-04', name: 'Saturday before Easter Sunday' },
    { date: '2026-04-05', name: 'Easter Sunday' },
    { date: '2026-04-06', name: 'Easter Monday' },
    { date: '2026-04-25', name: 'Anzac Day' },
    { date: '2026-06-08', name: "Queen's Birthday" }, // Most states
    { date: '2026-12-25', name: 'Christmas Day' },
    { date: '2026-12-26', name: 'Boxing Day' },
    { date: '2026-12-28', name: 'Boxing Day (Observed)' },
  ],
  2027: [
    { date: '2027-01-01', name: "New Year's Day" },
    { date: '2027-01-26', name: 'Australia Day' },
    { date: '2027-03-26', name: 'Good Friday' },
    { date: '2027-03-27', name: 'Saturday before Easter Sunday' },
    { date: '2027-03-28', name: 'Easter Sunday' },
    { date: '2027-03-29', name: 'Easter Monday' },
    { date: '2027-04-25', name: 'Anzac Day' },
    { date: '2027-04-26', name: 'Anzac Day (Observed)' },
    { date: '2027-06-14', name: "Queen's Birthday" },
    { date: '2027-12-25', name: 'Christmas Day' },
    { date: '2027-12-26', name: 'Boxing Day' },
    { date: '2027-12-27', name: 'Christmas Day (Observed)' },
  ],
  2028: [
    { date: '2028-01-01', name: "New Year's Day" },
    { date: '2028-01-03', name: "New Year's Day (Observed)" },
    { date: '2028-01-26', name: 'Australia Day' },
    { date: '2028-04-14', name: 'Good Friday' },
    { date: '2028-04-15', name: 'Saturday before Easter Sunday' },
    { date: '2028-04-16', name: 'Easter Sunday' },
    { date: '2028-04-17', name: 'Easter Monday' },
    { date: '2028-04-25', name: 'Anzac Day' },
    { date: '2028-06-12', name: "Queen's Birthday" },
    { date: '2028-12-25', name: 'Christmas Day' },
    { date: '2028-12-26', name: 'Boxing Day' },
  ],
};

// Leave period definitions based on company calendar
export const leavePeriods = [
  // Q1
  { startMonth: 1, startDay: 1, endMonth: 1, endDay: 15, status: 'leave-ok', label: 'Leave OK' },
  { startMonth: 1, startDay: 16, endMonth: 1, endDay: 31, status: 'busy', label: 'Busy Period', note: 'Back to School/Work' },
  { startMonth: 2, startDay: 1, endMonth: 2, endDay: 29, status: 'leave-ok', label: 'Leave OK' },
  { startMonth: 3, startDay: 1, endMonth: 3, endDay: 15, status: 'leave-ok', label: 'Leave OK' },
  { startMonth: 3, startDay: 16, endMonth: 3, endDay: 31, status: 'busy', label: 'Busy Period', note: 'Quarter End Target' },

  // Q2
  { startMonth: 4, startDay: 1, endMonth: 4, endDay: 30, status: 'long-leave', label: 'Best for Long Leave' },
  { startMonth: 5, startDay: 1, endMonth: 5, endDay: 15, status: 'leave-ok', label: 'Leave OK' },
  { startMonth: 5, startDay: 16, endMonth: 5, endDay: 31, status: 'busy', label: 'Busy Period', note: 'End of Financial Year Prep' },
  { startMonth: 6, startDay: 1, endMonth: 6, endDay: 30, status: 'grand-final', label: 'Grand Final', note: 'Biggest month of year - Please avoid leave' },

  // Q3
  { startMonth: 7, startDay: 1, endMonth: 7, endDay: 31, status: 'leave-ok', label: 'Leave OK' },
  { startMonth: 8, startDay: 1, endMonth: 8, endDay: 31, status: 'long-leave', label: 'Best for Long Leave' },
  { startMonth: 9, startDay: 1, endMonth: 9, endDay: 15, status: 'leave-ok', label: 'Leave OK' },
  { startMonth: 9, startDay: 16, endMonth: 9, endDay: 30, status: 'busy', label: 'Busy Period', note: 'Quarter End Target' },

  // Q4
  { startMonth: 10, startDay: 1, endMonth: 10, endDay: 31, status: 'long-leave', label: 'Best for Long Leave' },
  { startMonth: 11, startDay: 1, endMonth: 11, endDay: 30, status: 'grand-final', label: 'Grand Final', note: 'Biggest month of year - Please avoid leave' },
  { startMonth: 12, startDay: 1, endMonth: 12, endDay: 19, status: 'busy', label: 'Busy Period', note: 'Holiday Rush & Year End' },
  { startMonth: 12, startDay: 20, endMonth: 12, endDay: 31, status: 'leave-ok', label: 'Leave OK', note: 'Christmas/Holiday Season' },
];

export const leaveTypes = [
  { value: 'annual', label: 'Annual Leave' },
  { value: 'personal', label: 'Personal/Sick Leave' },
  { value: 'parental', label: 'Parental Leave' },
  { value: 'bereavement', label: 'Bereavement Leave' },
  { value: 'study', label: 'Study Leave' },
  { value: 'unpaid', label: 'Unpaid Leave' },
  { value: 'other', label: 'Other' },
];

export const leaveReasons = [
  { value: 'vacation', label: 'Family vacation' },
  { value: 'travel', label: 'Personal travel' },
  { value: 'family', label: 'Family commitment' },
  { value: 'medical', label: 'Medical appointment' },
  { value: 'moving', label: 'Home renovation/moving' },
  { value: 'wedding', label: 'Wedding attendance' },
  { value: 'rest', label: 'Rest and recovery' },
  { value: 'personal', label: 'Personal matters' },
  { value: 'custom', label: 'Other (specify)' },
];

export const legendItems = [
  { id: 'leave-ok', label: 'Leave OK', color: '#22c55e', description: 'Standard leave periods' },
  { id: 'long-leave', label: 'Best for Long Leave', color: '#3b82f6', description: 'Ideal for extended leave' },
  { id: 'busy', label: 'Busy Period', color: '#f59e0b', description: 'Max 2-3 days recommended' },
  { id: 'grand-final', label: 'Grand Final', color: '#ef4444', description: 'Please avoid leave' },
  { id: 'public-holiday', label: 'Public Holiday', color: '#8b5cf6', description: 'Australian public holidays' },
];

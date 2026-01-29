# LEADER Leave Planner

A visual leave planning tool designed to help LEADER employees plan their leave thoughtfully and considerately.

---

## 📋 Why This Tool Exists

> _"You (our people) are no1. With a legendary A grade team we can then give our customers Legendary Customer Experience. Customer is king, they pay our salaries and we are here to offer them best customer service. When you are away customers suffer and your fellow team mates too. This all comes down to our core value respect. This is why we like to plan leave well._
>
> _When it comes to taking leave it is much appreciated if you plan for following times to offer legendary customer service."_
>

This leave planner helps you visualize the best times to take leave throughout the year, ensuring you can enjoy your well-deserved time off while maintaining our commitment to legendary customer service and supporting your teammates.

---

## 🎯 Features

### Calendar Overview

- **Full Year View**: See all 12 months at a glance with color-coded periods
- **Year Navigation**: Navigate between years using the arrow buttons
- **Live Date/Time**: Current date and time displayed in the header

### Leave Period Categories

| Color         | Period         | Description                                           |
| ------------- | -------------- | ----------------------------------------------------- |
| 🟢 **Green**  | Leave OK       | Great time to take leave! Low impact on the team      |
| 🔵 **Blue**   | Long Leave     | Ideal for extended holidays (7+ days)                 |
| 🟠 **Orange** | Busy Period    | Business-critical time - limit to 2-3 days maximum    |
| 🔴 **Red**    | Grand Final    | Avoid leave - highest impact months (June & November) |
| 🟣 **Purple** | Public Holiday | No leave application needed - it's a holiday!         |

### Visual Display Options

| Toggle               | Function                                      |
| -------------------- | --------------------------------------------- |
| **Disable Weekends** | Grays out weekend days for clearer visibility |
| **Mark Holidays**    | Highlights public holidays in purple          |

> **Note**: Weekends and public holidays cannot be selected as they don't require leave applications.

### Leave Request Panel

- **Date Selection**: Click on any weekday to add it to your leave request
- **Smart Warnings**: Automatic alerts when selecting dates during Busy or Grand Final periods
- **Visual Indicators**:
  - Green chips = Leave OK dates
  - Blue chips = Long Leave dates
  - Orange chips = Busy dates
  - Red chips = Grand Final dates
- **Easy Removal**: Click the ✕ on any date chip to remove it
- **Business Day Counter**: Automatically calculates working days

### Email Generation

- **Draft Leave Request**: Opens your email client with a pre-filled professional leave request
- **Copy Email**: Copy the entire email content to your clipboard
- **Email Preview**: Preview the generated email before sending

### Outlook Integration (Important: Do This First)

- **Add Busy Dates to Outlook**: Download busy periods as an ICS calendar file
- Categories are color-coded:
  - 🔴 Red = Grand Final periods
  - 🟠 Orange = Busy periods

---

## 📖 How to Use

### Step 1: Review the Calendar

1. Look at the year overview to identify good times for leave
2. **Green** and **Blue** periods are ideal for planning leave
3. **Orange** periods require careful consideration
4. **Red** months (June & November) should be avoided if possible

### Step 2: Select Your Dates

1. Click on any weekday to select it (turns green, blue, orange, or red depending on period)
2. Selected dates appear in the Leave Request panel on the right
3. Click a selected date again OR click the ✕ to remove it

### Step 3: Complete the Form

1. Enter your full name
2. Enter your manager's email address
3. Select your leave type (Annual, Personal, etc.)
4. Optionally add a reason and notes

### Step 4: Submit Your Request

1. Click **"Draft Leave Request"** to open your email client with the pre-filled email
2. Or click **"Copy Email"** to paste it manually
3. Review and send to your manager

### Step 5: Sync with Outlook (Do This First)

Before anything else, click **"Add Busy Dates to Outlook"** to download the ICS file, then follow these steps:

1. **Click to download** the ICS file.
2. **Open the ICS file** (this will open Outlook automatically).
3. Go to **Calendar** in Outlook.
4. Choose the correct **calendar** from the dropdown.
5. Click **Import**.
6. Look for the **confirmation message** that the events were imported.

---

## ⚠️ Leave Period Guidelines

### 🟢 Leave OK Periods

- Minimal business impact
- Ideal for short or long breaks
- Most leave requests approved easily

### 🔵 Long Leave Periods

- Perfect for extended holidays
- Great for overseas trips or longer breaks
- 7+ consecutive days recommended

### 🟠 Busy Periods

- Higher workload and customer demand
- **Maximum 2-3 days recommended**
- Please coordinate with your team
- Consider critical deadlines

### 🔴 Grand Final (June & November)

- **Biggest months of the year**
- Please avoid leave during these months
- Your presence makes a significant difference
- If absolutely necessary, discuss with your manager early

---

## 🤝 Our Core Values

This tool reflects our commitment to:

- **RESPECT** — For our customers, teammates, and the business
- **LEGENDARY SERVICE** — Maintaining excellent customer experience
- **TEAMWORK** — Supporting each other, especially during peak times
- **PLANNING** — Being proactive and considerate with time off

---

## 💡 Tips for Planning Leave

1. **Plan Early**: Book leave well in advance, especially for busy periods
2. **Communicate**: Let your team know your plans early
3. **Be Flexible**: If possible, shift dates to avoid critical periods
4. **Cover Your Work**: Arrange handover before you leave
5. **Check the Calendar**: Use this tool to find the best times

---

## 🛠️ Technical Information

- Built with React and Vite by John Cardenas
- Responsive design works on desktop and tablet
- No data is stored — all form data stays in your browser
- ICS export compatible with Outlook, Google Calendar, and Apple Calendar

---

**Happy Planning! Enjoy your well-deserved breaks while keeping our legendary service running.** 🎉

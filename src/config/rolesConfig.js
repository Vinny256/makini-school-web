// 1. ALL SYSTEM MODULES AVAILABLE IN THE ERP
export const ERP_MODULES = {
  OVERVIEW: { id: 'Overview', label: 'Executive Overview', icon: 'fa-chart-pie' },
  STUDENT_ADMISSIONS: { id: 'Student Admissions', label: 'Admissions & Registration', icon: 'fa-user-plus' },
  STUDENT_DIRECTORY: { id: 'Students', label: 'Learners Directory', icon: 'fa-user-graduate' },
  STAFF_CONTROL: { id: 'Staff Management', label: 'Staff Control', icon: 'fa-users-cog' },
  ENTER_MARKS: { id: 'Enter Marks', label: 'Marks & CBC Grading', icon: 'fa-marker' },
  EXAM_ANALYSIS: { id: 'Exam Analysis', label: 'Exam Reports & Merits', icon: 'fa-file-alt' },
  FEE_OPERATIONS: { id: 'Fee Registry', label: 'Fee Operations & Ledger', icon: 'fa-receipt' },
  ATTENDANCE: { id: 'Attendance', label: 'Roll Call & Biometrics', icon: 'fa-clipboard-check' },
  DISCIPLINE: { id: 'Discipline', label: 'Discipline & Conduct', icon: 'fa-gavel' },
  TIMETABLE: { id: 'School Timetable', label: 'Master Timetable', icon: 'fa-calendar-alt' },
  BULK_SMS: { id: 'Bulk SMS Hub', label: 'Bulk SMS Broadcast', icon: 'fa-bullhorn' },
  HOSTEL_BOARDING: { id: 'Hostels', label: 'Boarding & Dormitories', icon: 'fa-bed' },
  LIBRARY: { id: 'Library', label: 'Library & Book Borrowing', icon: 'fa-book' },
  INVENTORY: { id: 'Inventory', label: 'Stores & School Supplies', icon: 'fa-boxes' }
};

// 2. COMPLETE KENYAN SCHOOL ROLES CONFIGURATION
export const ROLE_VIEWS = {
  // EXECUTIVE & CHIEF DISPATCH (Full Operational Access)
  'Principal': {
    title: 'Executive Portal',
    badgeColor: 'bg-purple-100 text-purple-700',
    tabs: [
      ERP_MODULES.OVERVIEW,
      ERP_MODULES.STAFF_CONTROL,
      ERP_MODULES.STUDENT_ADMISSIONS,
      ERP_MODULES.STUDENT_DIRECTORY,
      ERP_MODULES.ENTER_MARKS,
      ERP_MODULES.EXAM_ANALYSIS,
      ERP_MODULES.FEE_OPERATIONS,
      ERP_MODULES.DISCIPLINE,
      ERP_MODULES.ATTENDANCE,
      ERP_MODULES.TIMETABLE,
      ERP_MODULES.BULK_SMS,
      ERP_MODULES.HOSTEL_BOARDING,
      ERP_MODULES.LIBRARY,
      ERP_MODULES.INVENTORY
    ]
  },

  // DEPUTY PRINCIPAL (Senior Admin - Admissions, Academic Supervision, Discipline, SMS)
  'Deputy Principal': {
    title: 'Deputy Principal Desk',
    badgeColor: 'bg-indigo-100 text-indigo-700',
    tabs: [
      ERP_MODULES.OVERVIEW,
      ERP_MODULES.STUDENT_ADMISSIONS,
      ERP_MODULES.STUDENT_DIRECTORY,
      ERP_MODULES.DISCIPLINE,
      ERP_MODULES.ATTENDANCE,
      ERP_MODULES.ENTER_MARKS,
      ERP_MODULES.EXAM_ANALYSIS,
      ERP_MODULES.TIMETABLE,
      ERP_MODULES.BULK_SMS,
      ERP_MODULES.HOSTEL_BOARDING,
      ERP_MODULES.STAFF_CONTROL
    ]
  },

  // DEAN OF STUDIES / EXAM OFFICER
  'Dean of Studies': {
    title: 'Academics & Exams Office',
    badgeColor: 'bg-cyan-100 text-cyan-700',
    tabs: [
      ERP_MODULES.EXAM_ANALYSIS,
      ERP_MODULES.ENTER_MARKS,
      ERP_MODULES.TIMETABLE,
      ERP_MODULES.STUDENT_DIRECTORY,
      ERP_MODULES.BULK_SMS
    ]
  },

  // SENIOR TEACHER / HEAD OF DEPARTMENT (HOD)
  'Senior Teacher': {
    title: 'Senior Staff Desk',
    badgeColor: 'bg-sky-100 text-sky-700',
    tabs: [
      ERP_MODULES.ENTER_MARKS,
      ERP_MODULES.STUDENT_DIRECTORY,
      ERP_MODULES.ATTENDANCE,
      ERP_MODULES.DISCIPLINE,
      ERP_MODULES.TIMETABLE
    ]
  },

  // CLASS TEACHER / REGULAR SUBJECT TEACHER
  'Teacher': {
    title: 'Faculty Workspace',
    badgeColor: 'bg-blue-100 text-blue-700',
    tabs: [
      ERP_MODULES.ENTER_MARKS,
      ERP_MODULES.ATTENDANCE,
      ERP_MODULES.STUDENT_DIRECTORY,
      ERP_MODULES.TIMETABLE,
      ERP_MODULES.DISCIPLINE
    ]
  },

  // SCHOOL SECRETARY / ADMISSION REGISTRAR
  'Secretary': {
    title: 'Registry & Front Office',
    badgeColor: 'bg-pink-100 text-pink-700',
    tabs: [
      ERP_MODULES.STUDENT_ADMISSIONS,
      ERP_MODULES.STUDENT_DIRECTORY,
      ERP_MODULES.BULK_SMS,
      ERP_MODULES.ATTENDANCE
    ]
  },

  // BURSAR / FINANCE / ACCOUNTS
  'Bursar': {
    title: 'Accounts & Finance',
    badgeColor: 'bg-amber-100 text-amber-700',
    tabs: [
      ERP_MODULES.FEE_OPERATIONS,
      ERP_MODULES.STUDENT_DIRECTORY,
      ERP_MODULES.BULK_SMS,
      ERP_MODULES.INVENTORY
    ]
  },

  // BOARDING MASTER / MATRON
  'Boarding Master': {
    title: 'Boarding & Dormitories',
    badgeColor: 'bg-orange-100 text-orange-700',
    tabs: [
      ERP_MODULES.HOSTEL_BOARDING,
      ERP_MODULES.STUDENT_DIRECTORY,
      ERP_MODULES.DISCIPLINE,
      ERP_MODULES.ATTENDANCE
    ]
  },

  // LIBRARIAN
  'Librarian': {
    title: 'Library Resource Center',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    tabs: [
      ERP_MODULES.LIBRARY,
      ERP_MODULES.STUDENT_DIRECTORY
    ]
  },

  // STOREKEEPER / ASSETS
  'Storekeeper': {
    title: 'Stores & Supplies',
    badgeColor: 'bg-teal-100 text-teal-700',
    tabs: [
      ERP_MODULES.INVENTORY
    ]
  }
};

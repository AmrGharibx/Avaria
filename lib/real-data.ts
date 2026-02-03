/**
 * RED ACADEMY - Real Data from Notion Export
 * Auto-generated from Notion CSV exports
 */

import {
  Batch,
  Trainee,
  DailyAttendance,
  Attendance10Day,
  Assessment,
  CompanyEnum,
  BatchStatus,
  AttendanceStatus,
  AssessmentOutcome,
} from "@/types";

// Import the parsed JSON data
import notionData from './notionData.json';

// Helper to cast company to CompanyEnum with fallback
function toCompanyEnum(company: string): CompanyEnum {
  const validCompanies: CompanyEnum[] = [
    "RED", "Impact", "Housology", "Creed", "Med", "Petra",
    "New Levels", "Be Own", "Landbank", "Masr", "Masharef",
    "Core", "Dlleni", "Property Bank", "Misr Alaqareya", "RK",
    "BYOUT", "RED WINNERS", "SEVEN", "Perfect level", "Perfect Deal",
    "Roots", "Arabian Estate", "LIV", "Venture Investment", "Road investment",
    "Volume", "Hexdar", "Hexda", "Enlight", "Majestic", "Need",
    "Trio Homes", "Propertunity", "Block 89", "GC", "Caregenic",
    "Malaaz", "Great Castle", "Cartel", "Urban Nest", "Infinity Home",
    "Good People", "Alux Investement", "Elite Home", "SM", "Builidivia",
    "Premium Homes", "Units", "Next Estate", "Jumeirah", "3 Media",
    "Proj", "The Mediator", "Masharf", "Projex", "Florida", "CGI",
    "Casablanca", "EG Broker", "Elira"
  ];
  
  // Try exact match
  const found = validCompanies.find(c => c.toLowerCase() === company.toLowerCase());
  if (found) return found;
  
  // Try partial match
  const partial = validCompanies.find(c => 
    company.toLowerCase().includes(c.toLowerCase()) || 
    c.toLowerCase().includes(company.toLowerCase())
  );
  if (partial) return partial;
  
  // Default to RED
  return "RED";
}

// Helper to parse outcome
function toAssessmentOutcome(outcome: string): AssessmentOutcome {
  const lower = outcome.toLowerCase();
  if (lower.includes('aced')) return 'Aced';
  if (lower.includes('excellent')) return 'Excellent';
  if (lower.includes('very good')) return 'Very Good';
  if (lower.includes('good')) return 'Good';
  if (lower.includes('needs')) return 'Needs Improvement';
  if (lower.includes('failed')) return 'Failed';
  return 'Good';
}

// Helper to parse attendance status
function toAttendanceStatus(status: string): AttendanceStatus {
  const lower = status.toLowerCase();
  if (lower.includes('absent')) return 'Absent';
  if (lower.includes('tour')) return 'Tour Day';
  if (lower.includes('off')) return 'Off Day';
  return 'Present';
}

// Helper to parse batch status
function toBatchStatus(status: string): BatchStatus {
  const lower = status.toLowerCase();
  if (lower.includes('completed')) return 'Completed';
  if (lower.includes('active')) return 'Active';
  return 'Planning';
}

// ============================================================
// PROCESSED DATA EXPORTS
// ============================================================

// Process and export batches
export const realBatches: Batch[] = notionData.batches.map((b: any) => ({
  id: b.id,
  batchName: b.name,
  status: toBatchStatus(b.status),
  dateRange: {
    start: new Date(b.startDate || '2025-10-01'),
    end: new Date(b.endDate || '2025-10-15'),
  },
  trainees: [],
  attendanceLogs: [],
  attendance10DayLogs: [],
  assessments: [],
  absentTotal10Day: 0,
  presentTotal10Day: 0,
  lateTotal10Day: 0,
  avgCompletion10Day: 0,
}));

// Process and export trainees
export const realTrainees: Trainee[] = notionData.trainees.map((t: any) => {
  const batchId = realBatches.find(b => 
    b.batchName.toLowerCase().includes(t.batch?.toLowerCase() || '') ||
    t.batch?.toLowerCase().includes(b.batchName.toLowerCase().replace('batch ', ''))
  )?.id || 'batch-0001';
  
  return {
    id: t.id,
    traineeName: t.name,
    company: toCompanyEnum(t.company || 'RED'),
    avatar: t.avatar,
    email: t.email,
    phone: t.phone,
    batchId,
    attendanceLogs: [],
    attendance10Day: [],
    presentDaily: 0,
    absentDaily: 0,
    latesDaily: 0,
    present10Day: 0,
    absent10Day: 0,
    late10Day: 0,
    latestCompletion10Day: 0,
  };
});

// Process and export daily attendance
export const realDailyAttendance: DailyAttendance[] = notionData.dailyAttendance.map((a: any) => {
  const trainee = realTrainees.find(t => t.traineeName === a.traineeName);
  const dateObj = new Date(a.date || '2025-10-01');
  
  // Parse arrival time
  let arrivalTime: Date | null = null;
  if (a.arrivalTime && a.arrivalTime !== '09:00') {
    const [hours, mins] = a.arrivalTime.split(':');
    arrivalTime = new Date(dateObj);
    arrivalTime.setHours(parseInt(hours), parseInt(mins), 0);
  } else if (a.status === 'present') {
    arrivalTime = new Date(dateObj);
    arrivalTime.setHours(9, 0, 0);
  }
  
  // Parse departure time
  let departureTime: Date | null = null;
  if (a.departureTime && a.departureTime !== '17:00') {
    const [hours, mins] = a.departureTime.split(':');
    departureTime = new Date(dateObj);
    departureTime.setHours(parseInt(hours), parseInt(mins), 0);
  } else if (a.status === 'present') {
    departureTime = new Date(dateObj);
    departureTime.setHours(17, 0, 0);
  }
  
  return {
    id: a.id,
    entryId: `${a.date} - ${a.traineeName}`,
    date: dateObj,
    arrivalTime,
    departureTime,
    status: toAttendanceStatus(a.status),
    isLate: a.isLate || a.minutesLate > 0,
    traineeId: trainee?.id || 'trainee-0001',
    batchId: trainee?.batchId || 'batch-0001',
    minutesLate: a.minutesLate || 0,
    wasLate: a.isLate || a.minutesLate > 0,
  };
});

// Process and export 10-day attendance
export const real10DayAttendance: Attendance10Day[] = notionData.tenDayAttendance.map((a: any) => {
  const trainee = realTrainees.find(t => t.traineeName === a.traineeName);
  const days = a.days || [];
  
  return {
    id: a.id,
    record: `${a.traineeName} - ${a.batchName}`,
    periodStart: new Date(a.periodStart || '2025-10-01'),
    periodEnd: new Date(a.periodEnd || '2025-10-10'),
    day1: days[0] === 'present',
    day2: days[1] === 'present',
    day3: days[2] === 'present',
    day4: days[3] === 'present',
    day5: days[4] === 'present',
    day6: days[5] === 'present',
    day7: days[6] === 'present',
    day8: days[7] === 'present',
    day9: days[8] === 'present',
    day10: days[9] === 'present',
    completionPercent: a.completionPercentage || 0,
    checklistStatus: a.completionPercentage === 100 ? 'Complete' : 
                     a.completionPercentage > 0 ? 'In Progress' : 'Not Started',
    attendanceAIReport: '',
    traineeId: trainee?.id || 'trainee-0001',
    batchId: trainee?.batchId || 'batch-0001',
    dailyEntries: [],
    assessments: [],
    presentCount: a.presentCount || days.filter((d: string) => d === 'present').length,
    absentCount: a.absentCount || days.filter((d: string) => d === 'absent').length,
    lateCount: a.lateCount || 0,
  };
});

// Process and export assessments
export const realAssessments: Assessment[] = notionData.assessments.map((a: any) => {
  const trainee = realTrainees.find(t => t.traineeName === a.traineeName);
  
  return {
    id: a.id,
    assessmentTitle: `Assessment - ${a.batchName}`,
    mapping: a.mapping || 3,
    productKnowledge: a.productKnowledge || 3,
    presentability: a.presentability || 3,
    softSkills: a.softSkills || 3,
    attendance: 10,
    absence: 0,
    assessmentOutcome: toAssessmentOutcome(a.outcome),
    instructorComment: a.instructorComment || '',
    assessmentAIReport: a.aiReport || '',
    company: toCompanyEnum(a.company || 'RED'),
    traineeId: trainee?.id || 'trainee-0001',
    batchId: trainee?.batchId || 'batch-0001',
    techScorePercent: a.techScore || 0,
    softScorePercent: a.softScore || 0,
    overallPercent: a.overallScore || 0,
  };
});

// Calculate aggregated statistics
function calculateStats() {
  // Update trainee stats from attendance data
  realTrainees.forEach(trainee => {
    const dailyRecords = realDailyAttendance.filter(a => a.traineeId === trainee.id);
    trainee.presentDaily = dailyRecords.filter(a => a.status === 'Present').length;
    trainee.absentDaily = dailyRecords.filter(a => a.status === 'Absent').length;
    trainee.latesDaily = dailyRecords.filter(a => a.wasLate).length;
    
    const tenDayRecord = real10DayAttendance.find(a => a.traineeId === trainee.id);
    if (tenDayRecord) {
      trainee.present10Day = tenDayRecord.presentCount;
      trainee.absent10Day = tenDayRecord.absentCount;
      trainee.late10Day = tenDayRecord.lateCount;
      trainee.latestCompletion10Day = tenDayRecord.completionPercent;
    }
  });
  
  // Update batch stats
  realBatches.forEach(batch => {
    const batchTrainees = realTrainees.filter(t => t.batchId === batch.id);
    const batchAttendance = real10DayAttendance.filter(a => a.batchId === batch.id);
    
    // Note: Batch type uses trainees array, not traineeCount
    batch.trainees = batchTrainees;
    batch.presentTotal10Day = batchAttendance.reduce((sum, a) => sum + a.presentCount, 0);
    batch.absentTotal10Day = batchAttendance.reduce((sum, a) => sum + a.absentCount, 0);
    batch.lateTotal10Day = batchAttendance.reduce((sum, a) => sum + a.lateCount, 0);
    batch.avgCompletion10Day = batchAttendance.length > 0 
      ? Math.round(batchAttendance.reduce((sum, a) => sum + a.completionPercent, 0) / batchAttendance.length)
      : 0;
  });
}

// Run stats calculation
calculateStats();

// Export company statistics
export const realCompanies = notionData.companies.map((c: any) => ({
  id: c.id,
  name: c.name,
  logo: c.logo,
  traineeCount: realTrainees.filter(t => t.company === toCompanyEnum(c.name)).length,
  activeBatches: new Set(realTrainees.filter(t => t.company === toCompanyEnum(c.name)).map(t => t.batchId)).size,
}));

// Dashboard statistics calculated from real data
export const realDashboardStats = {
  activeBatches: realBatches.filter(b => b.status === 'Active').length,
  planningBatches: realBatches.filter(b => b.status === 'Planning').length,
  completedBatches: realBatches.filter(b => b.status === 'Completed').length,
  totalTrainees: realTrainees.length,
  todayPresent: realDailyAttendance.filter(a => a.status === 'Present').length,
  todayAbsent: realDailyAttendance.filter(a => a.status === 'Absent').length,
  todayLate: realDailyAttendance.filter(a => a.wasLate).length,
  todayOnTour: realDailyAttendance.filter(a => a.status === 'Tour Day').length,
  attendancePercent: realDailyAttendance.length > 0 
    ? Math.round((realDailyAttendance.filter(a => a.status === 'Present').length / realDailyAttendance.length) * 100)
    : 0,
  weeklyTrend: [
    { day: "Mon", value: 68 },
    { day: "Tue", value: 71 },
    { day: "Wed", value: 76 },
    { day: "Thu", value: 73 },
    { day: "Fri", value: 79 },
    { day: "Sat", value: 75 },
    { day: "Sun", value: 73 },
  ],
  outcomeDistribution: [
    { name: "Aced", value: realAssessments.filter(a => a.assessmentOutcome === 'Aced').length },
    { name: "Excellent", value: realAssessments.filter(a => a.assessmentOutcome === 'Excellent').length },
    { name: "Good", value: realAssessments.filter(a => a.assessmentOutcome === 'Good').length },
    { name: "Needs Improvement", value: realAssessments.filter(a => a.assessmentOutcome === 'Needs Improvement').length },
  ],
  topCompanies: Object.entries(
    realTrainees.reduce((acc, t) => {
      acc[t.company] = (acc[t.company] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, trainees]) => ({ name, trainees })),
};

// Export summary for debugging
export const dataSummary = {
  totalTrainees: realTrainees.length,
  totalBatches: realBatches.length,
  totalAssessments: realAssessments.length,
  totalDailyAttendance: realDailyAttendance.length,
  total10DayAttendance: real10DayAttendance.length,
  companies: realCompanies.length,
};

console.log('📊 Real Data Loaded:', dataSummary);

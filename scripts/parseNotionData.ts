/**
 * Notion Data Parser Script
 * Transforms Notion CSV exports into Red Academy app data format
 */

import * as fs from 'fs';
import * as path from 'path';

// Types for parsed data
interface ParsedTrainee {
  id: string;
  name: string;
  batch: string;
  company: string;
  email: string;
  phone: string;
  status: 'active' | 'graduated' | 'dropped';
  enrollmentDate: string;
  avatar: string;
}

interface ParsedBatch {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
  traineeCount: number;
  instructors: string[];
  schedule: string;
  location: string;
  description: string;
}

interface ParsedCompany {
  id: string;
  name: string;
  logo: string;
  traineeCount: number;
  activeBatches: number;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  industry: string;
  partnerSince: string;
}

interface ParsedAssessment {
  id: string;
  traineeId: string;
  traineeName: string;
  batchId: string;
  batchName: string;
  company: string;
  date: string;
  mapping: number;
  productKnowledge: number;
  presentability: number;
  softSkills: number;
  overallScore: number;
  techScore: number;
  softScore: number;
  outcome: 'Aced' | 'Excellent' | 'Very Good' | 'Good' | 'Needs Improvement' | 'Failed';
  instructorComment: string;
  aiReport: string;
}

interface ParsedDailyAttendance {
  id: string;
  traineeId: string;
  traineeName: string;
  batchId: string;
  batchName: string;
  date: string;
  arrivalTime: string;
  departureTime: string;
  status: 'present' | 'absent' | 'late' | 'excused' | 'off-day' | 'tour-day';
  minutesLate: number;
  isLate: boolean;
}

interface ParsedTenDayAttendance {
  id: string;
  traineeId: string;
  traineeName: string;
  batchId: string;
  batchName: string;
  periodStart: string;
  periodEnd: string;
  days: ('present' | 'absent' | 'late' | 'excused')[];
  presentCount: number;
  absentCount: number;
  lateCount: number;
  completionPercentage: number;
}

// Utility functions
function parseCSV(content: string): { headers: string[]; rows: string[][] } {
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length === 0) return { headers: [], rows: [] };
  
  const parseRow = (row: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };
  
  const headers = parseRow(lines[0]);
  const rows = lines.slice(1).map(line => parseRow(line));
  
  return { headers, rows };
}

function extractNameFromNotionLink(value: string): string {
  // Handle Notion links like "Mohamed Hany (https://www.notion.so/...)"
  if (!value) return '';
  const match = value.match(/^([^(]+)\s*\(/);
  if (match) {
    return match[1].trim();
  }
  // Handle plain text or comma-separated values
  return value.split(',')[0].trim();
}

function extractAllNamesFromNotionLinks(value: string): string[] {
  if (!value) return [];
  // Split by comma but be careful with links
  const parts = value.split(/,\s*(?=[A-Z])/);
  return parts.map(p => extractNameFromNotionLink(p)).filter(Boolean);
}

function parseNotionDate(dateStr: string): string {
  if (!dateStr) return '';
  // Handle formats like "October 19, 2025" or "November 5, 2025 11:20 AM (GMT+2)"
  const dateMatch = dateStr.match(/([A-Za-z]+)\s+(\d+),?\s+(\d{4})/);
  if (dateMatch) {
    const months: Record<string, string> = {
      'January': '01', 'February': '02', 'March': '03', 'April': '04',
      'May': '05', 'June': '06', 'July': '07', 'August': '08',
      'September': '09', 'October': '10', 'November': '11', 'December': '12'
    };
    const month = months[dateMatch[1]] || '01';
    const day = dateMatch[2].padStart(2, '0');
    const year = dateMatch[3];
    return `${year}-${month}-${day}`;
  }
  return '';
}

function parseTime(timeStr: string): string {
  if (!timeStr) return '';
  // Extract time from "November 5, 2025 11:20 AM (GMT+2)"
  const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (timeMatch) {
    let hours = parseInt(timeMatch[1]);
    const minutes = timeMatch[2];
    const period = timeMatch[3].toUpperCase();
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }
  return '';
}

function parseDateRange(dateRange: string): { start: string; end: string } {
  if (!dateRange) return { start: '', end: '' };
  // Handle "October 19, 2025 → October 30, 2025"
  const parts = dateRange.split('→').map(p => p.trim());
  return {
    start: parseNotionDate(parts[0] || ''),
    end: parseNotionDate(parts[1] || parts[0] || '')
  };
}

function parsePercentage(value: string): number {
  if (!value) return 0;
  const match = value.match(/([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

function generateId(prefix: string, index: number): string {
  return `${prefix}-${String(index + 1).padStart(4, '0')}`;
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function getRandomAvatar(name: string): string {
  const seed = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=dc2626`;
}

// Main parsing functions
function parseTrainees(csv: string, batchMap: Map<string, string>, companySet: Set<string>): ParsedTrainee[] {
  const { headers, rows } = parseCSV(csv);
  const trainees: ParsedTrainee[] = [];
  
  const nameIdx = headers.findIndex(h => h.toLowerCase().includes('trainee name'));
  const batchIdx = headers.findIndex(h => h.toLowerCase() === 'batch');
  const companyIdx = headers.findIndex(h => h.toLowerCase() === 'company');
  
  rows.forEach((row, index) => {
    const name = extractNameFromNotionLink(row[nameIdx] || '');
    if (!name) return;
    
    const batchName = extractNameFromNotionLink(row[batchIdx] || '');
    const company = extractNameFromNotionLink(row[companyIdx] || '');
    
    if (company) companySet.add(company);
    
    trainees.push({
      id: generateId('trainee', index),
      name,
      batch: batchName,
      company: company || 'Unassigned',
      email: `${slugify(name)}@email.com`,
      phone: `+20 1${Math.floor(Math.random() * 900000000 + 100000000)}`,
      status: 'active',
      enrollmentDate: '2025-10-01',
      avatar: getRandomAvatar(name)
    });
  });
  
  return trainees;
}

function parseBatches(csv: string): { batches: ParsedBatch[]; batchMap: Map<string, string> } {
  const { headers, rows } = parseCSV(csv);
  const batches: ParsedBatch[] = [];
  const batchMap = new Map<string, string>();
  
  const nameIdx = headers.findIndex(h => h.toLowerCase().includes('batch name'));
  const dateRangeIdx = headers.findIndex(h => h.toLowerCase().includes('date range'));
  const statusIdx = headers.findIndex(h => h.toLowerCase() === 'status');
  const traineesIdx = headers.findIndex(h => h.toLowerCase() === 'trainees');
  
  rows.forEach((row, index) => {
    const name = extractNameFromNotionLink(row[nameIdx] || '') || `Batch ${index + 1}`;
    const id = generateId('batch', index);
    batchMap.set(name, id);
    
    const dateRange = parseDateRange(row[dateRangeIdx] || '');
    const status = row[statusIdx]?.toLowerCase().includes('completed') ? 'completed' : 
                   row[statusIdx]?.toLowerCase().includes('active') ? 'active' : 'upcoming';
    
    // Count trainees from the trainees column
    const traineesStr = row[traineesIdx] || '';
    const traineeCount = traineesStr.split(',').filter(t => t.trim()).length;
    
    batches.push({
      id,
      name: `Batch ${name}`,
      startDate: dateRange.start || '2025-10-01',
      endDate: dateRange.end || '2025-10-15',
      status: status as 'upcoming' | 'active' | 'completed',
      traineeCount: traineeCount || 0,
      instructors: ['Instructor Team'],
      schedule: 'Sun-Thu, 9:00 AM - 5:00 PM',
      location: 'RED Academy Campus',
      description: `Training batch ${name} - Real estate professional development program`
    });
  });
  
  return { batches, batchMap };
}

function parseCompanies(companySet: Set<string>, trainees: ParsedTrainee[]): ParsedCompany[] {
  const companies: ParsedCompany[] = [];
  let index = 0;
  
  companySet.forEach(companyName => {
    if (!companyName || companyName === 'Unassigned') return;
    
    const traineeCount = trainees.filter(t => t.company === companyName).length;
    const batches = new Set(trainees.filter(t => t.company === companyName).map(t => t.batch));
    
    companies.push({
      id: generateId('company', index),
      name: companyName,
      logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(companyName)}&background=dc2626&color=fff&size=128`,
      traineeCount,
      activeBatches: batches.size,
      contactPerson: `${companyName} HR`,
      email: `hr@${slugify(companyName)}.com`,
      phone: `+20 2${Math.floor(Math.random() * 90000000 + 10000000)}`,
      address: 'Cairo, Egypt',
      industry: 'Real Estate',
      partnerSince: '2024'
    });
    
    index++;
  });
  
  return companies;
}

function parseAssessments(csv: string, trainees: ParsedTrainee[]): ParsedAssessment[] {
  const { headers, rows } = parseCSV(csv);
  const assessments: ParsedAssessment[] = [];
  
  const titleIdx = headers.findIndex(h => h.toLowerCase().includes('assessment title'));
  const traineeIdx = headers.findIndex(h => h.toLowerCase().includes('assessment for'));
  const batchIdx = headers.findIndex(h => h.toLowerCase() === 'batch');
  const companyIdx = headers.findIndex(h => h.toLowerCase() === 'company');
  const outcomeIdx = headers.findIndex(h => h.toLowerCase().includes('outcome'));
  const overallIdx = headers.findIndex(h => h.toLowerCase().includes('overall'));
  const mappingIdx = headers.findIndex(h => h.toLowerCase() === 'mapping');
  const productIdx = headers.findIndex(h => h.toLowerCase().includes('product'));
  const presentabilityIdx = headers.findIndex(h => h.toLowerCase().includes('presentability'));
  const softSkillsIdx = headers.findIndex(h => h.toLowerCase().includes('soft skills'));
  const techScoreIdx = headers.findIndex(h => h.toLowerCase().includes('tech score'));
  const softScoreIdx = headers.findIndex(h => h.toLowerCase().includes('soft score'));
  const commentIdx = headers.findIndex(h => h.toLowerCase().includes('instructor'));
  const aiReportIdx = headers.findIndex(h => h.toLowerCase().includes('ai report'));
  
  rows.forEach((row, index) => {
    const traineeName = extractNameFromNotionLink(row[traineeIdx] || '');
    if (!traineeName) return;
    
    const trainee = trainees.find(t => t.name === traineeName);
    const batchName = extractNameFromNotionLink(row[batchIdx] || '');
    const company = extractNameFromNotionLink(row[companyIdx] || '');
    
    const rawOutcome = row[outcomeIdx] || '';
    let outcome: ParsedAssessment['outcome'] = 'Good';
    if (rawOutcome.toLowerCase().includes('aced')) outcome = 'Aced';
    else if (rawOutcome.toLowerCase().includes('excellent')) outcome = 'Excellent';
    else if (rawOutcome.toLowerCase().includes('very good')) outcome = 'Very Good';
    else if (rawOutcome.toLowerCase().includes('good')) outcome = 'Good';
    else if (rawOutcome.toLowerCase().includes('needs')) outcome = 'Needs Improvement';
    else if (rawOutcome.toLowerCase().includes('failed')) outcome = 'Failed';
    
    assessments.push({
      id: generateId('assessment', index),
      traineeId: trainee?.id || generateId('trainee', index),
      traineeName,
      batchId: `batch-${batchName}`,
      batchName: batchName ? `Batch ${batchName}` : 'Unknown',
      company: company || 'Unknown',
      date: '2025-10-15',
      mapping: parseInt(row[mappingIdx]) || 3,
      productKnowledge: parseInt(row[productIdx]) || 3,
      presentability: parseInt(row[presentabilityIdx]) || 3,
      softSkills: parseInt(row[softSkillsIdx]) || 3,
      overallScore: parsePercentage(row[overallIdx]),
      techScore: parsePercentage(row[techScoreIdx]),
      softScore: parsePercentage(row[softScoreIdx]),
      outcome,
      instructorComment: row[commentIdx] || '',
      aiReport: row[aiReportIdx] || ''
    });
  });
  
  return assessments;
}

function parseDailyAttendance(csv: string, trainees: ParsedTrainee[]): ParsedDailyAttendance[] {
  const { headers, rows } = parseCSV(csv);
  const attendance: ParsedDailyAttendance[] = [];
  
  const idIdx = headers.findIndex(h => h.toLowerCase().includes('entry'));
  const traineeIdx = headers.findIndex(h => h.toLowerCase() === 'trainee 1');  // Changed to Trainee 1
  const batchIdx = headers.findIndex(h => h.toLowerCase() === 'batch');
  const dateIdx = headers.findIndex(h => h.toLowerCase() === 'date');
  const arrivalIdx = headers.findIndex(h => h.toLowerCase().includes('arrival'));
  const departureIdx = headers.findIndex(h => h.toLowerCase().includes('departure'));
  const statusIdx = headers.findIndex(h => h.toLowerCase() === 'status');
  const minutesLateIdx = headers.findIndex(h => h.toLowerCase().includes('minutes late'));
  const isLateIdx = headers.findIndex(h => h.toLowerCase() === 'was late?');  // More specific
  
  rows.forEach((row, index) => {
    let traineeName = extractNameFromNotionLink(row[traineeIdx] || '');
    // Handle URL-encoded paths like "Abdelrahman Hesham (../...)"
    if (!traineeName && row[traineeIdx]) {
      const match = row[traineeIdx].match(/^([A-Za-z\s]+)\s*\(/);
      if (match) traineeName = match[1].trim();
    }
    // Also try to extract from Entry ID format "2025-11-05 - Abdelrahman Hesham"
    if (!traineeName && row[idIdx]) {
      const match = row[idIdx].match(/-\s*(.+)$/);
      if (match) traineeName = match[1].trim();
    }
    if (!traineeName) return;
    
    const trainee = trainees.find(t => t.name === traineeName);
    let batchName = extractNameFromNotionLink(row[batchIdx] || '');
    // Extract batch number from "Batch 27 (...)"
    const batchMatch = (row[batchIdx] || '').match(/Batch\s*(\d+)/i);
    if (batchMatch) batchName = batchMatch[1];
    
    const rawStatus = row[statusIdx]?.toLowerCase() || '';
    
    let status: ParsedDailyAttendance['status'] = 'present';
    if (rawStatus.includes('absent')) status = 'absent';
    else if (rawStatus.includes('late')) status = 'late';
    else if (rawStatus.includes('off')) status = 'off-day';
    else if (rawStatus.includes('tour')) status = 'tour-day';
    else if (rawStatus.includes('excused')) status = 'excused';
    else if (!rawStatus) status = 'present';  // Default to present if status empty but has data
    
    const isLate = row[isLateIdx]?.toLowerCase() === 'yes' || 
                   row[isLateIdx]?.toLowerCase() === 'true' ||
                   row[isLateIdx]?.includes('Yes');
    
    attendance.push({
      id: row[idIdx] || generateId('daily', index),
      traineeId: trainee?.id || generateId('trainee', index),
      traineeName,
      batchId: `batch-${batchName}`,
      batchName: batchName ? `Batch ${batchName}` : 'Unknown',
      date: parseNotionDate(row[dateIdx] || '') || '2025-10-15',
      arrivalTime: parseTime(row[arrivalIdx] || '') || '09:00',
      departureTime: parseTime(row[departureIdx] || '') || '17:00',
      status,
      minutesLate: parseInt(row[minutesLateIdx]) || 0,
      isLate
    });
  });
  
  return attendance;
}

function parseTenDayAttendance(csv: string, trainees: ParsedTrainee[]): ParsedTenDayAttendance[] {
  const { headers, rows } = parseCSV(csv);
  const attendance: ParsedTenDayAttendance[] = [];
  
  const traineeIdx = headers.findIndex(h => h.toLowerCase() === 'trainee');
  const batchIdx = headers.findIndex(h => h.toLowerCase() === 'batch');
  const periodStartIdx = headers.findIndex(h => h.toLowerCase().includes('period start'));
  const periodEndIdx = headers.findIndex(h => h.toLowerCase().includes('period end'));
  const presentIdx = headers.findIndex(h => h.toLowerCase().includes('present'));
  const absentIdx = headers.findIndex(h => h.toLowerCase().includes('absent'));
  const lateIdx = headers.findIndex(h => h.toLowerCase().includes('late'));
  const completionIdx = headers.findIndex(h => h.toLowerCase().includes('completion'));
  
  // Find day columns (Day 1, Day 2, etc.)
  const dayIndices: number[] = [];
  headers.forEach((h, i) => {
    if (/day\s*\d+/i.test(h)) {
      dayIndices.push(i);
    }
  });
  
  rows.forEach((row, index) => {
    const traineeName = extractNameFromNotionLink(row[traineeIdx] || '');
    if (!traineeName) return;
    
    const trainee = trainees.find(t => t.name === traineeName);
    const batchName = extractNameFromNotionLink(row[batchIdx] || '');
    
    // Parse day columns
    const days: ('present' | 'absent' | 'late' | 'excused')[] = [];
    dayIndices.forEach(dayIdx => {
      const value = row[dayIdx]?.toLowerCase() || '';
      if (value === 'yes' || value.includes('yes')) {
        days.push('present');
      } else if (value === 'no' || value.includes('no')) {
        days.push('absent');
      } else {
        days.push('excused');
      }
    });
    
    // Pad to 10 days if needed
    while (days.length < 10) {
      days.push('excused');
    }
    
    attendance.push({
      id: generateId('tenday', index),
      traineeId: trainee?.id || generateId('trainee', index),
      traineeName,
      batchId: `batch-${batchName}`,
      batchName: batchName ? `Batch ${batchName}` : 'Unknown',
      periodStart: parseNotionDate(row[periodStartIdx] || '') || '2025-10-01',
      periodEnd: parseNotionDate(row[periodEndIdx] || '') || '2025-10-10',
      days,
      presentCount: parseInt(row[presentIdx]) || days.filter(d => d === 'present').length,
      absentCount: parseInt(row[absentIdx]) || days.filter(d => d === 'absent').length,
      lateCount: parseInt(row[lateIdx]) || days.filter(d => d === 'late').length,
      completionPercentage: parsePercentage(row[completionIdx])
    });
  });
  
  return attendance;
}

// Main execution
async function main() {
  const dataDir = 'j:/avaria/datacv/Export-b8fbd3da-e833-42e1-91c0-4b73e8b36dac/Super Admin Only/298a824234cc81d5b45e00421853fc94';
  
  console.log('🚀 Starting Notion data import...\n');
  
  // Read CSV files (using the _all.csv versions for complete data)
  const traineesCSV = fs.readFileSync(path.join(dataDir, '👤 Trainees (Master DB) d915f64933544417b590d20e0b86ca40_all.csv'), 'utf-8');
  const batchesCSV = fs.readFileSync(path.join(dataDir, '🎓 Batches (Master DB) 591a12ca833c462f998c2469d3e9d201_all.csv'), 'utf-8');
  const assessmentsCSV = fs.readFileSync(path.join(dataDir, '📈 Assessments (Master DB) 2c399b6977bd4865a5c4cdef1e6c4e10_all.csv'), 'utf-8');
  const dailyCSV = fs.readFileSync(path.join(dataDir, '🗓️ Daily Attendance Log (Master DB) 5e1c376a2749417c801b0a55d4d4d918_all.csv'), 'utf-8');
  const tenDayCSV = fs.readFileSync(path.join(dataDir, '🗓️ Attendance (10-Day Log) d5abb4c82b3246908406a8c45f03a938_all.csv'), 'utf-8');
  
  console.log('📂 CSV files loaded successfully\n');
  
  // Parse data
  const { batches, batchMap } = parseBatches(batchesCSV);
  console.log(`✅ Parsed ${batches.length} batches`);
  
  const companySet = new Set<string>();
  const trainees = parseTrainees(traineesCSV, batchMap, companySet);
  console.log(`✅ Parsed ${trainees.length} trainees`);
  
  const companies = parseCompanies(companySet, trainees);
  console.log(`✅ Parsed ${companies.length} companies`);
  
  const assessments = parseAssessments(assessmentsCSV, trainees);
  console.log(`✅ Parsed ${assessments.length} assessments`);
  
  const dailyAttendance = parseDailyAttendance(dailyCSV, trainees);
  console.log(`✅ Parsed ${dailyAttendance.length} daily attendance records`);
  
  const tenDayAttendance = parseTenDayAttendance(tenDayCSV, trainees);
  console.log(`✅ Parsed ${tenDayAttendance.length} 10-day attendance records`);
  
  // Generate output
  const output = {
    trainees,
    batches,
    companies,
    assessments,
    dailyAttendance,
    tenDayAttendance,
    stats: {
      totalTrainees: trainees.length,
      totalBatches: batches.length,
      totalCompanies: companies.length,
      totalAssessments: assessments.length,
      totalDailyRecords: dailyAttendance.length,
      totalTenDayRecords: tenDayAttendance.length
    }
  };
  
  // Write to JSON file
  const outputPath = 'j:/avaria/lib/notionData.json';
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`\n📁 Data written to ${outputPath}`);
  
  console.log('\n📊 Summary:');
  console.log(`   - Trainees: ${trainees.length}`);
  console.log(`   - Batches: ${batches.length}`);
  console.log(`   - Companies: ${companies.length}`);
  console.log(`   - Assessments: ${assessments.length}`);
  console.log(`   - Daily Attendance: ${dailyAttendance.length}`);
  console.log(`   - 10-Day Attendance: ${tenDayAttendance.length}`);
  console.log('\n✨ Import complete!');
}

main().catch(console.error);

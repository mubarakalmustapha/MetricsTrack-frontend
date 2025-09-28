import type { StaffUser } from '../types/index';

export const AIService = {
  parseTime: (time: string): number => {
    const match = time.match(/(\d+)h\s*(\d+)?m?/);
    const hours = match ? parseInt(match[1]) : 0;
    const minutes = match && match[2] ? parseInt(match[2]) : 0;
    return hours * 60 + minutes;
  },

  formatTime: (totalMinutes: number): string => {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}h ${m}m`;
  },

  processQuery: (input: string, staffData: StaffUser[]): string => {
    const query = input.toLowerCase();

    const findStaffByName = () => {
      return staffData.find(s => query.includes(s.firstName.toLowerCase()));
    };

    if (query.includes("hours") && query.includes("week")) {
      const staff = findStaffByName();
      return staff
        ? `${staff.firstName} has worked **${staff.hoursWeek}** this week. Currently ${staff.status}.`
        : "Please specify a valid staff name.";
    }

    if (query.includes("most hours")) {
      const top = [...staffData].sort(
        (a, b) => AIService.parseTime(b.hoursWeek) - AIService.parseTime(a.hoursWeek)
      )[0];
      return `This week, **${top.firstName}** worked the most with **${top.hoursWeek}**.`;
    }

    if (query.includes("online")) {
      const onlineStaff = staffData.filter(s => s.status === "online");
      return onlineStaff.length
        ? `Currently **${onlineStaff.length} staff** are online: ${onlineStaff.map(s => s.firstName).join(', ')}.`
        : "No staff are online right now.";
    }

    if (query.includes("department")) {
      const deptSummary: Record<string, number> = {};
      staffData.forEach(s => {
        deptSummary[s.department] = (deptSummary[s.department] || 0) + AIService.parseTime(s.hoursWeek);
      });
      return "Department breakdown:\n" +
        Object.entries(deptSummary)
          .map(([dept, minutes]) => `• **${dept}**: ${AIService.formatTime(minutes)}`)
          .join("\n");
    }

    return "I can help you analyze staff productivity. Try asking:\n• Who worked the most this week?\n• How many hours did [staff] work today?\n• Who is online?\n• Show productivity by department.";
  }
};
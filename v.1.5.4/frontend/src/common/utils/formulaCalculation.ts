import moment from 'moment';
import { convertSecondToTimeRound, formatTimestamp } from './config';
import {
  calculateEarlyCheckOut,
  calculateEarlyCheckOutForBreak,
  calculateLateCheckIn,
  calculateLateCheckInAfterBreak,
  calculateWorkingDays,
} from './timeCalculation';
export let totalLateDuration: number = 0;

export function setTotalLateDuration(value: number) {
  totalLateDuration = value;
}
// konversi durasi
export function convertDuration(
  durationInSecond: number,
  to: string = 'seconds',
): any {
  if (to === 'days') {
    return Math.floor(durationInSecond / 3600 / 24);
  } else if (to === 'hours') {
    return Math.floor(durationInSecond / 3600);
  } else if (to === 'minutes') {
    return Math.floor(durationInSecond / 60);
  } else {
    return durationInSecond;
  }
}

// total jam kerja
export function getTotalWorkHoursBasedOnSchedule(
  date: string,
  schedule: {
    time_check_in: string;
    time_check_out: string;
    time_break_start: string;
    time_break_end: string;
  },
) {
  const dateCheckIn = formatTimestamp(date, schedule.time_check_in);
  const dateCheckOut = formatTimestamp(date, schedule.time_check_out);
  const dateBreakStart = formatTimestamp(date, schedule.time_break_start);
  const dateBreakFinish = formatTimestamp(date, schedule.time_break_end);
  const diffCheckInCheckOut = moment(dateCheckOut).diff(
    dateCheckIn,
    'hours',
    true,
  );
  const diffBreakStartBreakFinish = moment(dateBreakFinish).diff(
    dateBreakStart,
    'hours',
    true,
  );
  const totalWorkHours = diffCheckInCheckOut - diffBreakStartBreakFinish;
  return totalWorkHours > 0 ? totalWorkHours : 0;
}

// Potongan Jam Masuk
export function formulaDeductionNominalLateCheckInDaily(
  time_check_in: string, // can be check in, check out, break start, break end
  schedule: {
    time_check_in: string;
    time_check_out: string;
    time_break_start: string;
    time_break_end: string;
  },
  base_salary: number,
  time_type: string,
): any {
  let duration = 0;
  switch (time_type) {
    case 'check_in':
      duration = calculateLateCheckIn(time_check_in, schedule.time_check_in);
      break;
    case 'check_out':
      duration = calculateEarlyCheckOut(time_check_in, schedule.time_check_out);
      break;
    case 'break_start':
      duration = calculateEarlyCheckOutForBreak(
        time_check_in,
        schedule.time_break_start,
      );
      break;
    case 'break_end':
      duration = calculateLateCheckInAfterBreak(
        time_check_in,
        schedule.time_break_end,
      );
      break;
    default:
  }
  if (new Date(time_check_in).getDay() === 0) {
    duration = 0;
  }

  return calculateDeductionFlexible(duration, time_check_in, base_salary);
}
// potongan izin dan terlambat produksi
export function calculateLateAndLeaveDeduction(
  time: any,
  oldDuration: number,
  day: string,
  base_salary: number,
) {
  if (oldDuration > 0) {
    totalLateDuration += oldDuration;
  }
  let totalWorkHours = 0;
  if (new Date(day).getDay() !== 6) {
    totalWorkHours = 7;
  } else {
    totalWorkHours = 5;
  }

  let duration = 0;
  let calculatedDuration = { result: 0, leftover: 0 };
  if (oldDuration >= 1800) {
    calculatedDuration = calculateWorkingDays(oldDuration, 1800);
    duration = calculatedDuration.result;
  } else {
    duration = oldDuration;
  }

  if (calculatedDuration.leftover > 0 && calculatedDuration.leftover < 1800) {
    duration += 1800;
  } else if (calculatedDuration.leftover >= 1800) {
    duration += 3600;
  }
  if (duration === 0) {
    return {
      real_duration: duration,
      calculated_duration: 0,
      nominal: 0,
    };
  } else if (duration >= 60 && duration <= 120) {
    return {
      real_duration: duration,
      calculated_duration: duration,
      nominal: 1000,
    };
  } else if (duration >= 180 && duration <= 300) {
    return {
      real_duration: duration,
      calculated_duration: duration,
      nominal: 2000,
    };
  } else if (duration > 300 && duration < 3600) {
    return {
      real_duration: duration,
      calculated_duration: 1800,
      nominal: (base_salary / totalWorkHours) * 0.5,
    };
  } else if (duration === 3600) {
    return {
      real_duration: duration,
      calculated_duration: duration,
      nominal: base_salary / totalWorkHours,
    };
  } else if (duration > 3600) {
    let hours: number = 0;
    while (duration >= 3600) {
      hours++;
      duration -= 3600;
    }
    if (duration > 1800) {
      hours++;
    } else if (duration > 0 && duration <= 1800) {
      hours += 0.5;
    }
    return {
      real_duration: duration,
      calculated_duration: hours * 3600,
      nominal: (base_salary / totalWorkHours) * hours,
    };
  } else {
    return {
      real_duration: 0,
      calculated_duration: 0,
      nominal: 0,
    };
  }
}
export function calculateDeductionFlexible(
  duration: number,
  time_check_in: string,
  base_salary: number,
) {
  if (duration > 0) {
    totalLateDuration += duration;
  }
  let totalWorkHours = 0;
  if (new Date(time_check_in).getDay() !== 6) {
    totalWorkHours = 7;
  } else {
    totalWorkHours = 5;
  }
  if (duration === 0) {
    return {
      real_duration: duration,
      calculated_duration: 0,
      nominal: 0,
    };
  } else if (duration >= 60 && duration <= 120) {
    return {
      real_duration: duration,
      calculated_duration: 0,
      nominal: 1000,
    };
  } else if (duration >= 180 && duration <= 300) {
    return {
      real_duration: duration,
      calculated_duration: 0,
      nominal: 2000,
    };
  } else if (duration > 300 && duration < 3600) {
    return {
      real_duration: duration,
      calculated_duration: 0,
      nominal: (base_salary / totalWorkHours) * 0.5,
    };
  } else if (duration === 3600) {
    return {
      real_duration: duration,
      calculated_duration: 0,
      nominal: base_salary / totalWorkHours,
    };
  } else if (duration > 3600) {
    let hours: number = 0;
    while (duration >= 3600) {
      hours++;
      duration -= 3600;
    }
    if (duration >= 1800) {
      hours++;
    } else if (duration > 0 && duration < 1800) {
      hours += 0.5;
    }
    return {
      real_duration: duration,
      calculated_duration: hours,
      nominal: (base_salary / totalWorkHours) * hours,
    };
  } else {
    return {
      real_duration: 0,
      calculated_duration: 0,
      nominal: 0,
    };
  }
}
export function deductionFlexible(duration: number, base_salary: number) {
  let deduction = 0;
  if (duration <= 0) {
    return 0;
  }
  if (duration >= 60 && duration <= 120) {
    deduction = 1000;
  }
  if (duration > 120 && duration <= 600) {
    deduction = 2000;
  }
  if (duration > 600 && duration <= 1800) {
    deduction = (base_salary / 8) * 0.5;
  }
  if (duration > 1800) {
    let temp = 0;
    while (duration >= 1800 && duration > 0) {
      duration -= 1800;
      temp += 1800;
    }
    if (duration > 0) {
      temp += 1800;
    }
    deduction = (base_salary / 8) * (temp / 3600);
  }
  // return {
  //   real_duration: 0,
  //   calculated_duration: 0,
  //   nominal: 0,
  // };
  return deduction;
}
// Terlambat Akumulasi 1 Bulan
export function formulaDeductionNominalLateCheckInDateRange(
  entries: Array<{ time_check_in: string }>,
  schedule: {
    time_check_in: string;
    time_check_out: string;
    time_break_start: string;
    time_break_end: string;
  },
  base_salary: number,
): any {
  let totalDuration = 0;
  for (const entry of entries) {
    const duration = calculateLateCheckIn(
      entry.time_check_in,
      schedule.time_check_in,
    );
    totalDuration += Number(duration);
  }

  const durationInMinutes = convertDuration(totalDuration, 'minutes');
  const durationInHours = convertDuration(totalDuration, 'hours');
  if (durationInMinutes >= 0 && durationInMinutes <= 15) {
    return 0;
  } else if (durationInMinutes >= 16 && durationInMinutes <= 20) {
    return (base_salary / 25 / 8) * 1;
  } else if (durationInMinutes >= 21 && durationInMinutes <= 30) {
    return (base_salary / 25 / 8) * 2;
  } else {
    return (base_salary / 25 / 8) * 1 * durationInMinutes;
  }
}

// Potongan Hari Kerja
export function formulaDeductionNominalLateOrLeaveDateRange(
  entries: Array<{ time_check_in: string }>,
  schedule: {
    time_check_in: string;
    time_check_out: string;
    time_break_start: string;
    time_break_end: string;
  },
  base_salary: number,
): any {
  let totalDuration = 0;
  for (const entry of entries) {
    const duration = calculateLateCheckIn(
      entry.time_check_in,
      schedule.time_check_in,
    );
    totalDuration += Number(duration);
  }

  const durationInMinutes = convertDuration(totalDuration, 'minutes');
  const durationInHours = convertDuration(totalDuration, 'hours');
  if (durationInMinutes >= 0 && durationInMinutes <= 15) {
    return 0;
  } else if (durationInMinutes >= 16 && durationInMinutes <= 20) {
    return (base_salary / 25 / 8) * 1;
  } else if (durationInMinutes >= 21 && durationInMinutes <= 30) {
    return (base_salary / 25 / 8) * 2;
  } else {
    return (base_salary / 25 / 8) * 1 * durationInMinutes;
  }
}
export function getMonthlyLateDeduction(
  totalLate: number,
  base_salary: number,
) {
  if (totalLate >= 0 && totalLate <= 900) {
    return 0;
  } else if (totalLate > 900 && totalLate <= 1200) {
    return (1 / 8) * base_salary;
  } else if (totalLate > 1200 && totalLate <= 1800) {
    return (2 / 8) * base_salary;
  } else {
    totalLate -= 1800;
    let hourOfLate = 0;
    const halfOurDeduction = (2 / 8) * base_salary;
    if (totalLate >= 300) {
      while (totalLate >= 300) {
        totalLate -= 300;
        hourOfLate++;
      }
      if(totalLate > 0) {
        hourOfLate++;
      }
    } else {
      hourOfLate++;
    }
    return (hourOfLate / 8) * base_salary + halfOurDeduction;
  }
}
// cek keterlambatan dan pembulaatan ke izin
export function lateAndLeaveLimitation(
  duration: number, // duration to validate in seconds
  lateLimit: number, // duration to count as late in seconds
  roundUpLimit: number, // duration to count and round up to as leave in seconds
  payslip_filter: any, // payslip duration, 1 weekly, 2 monthly
  payslip_type: any, // 1 production, 2 store, 3 office,
) {
  let leaveDuration = 0;
  let lateDuration = 0;
  if (duration < 0) {
    return {
      leave: 0,
      late: 0,
    };
  }
  switch (Number(payslip_type)) {
    case 1:
      if (duration > lateLimit) {
        if (duration >= roundUpLimit) {
          while (duration >= roundUpLimit) {
            duration -= roundUpLimit;
            leaveDuration += roundUpLimit;
          }
          leaveDuration += roundUpLimit;
        } else {
          leaveDuration += roundUpLimit;
        }
      } else {
        lateDuration = duration;
      }
      break;
    case 2:
      if (Number(payslip_filter) === 1) {
        if (duration > lateLimit) {
          if (duration >= roundUpLimit) {
            while (duration >= roundUpLimit) {
              duration -= roundUpLimit;
              leaveDuration += roundUpLimit;
            }
            if (duration > 0) {
              leaveDuration += roundUpLimit;
            }
          } else {
            leaveDuration += roundUpLimit;
          }
        } else {
          lateDuration = duration;
        }
      } else {
        if (duration > lateLimit) {
          if (duration >= roundUpLimit) {
            while (duration >= roundUpLimit) {
              duration -= roundUpLimit;
              leaveDuration += roundUpLimit;
            }
            if (duration <= lateLimit) {
              lateDuration += duration;
            } else {
              leaveDuration += roundUpLimit;
            }
          } else {
            leaveDuration += roundUpLimit;
          }
        } else {
          lateDuration = duration;
        }
      }
      break;
    case 3:
      if (duration > lateLimit) {
        if (duration >= roundUpLimit) {
          while (duration >= roundUpLimit) {
            duration -= roundUpLimit;
            leaveDuration += roundUpLimit;
          }
          if (duration <= lateLimit) {
            lateDuration += duration;
          } else {
            leaveDuration += roundUpLimit;
          }
        } else {
          leaveDuration += roundUpLimit;
        }
      } else {
        lateDuration = duration;
      }
      break;
  }
  return {
    leave: leaveDuration,
    late: lateDuration,
  };
}

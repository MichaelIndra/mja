import { InitSnackbar } from '@/common/interfaces/snackbar';
import { lateAndLeaveLimitation } from '@/common/utils/formulaCalculation';
import moment from 'moment';
import { formatDate, formatTimestamp, openSnackbarNow } from './config';

// terlambat masuk
export function calculateLateCheckIn(
  time_check_in: string,
  schedule_check_in: string,
): number {
  const diffInSeconds = moment(time_check_in).diff(
    formatTimestamp(
      moment
        .parseZone(time_check_in)
        .local()
        .format(),
      schedule_check_in,
    ),
    'seconds',
    true,
  );
  if (diffInSeconds > 0) {
    return diffInSeconds;
  } else {
    return 0;
  }
}
// pulang cepat
export function calculateEarlyCheckOut(
  time_check_out: string,
  schedule_check_out: string,
): number {
  const diffInSeconds = moment(
    moment
      .parseZone(time_check_out)
      .local()
      .format(),
  ).diff(formatTimestamp(time_check_out, schedule_check_out), 'seconds', true);
  if (diffInSeconds < 0) {
    return diffInSeconds * -1;
  } else {
    return 0;
  }
}

// terlambat masuk setelah istirahat
export function calculateLateCheckInAfterBreak(
  time_check_in_after_break: string,
  schedule_check_in_after_break: string,
): number {
  const diffInSeconds = moment(
    moment
      .parseZone(time_check_in_after_break)
      .local()
      .format(),
  ).diff(
    formatTimestamp(time_check_in_after_break, schedule_check_in_after_break),
    'seconds',
    true,
  );
  if (diffInSeconds > 0) {
    return diffInSeconds;
  } else {
    return 0;
  }
}
// terlalu cepat istirahat
export function calculateEarlyCheckOutForBreak(
  time_check_out_for_break: string,
  schedule_check_out_for_break: string,
): number {
  const diffInSeconds = moment(
    moment
      .parseZone(time_check_out_for_break)
      .local()
      .format(),
  ).diff(
    formatTimestamp(time_check_out_for_break, schedule_check_out_for_break),
    'seconds',
    true,
  );
  if (diffInSeconds < 0) {
    return diffInSeconds * -1;
  } else {
    return 0;
  }
}
export function calculateFixedTotalBreakWork(
  attendanceData: any,
  oneDaySchedule: any,
) {
  let totalLate = calculateLateCheckIn(
    attendanceData.time_check_in,
    oneDaySchedule.start_one,
  );
  const convertBreakStart = calculateEarlyCheckOutForBreak(
    attendanceData.time_check_out_for_break,
    oneDaySchedule.end_one,
  );
  const convertBreakEnd = calculateLateCheckInAfterBreak(
    attendanceData.time_check_in_for_break,
    oneDaySchedule.end_two,
  );
  const breakEarlyDuration = convertBreakStart > 0 ? convertBreakStart : 0;
  const breakLateDuration = convertBreakEnd > 0 ? convertBreakEnd : 0;
  const cutOverDuration = calculateCutOver(
    attendanceData.time_check_out,
    oneDaySchedule.start_two,
  );
  let totalLeave = breakEarlyDuration + breakLateDuration + cutOverDuration;
  let totalOvertime = calculateLateCheckOut(
    attendanceData.time_check_out,
    oneDaySchedule.start_two,
  );
  let totalOvertimeEarly = calculateEarlyCheckIn(
    attendanceData.time_check_in,
    oneDaySchedule.start_one,
  );
  totalOvertimeEarly = roundTime(totalOvertimeEarly, 1800);
  totalOvertime = roundTime(totalOvertime, 1800);
  const time_check_in_late = calculateLateCheckIn(
    attendanceData.time_check_in,
    oneDaySchedule.start_one,
  );
  const time_check_out_for_break_early =
    convertBreakStart > 0 ? convertBreakStart : 0;
  const time_check_in_for_break_late =
    convertBreakEnd > 0 ? convertBreakEnd : 0;
  const time_check_out_early = cutOverDuration > 0 ? cutOverDuration : 0;
  const totalBreakInHour = moment(attendanceData.time_check_in_for_break).diff(
    attendanceData.time_check_out_for_break,
    'seconds',
    true,
  );
  let breakDurationFromSchedule = 0;
  if (oneDaySchedule.duration) {
    breakDurationFromSchedule = Number(oneDaySchedule.duration) * 3600;
  } else {
    breakDurationFromSchedule = moment(
      formatDate(attendanceData.time_check_in, 'input') +
        ' ' +
        oneDaySchedule.end_two,
    ).diff(
      moment(
        formatDate(attendanceData.time_check_in, 'input') +
          ' ' +
          oneDaySchedule.end_one,
      ),
      'seconds',
      true,
    );
  }
  // in seconds, (scanOut-scanIn)-breakDurationFromSchedule
  const totalWorkingHour =
    moment(attendanceData.time_check_out).diff(
      attendanceData.time_check_in,
      'seconds',
      true,
    ) - breakDurationFromSchedule;
  // ignore late and leave if day is inactive or holiday
  if (!oneDaySchedule.active) {
    totalLate = 0;
    totalLeave = 0;
    totalOvertime = roundTime(totalWorkingHour, 1800);
  }

  return {
    totalLate,
    totalOvertimeEarly,
    totalOvertime,
    totalOvertimeValidation: totalOvertime + totalOvertimeEarly,
    totalWorkingHour,
    totalBreakInHour,
    totalLeave,
    time_check_in_late,
    time_check_out_for_break_early,
    time_check_in_for_break_late,
    time_check_out_early,
    schedule: oneDaySchedule,
  };
}
// get total hour of work,break and late based on scan entries
// 1 day = 8 work hour, flexible break hour
export function calculateFlexibleTotalBreakAndWork(
  metaAttendance: any, // rawData from meta of attendance
  schedule: any, // current schedule of a day
  payslip_filter: any, // payslip period, 1 weekly, 2 monthly
  payslip_type: any, // payslip type, 1 production, 2 store, 3 office
  // TODO: add variable to accept holiday and calculate it as overtime
): any {
  let breakInHour = 0;
  let workingHour = 0;
  let leaveInHour = 0;
  let late = 0;
  let overtimeDuration = 0;
  let time_check_in_late = 0;
  let time_check_out_for_break_early = 0;
  let time_check_in_for_break_late = 0;
  let time_check_out_early = 0;
  const totalBreakSchedule = (Number(schedule.duration_hours)*3600)+(Number(schedule.duration_minutes*60));
  for (const [index, item] of metaAttendance.entries.entries()) {
    if (index % 2 === 0) {
      if (index === 0) {
        const lateDuration =
          (new Date(metaAttendance.date + ' ' + item + ':00').getTime() -
            new Date(
              metaAttendance.date + ' ' + schedule.start_one + ':00',
            ).getTime()) /
          1000;
        time_check_in_late = lateDuration > 0 ? lateDuration : 0;
        let validateLate: any;
        if (Number(payslip_filter) === 1) {
          validateLate = lateAndLeaveLimitation(
            lateDuration,
            1800,
            1800,
            payslip_filter,
            payslip_type,
          );
        } else {
          validateLate = lateAndLeaveLimitation(
            lateDuration,
            600,
            3600,
            payslip_filter,
            payslip_type,
          );
        }
        late += validateLate.late;
        leaveInHour += validateLate.leave;
      }
    } else {
      if (index + 1 < metaAttendance.entries.length) {
        breakInHour +=
          (new Date(
            metaAttendance.date +
              ' ' +
              metaAttendance.entries[index + 1] +
              ':00',
          ).getTime() -
            new Date(metaAttendance.date + ' ' + item + ':00').getTime()) /
          1000;
      }
      // check for early check out if so, add into late
      if (index + 1 === metaAttendance.entries.length) {
        if (
          new Date(
            metaAttendance.date + ' ' + schedule.start_two + ':00',
          ).getTime() -
            new Date(metaAttendance.date + ' ' + item + ':00').getTime() >
          0
        ) {
          const earlyCheckout = moment(
            metaAttendance.date + ' ' + schedule.start_two + ':00',
          ).diff(metaAttendance.date + ' ' + item + ':00', 'seconds', true);
          let validateCheckout: any;
          if (Number(payslip_filter) === 1) {
            validateCheckout = lateAndLeaveLimitation(
              earlyCheckout,
              1800,
              1800,
              payslip_filter,
              payslip_type,
            );
            if (validateCheckout.leave === 0 && validateCheckout.late > 0) {
              late += validateCheckout.late;
            } else {
              leaveInHour += validateCheckout.leave;
              if (validateCheckout.late > 0) {
                leaveInHour += 1800;
              }
            }
            time_check_out_early = earlyCheckout > 0 ? earlyCheckout : 0;
          } else {
            validateCheckout = lateAndLeaveLimitation(
              earlyCheckout,
              600,
              3600,
              payslip_filter,
              payslip_type,
            );
            leaveInHour += validateCheckout.leave;
            late += validateCheckout.late;
            time_check_out_early = earlyCheckout > 0 ? earlyCheckout : 0;
          }
        }
      }
      if (
        new Date(metaAttendance.date + ' ' + item + ':00').getTime() >
        new Date(
          metaAttendance.date + ' ' + schedule.start_two + ':00',
        ).getTime()
      ) {
        overtimeDuration +=
          (new Date(metaAttendance.date + ' ' + item + ':00').getTime() -
            new Date(
              metaAttendance.date + ' ' + schedule.start_two + ':00',
            ).getTime()) /
          1000;
        if (Number(payslip_filter) === 1) {
          overtimeDuration = 0;
          // overtimeDuration = roundTime(overtimeDuration, 1800);
        } else {
          overtimeDuration = roundTime(overtimeDuration, 3600);
        }
      }
    }
    workingHour = moment(
      // (check_out - check_in) - break duration
      metaAttendance.date +
        ' ' +
        metaAttendance.entries[metaAttendance.entries.length - 1] +
        ':00',
    ).diff(
      metaAttendance.date + ' ' + metaAttendance.entries[0] + ':00',
      'seconds',
      true,
    );
    // calculate overtime on day off and set workingHour to 0
    if (!schedule.active) {
      workingHour = 0;
      if (index % 2 === 0 && item[index + 1]) {
        overtimeDuration +=
          new Date(
            metaAttendance.date +
              ' ' +
              metaAttendance.entries[index + 1] +
              ':00',
          ).getTime() -
          new Date(
            metaAttendance.date + ' ' + metaAttendance.entries[index] + ':00',
          ).getTime();
        if (Number(payslip_filter) === 1) {
          overtimeDuration = roundTime(overtimeDuration, 1800);
        } else {
          overtimeDuration = roundTime(overtimeDuration, 3600);
        }
      }
    }
  }
  console.info('totalWorkBefore', workingHour);
  // if employee works only half day not minus the break duration
  if (workingHour > 18000) {
    workingHour -= totalBreakSchedule;
  } else {
    if (leaveInHour > 0) {
      leaveInHour -= totalBreakSchedule;
    }
  }
  // round work duration down to an hour period
  /*if (workingHour < 28800) {
    workingHour = roundTime(workingHour, 3600);
  }*/

  if (breakInHour > totalBreakSchedule) {
    const overBreak = breakInHour - totalBreakSchedule;
    let validateOverBreak: any;
    if (Number(payslip_filter) === 1) {
      validateOverBreak = lateAndLeaveLimitation(
        overBreak,
        1800,
        3600,
        payslip_filter,
        payslip_type,
      );
    } else {
      validateOverBreak = lateAndLeaveLimitation(
        overBreak,
        600,
        3600,
        payslip_filter,
        payslip_type,
      );
    }
    late += validateOverBreak.late;
    leaveInHour += validateOverBreak.leave;
    time_check_out_for_break_early = validateOverBreak.leave;
    time_check_in_for_break_late = overBreak > 0 ? overBreak : 0;
    breakInHour = totalBreakSchedule;
  } else {
    breakInHour = Number(schedule.duration) * 3600;
  }
  return {
    // return all params in seconds
    totalBreakInHour: breakInHour,
    totalWorkingHour: workingHour,
    totalLeave: leaveInHour,
    totalLate: late,
    totalOvertime: overtimeDuration,
    totalOvertimeEarly: 0,
    totalOvertimeValidation: overtimeDuration,
    time_check_in_late,
    time_check_out_for_break_early,
    time_check_in_for_break_late,
    time_check_out_early,
    schedule,
  };
}
export function roundTime(duration: number, limit: number) {
  let temp = 0;
  if (duration >= limit) {
    while (duration >= limit) {
      duration -= limit;
      temp += limit;
    }
    return temp;
  } else {
    return 0;
  }
}
// lembur (pulang telat)
export function calculateLateCheckOut(
  time_check_out: string,
  schedule_check_out: string,
): number {
  const diffInSeconds = moment(time_check_out).diff(
    formatTimestamp(
      moment
        .parseZone(time_check_out)
        .local()
        .format(),
      schedule_check_out,
    ),
    'seconds',
    true,
  );
  if (diffInSeconds > 0) {
    return diffInSeconds;
  } else {
    return 0;
  }
}

// lembur datang kecepatan
export function calculateEarlyCheckIn(
  time_check_in: string,
  schedule_check_in: string,
): number {
  // const diffInSeconds = moment(time_check_in).diff(
  //   formatTimestamp(moment.parseZone(time_check_in).local().format(), schedule_check_in),
  //   'seconds',
  //   true,
  // );
  const diffInSeconds = moment(
    formatTimestamp(
      moment
        .parseZone(time_check_in)
        .local()
        .format(),
      schedule_check_in,
    ),
  ).diff(moment(time_check_in), 'seconds');
  if (diffInSeconds >= 1800) {
    return diffInSeconds;
  } else {
    return 0;
  }
}

// pulang cepat
export function calculateCutOver(
  time_check_out: string,
  schedule_check_out: string,
): number {
  const diffInSeconds = moment(time_check_out).diff(
    formatTimestamp(
      moment
        .parseZone(time_check_out)
        .local()
        .format(),
      schedule_check_out,
    ),
    'seconds',
    true,
  );
  if (diffInSeconds < 0) {
    return diffInSeconds * -1;
  } else {
    return 0;
  }
}
// total working day from current working hours
export function calculateWorkingDays(
  totalWorkHours: number, // total working hours in seconds
  divider: number, // unit to achieve
) {
  let temp = 0;
  while (totalWorkHours >= divider) {
    temp += divider;
    totalWorkHours -= divider;
  }
  return {
    result: temp,
    leftover: totalWorkHours,
  };
}
export function processAttendances(data: any) {
  return data.map((item: any) => {
    // get current schedule based on day of attendance data
    const currentSchedule = item.meta.schedule
      ? item.meta.schedule
      : item.employee.group.schedule.schedules.find((el: any) => {
          return el.value === new Date(item.time_check_in).getDay();
        });
    // TODO: get schedule from group for imported data
    // get payslip duration to separate duration calculation
    const payslip_filter = item.employee.department.meta.payslip_filter;
    let getStatus = '';
    const totalBreak = item.meta.totalBreak ? item.meta.totalBreak : 0;
    const totalWork = item.meta.totalWork ? item.meta.totalWork : 0;
    const totalLeave = item.meta.totalLeave ? item.meta.totalLeave : 0;
    const totalLate = item.meta.totalLate ? item.meta.totalLate : 0;
    const totalOvertime = item.meta.totalOvertime ? item.meta.totalOvertime : 0;
    if (
      totalOvertime > 0 &&
      (Number(item.employee.department.meta.payslip_type) !== 2 ||
        item.employee.department.meta.payslip_filter !== 1)
    ) {
      getStatus += ' Lembur,';
    }
    if (payslip_filter === 2 && (totalLeave > 600 || totalLate > 600)) {
      getStatus += ' Izin,';
    } else if (totalLeave > 0) {
      getStatus += ' Izin';
    }
    if (
      payslip_filter === 2 &&
      ((totalLate > 0 && totalLate <= 600) ||
        (totalLeave > 0 && totalLeave <= 600))
    ) {
      getStatus += ' Terlambat,';
    } else if (totalLate > 0) {
      getStatus += ' Terlambat,';
    }
    if (item.meta.isSwitchSchedule === 'yes') {
      getStatus += ' Tukar Jadwal,';
    }
    const timeCheckOuts = JSON.parse(
      JSON.stringify(item.meta.rawData.timeCheckOuts),
    );
    const timeCheckIns = JSON.parse(
      JSON.stringify(item.meta.rawData.timeCheckIns),
    );
    const timeCheckOutsBackup = JSON.parse(
      JSON.stringify(item.meta.rawData.timeCheckOuts),
    );
    const timeCheckInsBackup = JSON.parse(
      JSON.stringify(item.meta.rawData.timeCheckIns),
    );
    if (timeCheckOuts.length > 1) {
      timeCheckOuts.pop();
    } else {
      timeCheckOuts[0] = moment(item.time_check_out_for_break).format('HH:mm');
    }
    if (timeCheckIns.length > 1) {
      timeCheckIns.shift();
    } else {
      timeCheckIns[0] = moment(item.time_check_in_for_break).format('HH:mm');
    }
    return {
      ...item,
      scheduleToday: item.meta.fixedSchedule
        ? [item.meta.fixedSchedule]
        : currentSchedule
        ? [currentSchedule]
        : [],
      date: formatDate(item.time_check_in, 'short-date'),
      date_entry: formatDate(item.date_entry, 'input'),
      time_check_in: formatDate(
        item.meta.rawData.date + ' ' + item.meta.rawData.entries[0] + ':00',
        'timeShort',
      ),
      check_in: item.meta.rawData.entries[0],
      timeCheckInsBackup,
      timeCheckOutsBackup,
      time_check_out_for_break: timeCheckOuts,
      time_check_in_for_break: timeCheckIns,
      time_check_out: formatDate(
        item.meta.rawData.date +
          ' ' +
          item.meta.rawData.entries[item.meta.rawData.entries.length - 1] +
          ':00',
        'timeShort',
      ),
      totalBreak,
      totalWork,
      totalLeave,
      totalLate,
      totalOvertime,
      totalOvertimeEarly: item.meta.totalOvertimeEarly,
      totalOvertimeValidation: item.meta.totalOvertimeValidation,
      status: getStatus,
      created_at: formatDate(item.created_at, 'long'),
      updated_at: formatDate(item.updated_at, 'long'),
    };
  });
}
export function getAbsentFromLeaves(
  leaves: any, // leaves object
  routeParams: any, // params form this.$route object
) {
  // let dayLeave: number = 0;
  // let hourLeave: number = 0;
  // let duration: number = 0;
  // let date: any = [];
  const newData = [];
  const holidayData = routeParams.dataHolidays.split(',');
  for (const leaveItem of leaves) {
    if (
      new Date(leaveItem.date_start).getTime() >=
        new Date(routeParams.dateStart).getTime() &&
      new Date(leaveItem.date_end).getTime() <=
        new Date(routeParams.dateEnd).getTime()
    ) {
      const timeDiff = moment(leaveItem.date_end).diff(
        leaveItem.date_start,
        'hours',
        true,
      );
      if (timeDiff < 23) {
        // hours period leave
        const validateDay = holidayData.find((el: any) => {
          return moment(el).day() === moment(leaveItem.date_start).day();
        });
        console.info('cek 1', timeDiff, validateDay);
        if (!validateDay || validateDay === '0') {
          newData.push({
            hourLeave: timeDiff,
            duration: timeDiff * 3600,
            date: leaveItem.date_start,
          });
        }
      } else {
        // day period leave
        // let checkDate = moment(leaveItem.date_start).valueOf(); // unix timestamp of date_start
        // while (checkDate <= moment(leaveItem.date_end).valueOf()) {
        //   checkDate += 86400000;
        //   dayLeave++;
        // }
      }
    }
  }
  return newData;
  // return {
  //   date: date.length > 0 || [],
  //   duration: duration > 0 ? duration : 0,
  //   dayLeave: dayLeave > 0 ? dayLeave : 0,
  //   hourLeave: hourLeave > 0 ? hourLeave : 0,
  // };
}
// get date from excel with format dd/mm/yyyy
export function convertDate(date: any) {
  if (typeof date === 'string') {
    const rawDate = date.split('/');
    let newDate = date;
    if (rawDate.length === 3) {
      newDate = rawDate[2].concat('-', rawDate[1]).concat('-', rawDate[0]);
    }

    const rawDate2 = newDate.split('-');
    if (rawDate2.length === 3) {
      // date is ok
    } else {
      const snackbar = {
        ...InitSnackbar,
        value: true,
        message: 'Format Tanggal tidak sesuai, contoh: 01/12/2019',
        color: 'warn',
      };
      openSnackbarNow(snackbar);
    }
    return newDate;
  } else {
    const snackbar = {
      ...InitSnackbar,
      value: true,
      message: 'Format Tanggal harus text, contoh: 01/12/2019',
      color: 'warn',
    };
    openSnackbarNow(snackbar);
    return '';
  }
}
// get time from excel with format hh:mm:ss change to hh:mm
export function convertTime(time: any) {
  if (typeof time !== 'string') {
    const snackbar = {
      ...InitSnackbar,
      value: true,
      message: 'Format jam harus text, contoh: 12:59:00',
      color: 'warn',
    };
    openSnackbarNow(snackbar);
    return '';
  } else {
    const rawTime = time.split(':');
    let newTime = time;
    if (rawTime.length >= 3) {
      newTime = rawTime[0].concat(':', rawTime[1]);
    } else if (rawTime.length === 2) {
      newTime = rawTime[0].concat(':', rawTime[1]);
    } else {
      const snackbar = {
        ...InitSnackbar,
        value: true,
        message: 'Format jam tidak sesuai, contoh: 12:59:00',
        color: 'warn',
      };
      openSnackbarNow(snackbar);
    }
    return newTime;
  }
}
export function convertMonthlyLateToLeave(totalLate: number) {
  if (totalLate >= 0 && totalLate <= 900) {
    return 0;
  } else if (totalLate > 900 && totalLate <= 1200) {
    return 1;
  } else if (totalLate > 1200 && totalLate <= 1800) {
    return 2;
  } else {
    totalLate -= 1800;
    let hourOfLate = 0;
    const halfOurDeduction = 2;
    if (totalLate >= 300) {
      while (totalLate >= 300) {
        totalLate -= 300;
        hourOfLate++;
      }
      if (totalLate > 0) {
        hourOfLate++;
      }
    } else {
      hourOfLate++;
    }
    return hourOfLate + halfOurDeduction;
  }
}
export function isDateArrayInsideRange(
  dateArray: [],
  dateStart: string,
  dateEnd: string,
) {
  let counter = 0;
  for(const day of dateArray) {
    if(moment(day).diff(dateStart,'seconds',true) < 0 ||
      moment(day).diff(dateEnd,'seconds',true) > 0) {
      counter++;
    }
  }
  return counter===0;
}

// bonus lembur
import { calculateWorkingDays } from '@/common/utils/timeCalculation';
import moment from 'moment';

export const getDailyOvertimeReward = (
  timeCheckIn: Date, // Time_check_in from DB
  timeCheckOut: Date, // Time_check_out from DB
  DailySalary: number, // Fixed daily salary from previous rule
  overtimeHours: number, // total overtime in hours format, if < 1 means in minutes
  overtimeHoursEarly: number, // total overtime in hours format, if < 1 means in minutes
  holidays: any, // array holidays
  workingHours: number,
  sameDay: string,
) => {
  let dailyOvertimeReward: number = 0;
  const day = timeCheckOut.getDay();
  const hours = timeCheckOut.getHours();

  // const pastHour = moment(timeCheckOut).diff(
  //   moment(timeCheckOut).set('hours', 22),
  //   'hour',
  //   true,
  // );

  // const b = new Date(
  //   Date.parse(timeCheckOut.toString().substr(0, 10) + 'T22:00:00+0000')
  // ).getTime();
  const timezone: number = -1 * new Date().getTimezoneOffset() * 60000;
  const a = timeCheckOut.getTime();
  const b: number = new Date(
    timeCheckOut.toISOString().substr(0, 10) + 'T22:00:00.000Z',
  ).getTime();

  console.info(
    `timeCheckIn:${timeCheckIn}, timeCheckOut:${timeCheckOut}, overtimeHours:${overtimeHours}, overtimeHoursEarly:${overtimeHoursEarly}, holidays:${holidays}, workingHours:${workingHours}, sameDay:${sameDay}`,
  );

  console.info('a-b', hours >= 22 && a - b > 0);
  // lembur hari minggu dan tanggal merah
  if (holidays.length > 0 && sameDay) {
    console.info('zol 1');
    for (const item of holidays) {
      const holiday = Number(moment(item).format('d'));
      if (hours >= 8 && hours <= 22 && (holiday === day || day === 0)) {
        let newWorkingHours = workingHours * 3600;
        let newHours: number = 0;
        if (newWorkingHours > 3600) {
          while (newWorkingHours >= 3600) {
            newHours++;
            newWorkingHours -= 3600;
          }
          if (newWorkingHours > 1800) {
            newHours++;
          } else if (newWorkingHours > 0 && newWorkingHours <= 1800) {
            newHours += 0;
          }
        } else if (newWorkingHours > 1800) {
          newHours++;
        } else if (newWorkingHours > 0 && newWorkingHours <= 1800) {
          newHours += 0.5;
        }
        dailyOvertimeReward += (DailySalary / 7) * 2 * newHours;
      } else {
        dailyOvertimeReward += 0;
      }
    }
  } else if (moment(timeCheckIn).day() === 0) {
    // lembur hari minggu saja tanpa tanggal merah
    let newWorkingHours = workingHours * 3600;
    console.info('zol 2', newWorkingHours, workingHours);
    let newHours: number = 0;
    if (newWorkingHours > 3600) {
      while (newWorkingHours >= 3600) {
        newHours++;
        newWorkingHours -= 3600;
      }
    }
    if (newWorkingHours > 1800) {
      newHours += 0.5;
      console.info('new 1', newHours);
    } else if (newWorkingHours > 0 && newWorkingHours <= 1800) {
      /*  NOTE:  wahai yg ngoding ini kalau ada problem di perhitungan lembur di hari minggu yg bukan tanggal merah,
      cek lagi data ini siapa tau membantu */
      // newHours += 0.5;
    }
    console.info(`clear ${newHours} | (${DailySalary} / 7) * 2 * ${newHours}`);
    dailyOvertimeReward += (DailySalary / 7) * 2 * newHours;
  } else if (hours >= 22 && a - b > 0) {
    // setiap hari di atas pukul 10
    const over22 = calculateWorkingDays((a - b) / 1000, 1800).result / 3600;

    // console.info('hu 000', over22);
    dailyOvertimeReward += over22 * (DailySalary / 7);
    overtimeHours -= over22;

    // lembur lebih dari 1 jam
    if (overtimeHours >= 1) {
      // console.info('hu 2', overtimeHours, `${DailySalary} * (3 / 20) * 1.5)`);
      dailyOvertimeReward += DailySalary * (3 / 20) * 1.5;
    }

    if (overtimeHours < 1) {
      /*
      console.info(
        'hu 1',
        overtimeHours,
        `${DailySalary} * (3 / 20) * 1.5 * ${overtimeHours}`,
      );
*/
      dailyOvertimeReward += DailySalary * (3 / 20) * 1.5 * overtimeHours;
    }

    // lembur tengahan
    if (overtimeHours - 1 >= 0.5) {
      overtimeHours -= 1;
      /*
      console.info(
        'hu 3',
        overtimeHours,
        `${DailySalary} * (3 / 20) * 2 * ${overtimeHours}`,
      );
*/
      dailyOvertimeReward += DailySalary * (3 / 20) * 2 * overtimeHours;
    }
    // console.info('hu 4', dailyOvertimeReward);
  } else {
    // lembur di pagi hari
    let overtimeEarly = 0;
    console.info('earlyOvertime', overtimeHoursEarly);
    overtimeEarly = overtimeHoursEarly * 3600;
    let hourEarly = 0;
    if (overtimeEarly >= 3600) {
      while (overtimeEarly >= 3600) {
        overtimeEarly -= 3600;
        hourEarly++;
      }
      if (overtimeEarly > 1800) {
        hourEarly++;
      } else if (overtimeEarly > 0 && overtimeEarly <= 1800) {
        hourEarly += 0.5;
      }
      dailyOvertimeReward += (DailySalary / 7) * hourEarly;
    } else if (overtimeEarly > 0 && overtimeEarly >= 1800) {
      hourEarly += 0.5;
      dailyOvertimeReward += (DailySalary / 7) * hourEarly;
    }

    // lembur 1 jam pertama
    if (
      hours >= 8 &&
      hours <= 22 &&
      day !== 0 &&
      !sameDay &&
      overtimeHours < 1
    ) {
      dailyOvertimeReward += DailySalary * (3 / 20) * 1.5 * overtimeHours;
    }

    // lembur lebih dari 1 jam
    if (
      hours >= 8 &&
      hours <= 22 &&
      day !== 0 &&
      !sameDay &&
      overtimeHours >= 1
    ) {
      dailyOvertimeReward += DailySalary * (3 / 20) * 1.5;
    }

    // lembur tengahan
    if (
      hours >= 8 &&
      hours <= 22 &&
      day !== 0 &&
      !sameDay &&
      overtimeHours - 1 >= 0.5
    ) {
      overtimeHours -= 1;
      console.info(
        'lembur jam ke 2',
        DailySalary * (3 / 20) * 2 * overtimeHours,
        overtimeHours,
      );
      dailyOvertimeReward += DailySalary * (3 / 20) * 2 * overtimeHours;
    }
  }
  console.info('zol 3', dailyOvertimeReward, overtimeHours);
  return dailyOvertimeReward;
};
// bonus kehadiran 6 hari
export const getExtraFullOvertimeReward = (
  isNeverLateInWeek: boolean, // get from isNeverLate function with length 6
  isNeverAbsentInWeek: boolean, // get from isNeverAbsent function
) => {
  if (isNeverLateInWeek && isNeverAbsentInWeek) {
    return 3000;
  } else {
    return 0;
  }
};
// bonus kehadiran 7 hari
export const getExtraFullWeekOvertimeReward = (
  isNeverLateInSeven: boolean, // get from isNeverLate function with length 7
  isNeverAbsentInSeven: boolean, // get from isNeverAbsent function
) => {
  if (isNeverLateInSeven && isNeverAbsentInSeven) {
    return 1500;
  } else {
    return 0;
  }
};
// bonus kerja hari minggu
export const getExtraOnSunday = (currentAttendances: any) => {
  let reward = 0;
  for (const item of currentAttendances) {
    if (new Date(item).getDay() === 0) {
      reward += 2000;
    }
  }
  return reward;
};
// cek apakah terlambat dalam durasi tertentu
// export const isNeverLateNew = (
//   currentAttendances: any, // array of Js string date or timestamp of check_in attendances from db
//   currentSchedules: any, // array of Js string date or timestamp check_in schedules from db
//   durationInDays: number,
// ) => {

// }

export const isNeverLate = (
  currentAttendances: any, // array of Js string date or timestamp of check_in attendances from db
  currentSchedules: any, // array of Js string date or timestamp check_in schedules from db
  durationInDays: number,
) => {
  /*
  console.info(
    'isneverlate params',
    currentAttendances,
    currentSchedules,
    durationInDays,
  );
*/
  if (
    currentAttendances.length === 0 ||
    // currentAttendances.length !== durationInDays ||
    currentSchedules.length === 0
  ) {
    return false;
  } else {
    let counter: number = 0;
    for (const item of currentAttendances) {
      if (
        new Date(item).getHours() <=
          getHoursNumberFromStringHour(
            currentSchedules[new Date(item).getDay()].start_one,
          ) &&
        new Date(item).getDay() ===
          currentSchedules[new Date(item).getDay()].value
      ) {
        if (
          new Date(item).getHours() ===
            getHoursNumberFromStringHour(
              currentSchedules[new Date(item).getDay()].start_one,
            ) &&
          new Date(item).getMinutes() === 0
        ) {
          if (new Date(item).getSeconds() > 0) {
            counter++;
          } else {
            counter += 0;
          }
        } else if (
          new Date(item).getHours() ===
            getHoursNumberFromStringHour(
              currentSchedules[new Date(item).getDay()].start_one,
            ) &&
          new Date(item).getMinutes() !== 0
        ) {
          const timeCheckIn = currentSchedules[
            new Date(item).getDay()
          ].start_one.split(':');
          if (new Date(item).getMinutes() > Number(timeCheckIn[1])) {
            counter++;
          }
        } else {
          counter += 0;
        }
      } else {
        counter++;
      }
    }
    // return counter <= 0;
    return counter;
  }
};
export const checkForLateAndLeave = (
  currentAttendances: any,
  dayDuration: number,
) => {
  // console.info('alkjalskfjalsdj', currentAttendances);
  let counter: number = 0;
  let totalDuration: number = 0;

  for (const dayItem of currentAttendances) {
    if (counter < dayDuration) {
      if (dayItem.meta.totalLate > 0) {
        totalDuration += dayItem.meta.totalLate;
      }
      if (dayItem.meta.totalLeave > 0) {
        totalDuration += dayItem.meta.totalLeave;
      }
      counter++;
    }
  }
  // console.info('totalDurationCheck', totalDuration);
  return totalDuration === 0;
};
export const getDatesDiff = (
  start_date: any,
  end_date: any,
  date_format = 'YYYY-MM-DD',
) => {
  const getDateAsArray = (date: any) => {
    return moment(date.split(/\D+/), date_format);
  };
  const diff =
    getDateAsArray(end_date).diff(getDateAsArray(start_date), 'days') + 1;
  const dates = [];
  for (let i = 0; i < diff; i++) {
    const nextDate = getDateAsArray(start_date).add(i, 'day');
    dates.push(nextDate.format(date_format));
    // const isWeekEndDay = nextDate.isoWeekday() > 5;
    // if (!isWeekEndDay) {
    // }
  }
  return dates;
};

export const newIsNeverAbsent = (
  currentAttendances: any,
  currentSchedules: any,
  totalDays: number,
  dataHolidays: any,
  dateStart: string,
  dateEnd: string,
) => {
  let counter = 0;
  const overtime = 0;
  const totalWorkDay = [];
  let currentWorkDay = 0;
  const date: any = [];
  let hariMasukTanpaLibur: any = [];
  const hariLiburMasuk: any = [];

  const daysBetween = getDatesDiff(dateStart, dateEnd);
  hariMasukTanpaLibur = daysBetween.filter(
    (val: any) => !dataHolidays.includes(val) && moment(val).day() !== 0,
  );
  dataHolidays.split(',').forEach((el: any) => {
    const find = currentAttendances.find((item: any) => {
      return moment(item.substr(0, 10)).diff(moment(el), 'days') === 0;
    });
    if (find) {
      // counter--;
      hariLiburMasuk.push(find);
    }
  });
  if (currentAttendances.length === 0 || currentSchedules.length === 0) {
    return {
      message: 'isNeverAbsent: Wrong params',
      error: true,
    };
  } else {
    // calculate total workdays from dateStart until dateEnd
    for (const item of hariMasukTanpaLibur) {
      const find = currentSchedules.find((el: any) => {
        return el.value === moment(item).day() && el.active;
      });
      if (find) {
        totalWorkDay.push(find.value);
      } else if (moment(item).day() !== 0) {
        counter++;
      }
    }
    // for (let i = 0; i < totalDays; i++) {
    //   const find = currentSchedules.find((el: any) => {
    //     return el.value === i && el.active;
    //   });
    //   if (find) {
    //     totalWorkDay.push(find.value);
    //   } else if (i !== 0) {
    //     console.info('plus 1');
    //     counter++;
    //   }
    // }
    if (totalWorkDay.length < 1) {
      return {
        message: 'isNeverAbsent: totalWorkday = ' + totalWorkDay,
        error: true,
      };
    } else {
      for (const el of totalWorkDay) {
        // const indicator = moment(dateStart).add(el, 'd');
        const checkAttendance = currentAttendances.find((item: any) => {
          const dateAttendance = moment(item).day();
          return Number(dateAttendance) === Number(el);
        });
        // const checkOvertimeOnHoliday = holidays.find((item: any) => {
        //   const dateHoliday = moment(item);
        //   if (dateHoliday.diff(indicator, 'days') === 0) {
        //     date.push(indicator.format('YYYY-MM-DD'));
        //     return date;
        //   }
        // });
        if (checkAttendance) {
          currentWorkDay++;
        } else {
          counter++;
        }
      }
    }
    return {
      totalInputDays: totalDays,
      currentWorkDays: currentWorkDay,
      totalWorkDays: totalWorkDay,
      totalAbsent: counter,
      isNeverAbsent: counter <= 0,
      overtimeOnHoliday: overtime,
      overtimeDate: date,
    };
  }
};
export const isNeverAbsent = (
  currentAttendances: any,
  currentSchedules: any,
  dateStart: string,
  dateEnd: string,
) => {
  let counter = 0;
  let totalWorkDay = 0;
  let currentWorkDay = 0;
  const aDay = 86400000; // 24 Hour in milliseconds
  const totalDays = Math.floor(
    (new Date(dateEnd).getTime() + aDay - new Date(dateStart).getTime()) / aDay,
  );

  if (
    currentAttendances.length === 0 ||
    /*new Date(dateEnd).getTime() / aDay - new Date(dateStart).getTime() / aDay <=
      5 ||*/
    currentSchedules.length === 0
  ) {
    return {
      message:
        'isNeverAbsent: Wrong params' +
        (new Date(dateEnd).getTime() / aDay -
          new Date(dateStart).getTime() / aDay),
      error: true,
    };
  } else {
    // calculate total workdays from dateStart until dateEnd
    for (let i = 0; i < totalDays; i++) {
      if (
        currentSchedules[
          new Date(new Date(dateStart).getTime() + aDay * i).getDay()
        ].active
      ) {
        totalWorkDay++;
      }
    }
    if (totalWorkDay < 1) {
      return {
        message: 'isNeverAbsent: totalWorkday = ' + totalWorkDay,
        error: true,
      };
    } else {
      for (let i = 0; i < totalDays; i++) {
        const checkAttendance = currentAttendances.find((item: any) => {
          return (
            new Date(item).getFullYear() ===
              new Date(
                new Date(dateStart).getTime() + i * aDay,
              ).getFullYear() &&
            new Date(item).getMonth() ===
              new Date(new Date(dateStart).getTime() + i * aDay).getMonth() &&
            new Date(item).getDate() ===
              new Date(new Date(dateStart).getTime() + i * aDay).getDate()
          );
        });
        if (checkAttendance) {
          currentWorkDay++;
        } else {
          counter++;
        }
      }
    }
    return {
      totalInputDays: totalDays,
      currentWorkDays: currentWorkDay,
      totalWorkDays: totalWorkDay,
      totalAbsent: counter,
      isNeverAbsent: counter <= 0,
    };
  }
};
export const getHoursNumberFromStringHour = (
  hours: string, // HH:mm
) => {
  return new Date('2020-01-01T' + hours + ':00').getHours();
};

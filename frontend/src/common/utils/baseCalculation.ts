import moment from 'moment';

// Gaji Pokok
export const calculateUMRDaily = (
  payslip_filter: number,
  umrMonthly: number,
) => {
  switch (payslip_filter) {
    case 1:
      return umrMonthly / 25;
      break;
    case 2:
      return umrMonthly;
      break;
    default:
      return 0;
  }
};

// Durasi / Lama Kerja
export function calculateWorkDuration(
  date_entry: Date,
  date_now: Date = new Date(),
  unit: string = 'days',
  decimalResult: boolean = true,
) {
  if (unit === 'years') {
    return moment(date_now).diff(date_entry, 'years', decimalResult);
  } else if (unit === 'months') {
    return moment(date_now).diff(date_entry, 'months', decimalResult);
  } else {
    return moment(date_now).diff(date_entry, 'days', decimalResult);
  }
}

// Bonus berdasarkan Lama Kerja
export function calculateWorkDurationBonus(
  date_entry: Date,
  date_now: Date = new Date(),
  decimalResult: boolean = true,
) {
  const durationInYears = calculateWorkDuration(
    date_entry,
    date_now,
    'years',
    decimalResult,
  );
  if (durationInYears >= 0 && durationInYears <= 10) {
    return 50;
  } else if (durationInYears > 10 && durationInYears <= 20) {
    return 100;
  } else {
    return 150;
  }
}

// deteksi checkin check out
export function detectEntries(
  entries: string[], // 2019-11-10 08:00
  schedules: {
    time_check_in: string; // 08:00
    time_check_out: string;
    time_break_start: string;
    time_break_end: string;
    is_break_flexible: boolean;
  },
): any {
  if (entries.length % 2 === 1) {
    return false;
  } else if (entries.length === 0) {
    return false;
    /* TODO: handle 2 entries only
    else if(entries.length === 2){
    return {
      couple_entries_work: newEntries,
      couple_entries_break: newEntriesBreakLeave,
      break_leave_candidates: breakLeaveCandidates,
      time_check_in : new Date(
        entries[0].substr(0, 10) + ' ' + schedules.time_check_in,
      ),
      time_check_out : new Date(
        entries[1].substr(0, 10) + ' ' + schedules.time_check_in,
      ),
      time_break_start : ,
      time_break_end : ,
    };
  } */
  } else {
    // detect couplentries: any[], schedules: anye of entries
    const newEntries: any[] = [];
    const newEntriesBreakLeave: any[] = [];
    const newSchedules = {
      ...schedules,
      time_check_in: new Date(
        entries[0].substr(0, 10) + ' ' + schedules.time_check_in,
      ),
      time_check_out: new Date(
        entries[0].substr(0, 10) + ' ' + schedules.time_check_out,
      ),
      time_break_start: new Date(
        entries[0].substr(0, 10) + ' ' + schedules.time_break_start,
      ),
      time_break_end: new Date(
        entries[0].substr(0, 10) + ' ' + schedules.time_break_end,
      ),
    };
    let indexNewEntries = 0;
    let indexNewEntriesBreak = 0;
    const time_check_in = new Date(entries[0]);
    const time_check_out = new Date(entries[entries.length - 1]);
    let time_break_start = null;
    let time_break_end = null;
    for (const index in entries) {
      if (entries[index]) {
        // couple check_in & check_out (work)
        if (Number(index) % 2 === 0) {
          newEntries.push({
            check_in: new Date(entries[index]),
            check_out: null,
          });
        } else {
          newEntries[indexNewEntries] = {
            ...newEntries[indexNewEntries],
            check_out: new Date(entries[index]),
          };
          newEntries[indexNewEntries] = {
            ...newEntries[indexNewEntries],
            duration:
              newEntries[indexNewEntries].check_out.getTime() -
              newEntries[indexNewEntries].check_in.getTime(),
          };
          indexNewEntries++;
        }

        // couple check_out & check_in (leave/break)
        if (Number(index) === 0) {
          newEntriesBreakLeave.push({
            start: null,
            end: new Date(entries[index]),
          });
          indexNewEntriesBreak++;
        } else if (Number(index) % 2 === 1) {
          newEntriesBreakLeave[indexNewEntriesBreak] = {
            start: new Date(entries[index]),
            end: null,
          };
        } else if (Number(index) % 2 === 0) {
          newEntriesBreakLeave[indexNewEntriesBreak] = {
            ...newEntriesBreakLeave[indexNewEntriesBreak],
            end: new Date(entries[index]),
          };
          newEntriesBreakLeave[indexNewEntriesBreak] = {
            ...newEntriesBreakLeave[indexNewEntriesBreak],
            duration:
              newEntriesBreakLeave[indexNewEntriesBreak].end.getTime() -
              newEntriesBreakLeave[indexNewEntriesBreak].start.getTime(),
          };
          indexNewEntriesBreak++;
        }
      }
    }

    const breakLeaveCandidates = detectBreakCandidates(
      newEntriesBreakLeave,
      newSchedules,
    );

    time_break_start = breakLeaveCandidates[0].start;
    time_break_end = breakLeaveCandidates[0].end;
    return {
      couple_entries_work: newEntries,
      couple_entries_break: newEntriesBreakLeave,
      break_leave_candidates: breakLeaveCandidates,
      time_check_in,
      time_check_out,
      time_break_start,
      time_break_end,
    };
  }
}

export function detectBreakCandidates(entries: any[], schedules: any) {
  const breakLeaveCandidates = [];
  const maxBreakDuration =
    schedules.time_break_end.getTime() - schedules.time_break_start.getTime();
  for (const data of entries) {
    if (data.start && data.end) {
      const diffStart =
        data.start.getTime() - schedules.time_break_start.getTime();
      const diffEnd = data.end.getTime() - schedules.time_break_end.getTime();
      breakLeaveCandidates.push({
        ...data,
        diffStart: diffStart >= 0 ? diffStart : -1 * diffStart,
        diffEnd: diffEnd >= 0 ? diffEnd : -1 * diffEnd,
      });
    }
  }
  if (schedules.is_break_flexible) {
    breakLeaveCandidates.sort((a, b) => {
      return a.duration - b.duration - maxBreakDuration;
    });
  } else {
    breakLeaveCandidates.sort((a, b) => {
      return a.diffStart + a.diffEnd - (b.diffStart + b.diffEnd);
    });
  }
  return breakLeaveCandidates;
}

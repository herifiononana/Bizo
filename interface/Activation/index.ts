// export interface Activation {
//   activationDate: number; // timestamp
//   nextResetDate: number; // timestamp
// }
export interface Activation {
  activationDate: number;
  lastRunTimestamp: number;
  daysUsed: number;
}

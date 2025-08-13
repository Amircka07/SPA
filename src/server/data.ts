import type { User } from "./types";

const firstNames = ["John","Jane","Alex","Sam","Emily","Michael","Sara","David","Chris","Anna","Ivan","Amir","Aida","Chen","Maria"];
const lastNames  = ["Smith","Johnson","Lee","Khan","Ivanov","Garcia","Sato","Brown","Williams","Miller","Davis","Wilson"];
const countries  = ["USA","Canada","Kyrgyzstan","Kazakhstan","Germany","UK","France","Japan","Brazil","India"];

const pick = <T>(arr: T[]) => arr[Math.floor(Math.random()*arr.length)];
const randomDate = (start: Date, end: Date) =>
  new Date(start.getTime() + Math.random()*(end.getTime()-start.getTime()));

export const users: User[] = Array.from({length: 500}).map((_, i) => {
  const first = pick(firstNames);
  const last  = pick(lastNames);
  const name  = `${first} ${last}`;
  const email = `${first.toLowerCase()}.${last.toLowerCase()}${i}@example.com`;
  const country = pick(countries);
  const registeredAt = randomDate(new Date(2020,0,1), new Date()).toISOString();
  return { id: String(i+1), name, email, country, registeredAt };
});

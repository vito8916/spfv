import { redirect } from "next/navigation";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string,
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

export function capitalizeFullName(fullName: string | undefined): string {
  if (!fullName) return '';
  return fullName.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
}

export function isFriday(date: Date): boolean {
  const dayOfWeek = date.getDay();
  return dayOfWeek === 5; // 5 is Friday
}

//is market open - a function to know if the market is open in the US 
export function isMarketOpen(): boolean {
  
  const date = new Date();
  const nyTime = new Date(
    date.toLocaleString("en-US", { timeZone: "America/New_York" })
  );

  const day = nyTime.getDay(); // 0 = Sunday, 6 = Saturday
  const hours = nyTime.getHours();
  const minutes = nyTime.getMinutes();

  // Verifica si es sábado o domingo
  if (day === 0 || day === 6) return false;


  // Verifica si está dentro del horario de mercado (9:30am - 4:00pm ET)
  if (
    (hours > 9 || (hours === 9 && minutes >= 30)) &&
    (hours < 16)
  ) {
    return true;
  }

  if (day === 4) {
    return true;
  }

  return false;
}

//get the fridays that are bank holidays in the US from 2024 to 2028
/* export function getFridaysThatAreBankHolidays(year: number): Date[] {
  const fridays = [];
  for (let i = 0; i < 5; i++) {
    const date = new Date(year, 0, 1);
    date.setDate(date.getDate() + i);
    if (isFriday(date) && !isBankHoliday(date)) {
      fridays.push(date);
    }
  }
  return fridays;
} */

const usBankHolidays = [
  // new york time zone
    new Date('2025-01-01').toLocaleString("en-US", { timeZone: "America/New_York" }), // New Year's Day
    new Date('2025-01-16').toLocaleString("en-US", { timeZone: "America/New_York" }), // Martin Luther King Jr. Day
    new Date('2025-02-17').toLocaleString("en-US", { timeZone: "America/New_York" }), // Presidents Day
    new Date('2025-03-17').toLocaleString("en-US", { timeZone: "America/New_York" }), // St. Patrick's Day
    new Date('2025-04-18').toLocaleString("en-US", { timeZone: "America/New_York" }), // Good Friday
    new Date('2025-05-26').toLocaleString("en-US", { timeZone: "America/New_York" }), // Memorial Day
    new Date('2025-07-04').toLocaleString("en-US", { timeZone: "America/New_York" }), // Independence Day
    new Date('2025-09-01').toLocaleString("en-US", { timeZone: "America/New_York" }), // Labor Day
    new Date('2025-10-13').toLocaleString("en-US", { timeZone: "America/New_York" }), // Columbus Day
    new Date('2025-11-11').toLocaleString("en-US", { timeZone: "America/New_York" }), // Veterans Day
    new Date('2025-11-27').toLocaleString("en-US", { timeZone: "America/New_York" }), // Thanksgiving Day
    new Date('2025-12-25').toLocaleString("en-US", { timeZone: "America/New_York" }), // Christmas Day
  ];


// Function to check if a date is a bank holiday
export function bankHoliday(date: Date): boolean {
  const dateString = date.toLocaleString("en-US", { timeZone: "America/New_York" });
  const isBankHoliday = usBankHolidays.some((holiday: string) => 
    holiday === dateString
  );
  return isBankHoliday;
}
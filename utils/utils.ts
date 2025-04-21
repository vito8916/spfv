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

  // Check if it's a bank holiday
  //if (bankHoliday(nyTime)) return false;

  // Verifica si está dentro del horario de mercado (9:30am - 4:00pm ET)
  if (
    (hours > 9 || (hours === 9 && minutes >= 30)) &&
    (hours < 16)
  ) {
    return true;
  }

  if(day === 1) {
    return true;
  }

  return false;
}

const usBankHolidays = [
  // new york time zone
    new Date(2025, 0, 1), // New Year's Day
    new Date(2025, 0, 16), // Martin Luther King Jr. Day
    new Date(2025, 1, 17), // Presidents Day
    new Date(2025, 2, 17), // St. Patrick's Day
    new Date(2025, 3, 18), // Good Friday
    new Date(2025, 4, 26), // Memorial Day
    new Date(2025, 6, 4), // Independence Day
    new Date(2025, 8, 1), // Labor Day
    new Date(2025, 9, 13), // Columbus Day
    new Date(2025, 10, 11), // Veterans Day
    new Date(2025, 11, 27), // Thanksgiving Day
    new Date(2025, 11, 25), // Christmas Day
  ];


// Function to check if a date is a bank holiday
export function bankHoliday(date: Date): boolean {
  const dateString = date.toLocaleString("en-US", { timeZone: "America/New_York" });
  const isBankHoliday = usBankHolidays.some((holiday: Date) => 
    holiday.toLocaleString("en-US", { timeZone: "America/New_York" }) === dateString
  );
  return isBankHoliday;
}
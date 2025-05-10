export const formatDateString = (inputDateString) => {
  const startDate = new Date(inputDateString);

  // Options for formatting
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };

  // Format the date to a string
  const formattedDate = startDate?.toLocaleString("en-US", options);

  return formattedDate;
};

export const formatDate = (inputDateString) => {
  const date = new Date(inputDateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  // return
  let formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
};

export function formatDateandTime(timestamp) {
  if (!timestamp || isNaN(new Date(timestamp).getTime())) {
    return "N/A";
  }
  const createdAt = new Date(timestamp);

  const year = createdAt.getFullYear();
  const month = String(createdAt.getMonth() + 1).padStart(2, "0");
  const day = String(createdAt.getDate()).padStart(2, "0");
  const hours = String(createdAt.getHours() % 12 || 12).padStart(2, "0");
  const minutes = String(createdAt.getMinutes()).padStart(2, "0");
  const ampm = createdAt.getHours() >= 12 ? "pm" : "am";

  return `${year}/${month}/${day} -- ${hours}:${minutes} ${ampm}`;
}

export function ReturnSeprateDateAndTime(
  timestamp,
  daysToAdd = 0,
  setTimeTo = { hours: 9, minutes: 0 }
) {
  // Convert timestamp to Date object
  const dateObj = new Date(timestamp);

  // Add specified number of days to the date
  dateObj.setUTCDate(dateObj.getUTCDate() + daysToAdd);

  // Set the specified time
  dateObj.setUTCHours(setTimeTo.hours);
  dateObj.setUTCMinutes(setTimeTo.minutes);
  dateObj.setUTCSeconds(0);
  dateObj.setUTCMilliseconds(0);

  // Format date
  const year = dateObj.getUTCFullYear();
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getUTCDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  // Format time
  let hours = dateObj.getUTCHours();
  const minutes = String(dateObj.getUTCMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const formattedTime = `${hours}:${minutes}${ampm}`;

  return {
    date: formattedDate,
    time: formattedTime,
  };
}

import React from "react";
import { format, isToday, isYesterday, isValid } from "date-fns";

const FormattedDate = ({ date, showTime = false, className = "" }) => {
  if (!date) return null;

  const parsedDate = new Date(date);

  if (!isValid(parsedDate)) {
    return null;
  }

  let formattedDate;

  if (isToday(parsedDate)) {
    formattedDate = showTime ? format(parsedDate, "hh:mm a") : "Today";
  } else if (isYesterday(parsedDate)) {
    formattedDate = showTime
      ? `Yesterday, ${format(parsedDate, "hh:mm a")}`
      : "Yesterday";
  } else {
    formattedDate = showTime
      ? format(parsedDate, "dd MMM yyyy, hh:mm a")
      : format(parsedDate, "dd MMM yyyy");
  }

  return <span className={className}>{formattedDate}</span>;
};

export default FormattedDate;

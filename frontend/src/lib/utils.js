import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"
import { format, formatDistanceToNow, parseISO } from "date-fns";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formateDate = (date) => {
  return formatDistanceToNow(parseISO(date), {addSuffix: true});
};

export const formatDateOfTime = (dateOfBirth) => {
  return format(new Date(dateOfBirth), "dd/MM/yyyy");
};



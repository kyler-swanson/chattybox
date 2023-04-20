import { format, isToday, isYesterday } from 'date-fns';

const formatDate = (date: Date) => {
  if (isToday(date)) {
    return `Today at ${format(date, 'h:mm a')}`;
  }

  if (isYesterday(date)) {
    return `Yesterday at ${format(date, 'h:mm a')}`;
  }

  return format(date, 'dd/MM/yyyy');
};

export { formatDate };

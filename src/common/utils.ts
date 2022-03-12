export const timeSince = (date: Date) => {
  const now = new Date();
  const parsedDate = new Date(date);
  if (date) {
    const seconds = Math.floor((now.getTime() - parsedDate.getTime()) / 1000);

    let interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + 'y';
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + 'm';
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + 'd';
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + 'h';
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + 'm';
    }
    return Math.floor(seconds) + 's';
  }
};

export const formatBytes = (bytes: number, decimals = 0) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

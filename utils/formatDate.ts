export const formatDate = (date: { seconds: number; nanoseconds?: number }) => {
  const formattedDate = new Date(date.seconds * 1000);
};

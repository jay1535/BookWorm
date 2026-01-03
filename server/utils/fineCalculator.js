export const calculateFine = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);

  if (isNaN(due.getTime())) return 0;

  const finePerDay = 5;  

  if (due < today) {
    const daysLate = Math.ceil(
      (today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)
    );

    return Number((daysLate * finePerDay).toFixed(2));
  }

  return 0;
};

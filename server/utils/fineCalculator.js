export const calculateFine = (dueDate) => {
  const today = new Date();
  const finePerHour = 0.1; // Fine amount per day
  if(dueDate < today){
    const letHours = Math.ceil((today-dueDate) / (1000 * 60 * 60 * 24));
    const fine = letHours * finePerHour;
    return fine;
  }
    return 0;
};

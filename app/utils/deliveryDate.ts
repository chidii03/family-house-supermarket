export const getDeliveryEstimates = () => {
  const now = new Date();

  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "numeric",
    month: "short",
  };

  // Supermarket opens every day
  // Same-day delivery cutoff: 9:00 PM
  const CLOSING_HOUR = 21;

  // Next cutoff time
  const deadline = new Date(now);
  deadline.setHours(CLOSING_HOUR, 0, 0, 0);

  // If past today's cutoff, countdown should be until tomorrow's cutoff
  if (now > deadline) {
    deadline.setDate(deadline.getDate() + 1);
  }

  // Delivery date
  const deliveryDate = new Date(now);

  // After closing, delivery becomes tomorrow
  if (now.getHours() >= CLOSING_HOUR) {
    deliveryDate.setDate(deliveryDate.getDate() + 1);
  }

  // Countdown until cutoff
  const diff = deadline.getTime() - now.getTime();

  const countdownHours = Math.floor(diff / (1000 * 60 * 60));

  const countdownMins = Math.floor(
    (diff % (1000 * 60 * 60)) / (1000 * 60)
  );

  return {
    // Example: Thu 30 Jul
    deliveryDate: deliveryDate.toLocaleDateString("en-GB", options),
    fastestDelivery:
      now.getHours() >= CLOSING_HOUR
        ? "40 mins - 1 hour"
        : "40 mins - 1 hour",

    isSameDayAvailable: now.getHours() < CLOSING_HOUR,

    // Countdown for:
    // Order within 16 hrs 47 mins
    countdown: `${countdownHours} hrs ${countdownMins} mins`,

    countdownHours,
    countdownMins,
  };
};
export function getDaysAgo(date: string | Date) {

    const now = new Date();

    const jobDate = new Date(date);

    const diffInMs = now.getTime() - jobDate.getTime();

    const diffInDays = Math.floor(
        diffInMs / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) {
        return "Hoje";
    }

    if (diffInDays === 1) {
        return "1d";
    }

    return `${diffInDays}d`;
}
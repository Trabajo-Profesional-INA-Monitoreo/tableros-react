export const dayjsToDate = (date) => {
    return date.toDate();
}

export const dayjsToString = (date) => {
    return date.format('YYYY-MM-DD')
}

export const formatMinutes = (minutes) => {
    const minutesPerHour = 60;
    const minutesPerDay = 1440;

    const days = Math.floor(minutes / minutesPerDay);
    minutes %= minutesPerDay;
    const hours = Math.floor(minutes / minutesPerHour);
    const remainingMinutes = minutes % minutesPerHour;

    var formatedMinutes = '';
    if (days > 0)
        formatedMinutes = (days === 1) ? `1 día` : `${days} días`;
    if (hours > 0){
        formatedMinutes += days > 0 ? ' y ' : ''
        formatedMinutes += (hours === 1) ? `1 hora` : `${hours} horas`;
    }
    if (remainingMinutes > 0 || formatedMinutes === '') {
        formatedMinutes += hours > 0 ? ' y ' : ''
        formatedMinutes += `${remainingMinutes} minutos`;
    }
    
    return formatedMinutes;
}
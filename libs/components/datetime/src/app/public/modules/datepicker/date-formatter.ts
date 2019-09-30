const moment = require('moment');

export class SkyDateFormatter {
  public format(date: Date, format: string): string {
    return moment(date.getTime()).format(format);
  }

  public getDateFromString(dateString: string, format: string): Date {
    let momentValue = moment(dateString, format);

    if (!momentValue.isValid()) {
      momentValue = moment(dateString, 'YYYY-MM-DDThh:mm:ss.sssZ');
    }

    return momentValue.toDate();
  }

  public dateIsValid(date: Date): boolean {
    return (
      date &&
      !isNaN(date.valueOf()) &&
      !isNaN(new Date(date).getDate())
    );
  }
}

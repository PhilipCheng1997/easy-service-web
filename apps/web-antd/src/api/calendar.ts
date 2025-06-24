import { requestClient } from '#/api/request';

export namespace CalendarApi {
  export interface CalendarData {
    date: string;
    content: string;
    type?:
      | 'default'
      | 'error'
      | 'processing'
      | 'success'
      | 'warning'
      | undefined;
  }

  export interface ListCalendarDataRequest {
    startDate: string;
    endDate: string;
  }
}

async function listCalendarData(params: CalendarApi.ListCalendarDataRequest) {
  return requestClient.get<Array<CalendarApi.CalendarData>>('/calendar', {
    params,
  });
}

export { listCalendarData };

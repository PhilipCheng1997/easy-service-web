import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export interface HolidayData {
  date: string;
  remark?: string;
}

async function listHoliday(params: Recordable<any>) {
  return requestClient.get<Array<string>>('/holiday', { params });
}

async function importHoliday(file: File) {
  return requestClient.upload('/holiday/import', { file });
}

async function saveHoliday(data: HolidayData) {
  return requestClient.put('/holiday', data);
}

async function deleteHoliday(date: string) {
  return requestClient.delete('/holiday', { params: { date } });
}

export { deleteHoliday, importHoliday, listHoliday, saveHoliday };

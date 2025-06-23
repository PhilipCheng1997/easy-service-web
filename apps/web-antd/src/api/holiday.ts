import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

async function listHoliday(params: Recordable<any>) {
  return requestClient.get<Array<string>>('/holiday', { params });
}

async function importHoliday(file: File) {
  return requestClient.upload('/holiday/import', { file });
}

async function saveHoliday(date: string) {
  return requestClient.post('/holiday', null, { params: { holiday: date } });
}

export { importHoliday, listHoliday, saveHoliday };

import type { Recordable } from '@vben/types';

import type { UploadFileParams } from '#/api/file';

import { requestClient } from '#/api/request';

async function listHoliday(params: Recordable<any>) {
  return requestClient.get<Array<string>>('/holiday', { params });
}

async function importHoliday({
  file,
  onError,
  onProgress,
  onSuccess,
}: UploadFileParams) {
  try {
    onProgress?.({ percent: 0 });

    const data = await requestClient.upload('/holiday/import', { file });

    onProgress?.({ percent: 100 });
    onSuccess?.(data, file);
  } catch (error) {
    onError?.(error instanceof Error ? error : new Error(String(error)));
  }
}

export { importHoliday, listHoliday };

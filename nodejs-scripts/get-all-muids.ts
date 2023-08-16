import { MUID, yyyymmdd } from '../src/types.js';

/**
 * Given a specific day, get the nightly NACHA file, get all submerchantIds
 * and do the lookup to get the corresponding MUID's
 *
 * @export
 * @param {yyyymmdd} day
 * @return {*}  {Promise<MUID[]>}
 */
export async function getAllMuids(day: yyyymmdd): Promise<MUID[]> {
  return Promise.resolve([]);
}

function getNachaFileContentForTheDay(day: yyyymmdd): Promise<string> {
  return Promise.resolve('');
}

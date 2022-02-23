import { FileDocument, FileResult } from '../../common/dataModels';
import logger from '../logger';

const log = logger('database-utils');

const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);

export const getContext = (query: string, contents: string) => {
  const maxDistance = 10;

  const indexOfQuery = contents.indexOf(query);
  if (indexOfQuery !== -1) {
    const firstIndex = indexOfQuery - maxDistance;
    const lastIndex = indexOfQuery + query.length + maxDistance;

    const clampedStart = clamp(firstIndex, 0, contents.length);
    const clampedEnd = clamp(lastIndex, lastIndex, contents.length);

    const context = contents.substring(clampedStart, clampedEnd);
    return context;
  } else {
    return '';
  }
};

export const postProcessResults = (query: string, results: FileDocument[]) => {
  log.info(`post processing ${results.length} results for query ${query}`);

  const fileResults = results.map((res) => {
    let fileResult: FileResult = {
      id: res._id.toString(),
      root: res.root,
      path: res.path,
      context: getContext(query, res.contents || ''),
    };
    return fileResult;
  });

  return fileResults;
};

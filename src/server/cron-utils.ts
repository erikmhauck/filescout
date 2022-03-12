import cron from 'node-cron';
import logger from './logger';
import { readFileSync } from 'fs';
import path from 'path';
import { executeWorkerAction } from './worker-interface';
import { RootDocument } from '../common/dataModels';
const log = logger('cron');

const configRoot = process.env.CONFIGPATH || '/config';
const defaultSchedule = '0 2 * * *';

interface ScheduleConfig {
  path: string;
  cron: string;
}

const getSchedulesFromConfig = (roots: RootDocument[]) => {
  const schedulesConfig = path.join(configRoot, 'schedules.json');
  log.info(`reading cron schedules from ${schedulesConfig}`);
  const config = JSON.parse(readFileSync(schedulesConfig, 'utf8'));
  const schedules: ScheduleConfig[] = [];
  for (let [path, value] of Object.entries(config)) {
    log.info(`${path}: ${value}`);
    if (!roots.some((root) => root.name === path)) {
      log.warn(
        `ignoring cron schedule for ${path} as it is not a mounted path`
      );
    } else {
      schedules.push({ path: path, cron: value as string });
    }
  }
  return schedules;
};

const setUpSchedules = (cronString: string, schedules: ScheduleConfig[]) => {
  log.info(`scheduling ${schedules.length} tasks to be run at ${cronString}`);
  cron.schedule(cronString, async () => {
    for (let i = 0; i < schedules.length; i += 1) {
      const schedule = schedules[i];
      log.info(`running task: ${schedule.path}`);
      await executeWorkerAction({
        action: 'scan',
        path: schedule.path,
      });
    }
  });
};

const getDefaultSchedules = async (
  roots: RootDocument[],
  schedules: ScheduleConfig[]
) => {
  const defaultSchedules = [];
  for (let i = 0; i < roots.length; i += 1) {
    const root = roots[i];
    if (!schedules.some((schedule) => root.name === schedule.path)) {
      log.info(`adding default schedule for ${root.name}`);
      defaultSchedules.push({ path: root.name, cron: defaultSchedule });
    }
  }
  return defaultSchedules;
};

const groupBy = <T>(array: T[], predicate: (v: T) => string) =>
  array.reduce((acc, value) => {
    (acc[predicate(value)] ||= []).push(value);
    return acc;
  }, {} as { [key: string]: T[] });

export const setupCron = async () => {
  const roots = (await executeWorkerAction({
    action: 'getRoot',
  })) as unknown as RootDocument[];

  // get configs from json
  const schedules = getSchedulesFromConfig(roots);
  // add default schedule for anything not in the json
  schedules.push(...(await getDefaultSchedules(roots, schedules)));
  // group the schedules by cron so we can run them in series
  const groupedSchedules = groupBy(schedules, (s) => s.cron);
  // setup the crontab
  for (let [cron, cronSchedules] of Object.entries(groupedSchedules)) {
    setUpSchedules(cron, cronSchedules);
  }
};

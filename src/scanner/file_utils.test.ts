import { getRootDirs, scanFileContents } from './file_utils';
import * as fs from 'fs';
import * as textract from 'textract';

jest.mock('fs');
const mockedfs = jest.mocked(fs, true);

jest.mock('textract');
const mockedTextract = jest.mocked(textract, true);

const getMockedDirEnt = (name: string, isDir: boolean): fs.Dirent => {
  return {
    isDirectory: () => isDir,
    name,
    isFile: jest.fn(),
    isBlockDevice: jest.fn(),
    isCharacterDevice: jest.fn(),
    isSymbolicLink: jest.fn(),
    isFIFO: jest.fn(),
    isSocket: jest.fn(),
  };
};

describe('getRootDirs', () => {
  test('returns list of directories and their name relative to the root', () => {
    const dirEnt1: fs.Dirent = getMockedDirEnt('foo1', true);
    const dirEnt2: fs.Dirent = getMockedDirEnt('foo2', true);
    const dirEnt3: fs.Dirent = getMockedDirEnt('foo3', false);
    mockedfs.readdirSync.mockReturnValue([dirEnt1, dirEnt2, dirEnt3]);
    const rootDirs = getRootDirs('foo');
    expect(rootDirs).toEqual(['foo/foo1', 'foo/foo2']);
  });
});

describe('scanFileContents', () => {
  test('returns undefined if an error is thrown by textract', async () => {
    mockedTextract.fromFileWithPath.mockImplementation((file, opts, cb) =>
      cb(new Error('foo'), 'bar')
    );
    const res = await scanFileContents('foo');
    expect(res).toBeUndefined();
  });

  test('returns resolved value from textract', async () => {
    mockedTextract.fromFileWithPath.mockImplementation((file, opts, cb) =>
      cb(undefined, 'bar')
    );
    const res = await scanFileContents('foo');
    expect(res).toBe('bar');
  });
});

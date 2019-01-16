import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as spies from 'chai-spies';
import * as vscode from 'vscode';
import { ViewColumn } from 'vscode';
import * as AdvancedNewFile from '../src/extension';
import * as proxyquire from 'proxyquire';
import * as path from 'path';
import * as fs from 'fs';
import { removeSync as removeDirSync } from 'fs-extra';
// import { cacheSelection } from '../src/extension';

chai.use(chaiAsPromised);
chai.use(spies);
const expect = chai.expect;

describe('rubyFileCreator', () => {
  let subject = rubyFileCreator(filePath);

  describe('#createFile', () => {
    const tmpDir = path.join(__dirname, 'createFileOrFolder.tmp');
    before(() => fs.mkdirSync(tmpDir));
    after(() => removeDirSync(tmpDir));

    context('file does not exist', () => {
      const newFileDescriptor = path.join(tmpDir, 'path/to/file.rb');
      afterEach(() => fs.unlinkSync(newFileDescriptor));

      it('creates a file with a Ruby class corresponding to the file name', () => {
        const expectedContents = 'class File\n\nend';

        subject.createFile();

        expect(fs.readFileSync(newFileDescriptor, { encoding: 'utf8' }))
        .to.eq(expectedContents);
      });
    });

    context('file exists', () => {
      const existingFileDescriptor = path.join(tmpDir, 'file.ts');
      before(() => {
        fs.appendFileSync(existingFileDescriptor, 'existing content');
      });
      after(() => fs.unlinkSync(existingFileDescriptor));

      context('default behaviour', () => {
        it('does not overwrite the file', () => {
          AdvancedNewFile.createFileOrFolder(existingFileDescriptor);

          expect(fs.readFileSync(existingFileDescriptor, { encoding: 'utf8' }))
          .to.eq('existing content');
        });
      });

      context('when the "overwrite" option is supplied', () => {
        it('overwrites the file');
      });
    });
  });
});
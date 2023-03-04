import { v4 as uuidv4 } from 'uuid';

const publicPath = './public';
let path = publicPath;

export class HelperFileLoader {
  set(_path: string) {
    path = publicPath + _path;
  }

  public customFileName(req, file, cb) {
    const originalName = file.originalname.split('.');
    const fileExtention = originalName[originalName.length - 1];

    cb(null, `${uuidv4()}.${fileExtention}`);
  }

  public destinationPath(req, file, cb) {
    cb(null, path);
  }
}
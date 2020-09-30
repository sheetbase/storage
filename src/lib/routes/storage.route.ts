import {RouteResponse} from '@sheetbase/server';

import {
  UploadFile,
  RenamePolicy,
  FileSharing,
  UploadResource,
  FileUpdateData,
} from '../types';
import {StorageService} from '../services/storage.service';

export class StorageRoute {
  endpoint = '/storage';

  disabled = ['post', 'put', 'delete'];

  errors = {
    'storage/no-file': 'File not found (no VIEW permission or trashed).',
    'storage/no-edit': 'No EDIT permission.',
    'storage/invalid-upload': 'Invalid upload resource.',
    'storage/invalid-size': 'The file is too big.',
    'storage/invalid-type': 'The file format is not supported.',
  };

  constructor(private storageService: StorageService) {}

  /**
   * Get file information
   * @param query.id - The file id
   */
  get(req: {
    query: {
      id: string;
    };
  }) {
    return this.storageService.getFileInfoById(req.query.id);
  }

  /**
   * upload a file / multiple files
   */
  put(req: {
    body: {
      file?: UploadFile;
      folder?: string;
      rename?: RenamePolicy;
      share?: FileSharing;
      files?: UploadResource[];
    };
  }) {
    const {
      // single file
      file: fileData,
      folder: customFolder,
      rename: renamePolicy,
      share: sharing,
      // multiple files
      files: uploadResources,
    } = req.body;
    return (() => {
      if (!!fileData && !uploadResources) {
        // single file
        const file = this.storageService.uploadFile(
          fileData,
          customFolder,
          renamePolicy,
          sharing
        );
        return this.storageService.getFileInfo(file);
      } else if (!!uploadResources && uploadResources.length <= 30) {
        // multiple files
        const files = this.storageService.uploadFiles(uploadResources);
        return this.storageService.getFilesInfo(files);
      } else {
        throw new Error('storage/invalid-upload');
      }
    })();
  }

  /**
   * update a file
   */
  post(
    req: {
      body: {
        id: string;
        update: FileUpdateData;
      };
    },
    res: RouteResponse
  ) {
    const {id, update} = req.body;
    this.storageService.updateFile(id, update);
    return res.done();
  }

  /**
   * delete a file
   */
  delete(
    req: {
      body: {
        id: string;
      };
    },
    res: RouteResponse
  ) {
    this.storageService.removeFile(req.body.id);
    return res.done();
  }
}

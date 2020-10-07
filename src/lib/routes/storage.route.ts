import {
  UploadFile,
  RenamePolicy,
  FileSharing,
  UploadResource,
  FileUpdateData,
  AuthData,
} from '../types/storage.type';
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
    data: {
      auth?: AuthData;
    };
  }) {
    return this.storageService.getFileInfoById(
      req.query.id,
      req.data.auth ? req.data.auth.sub : undefined
    );
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
    data: {
      auth?: AuthData;
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
    const authEmail = req.data.auth ? req.data.auth.sub : undefined;
    return (() => {
      if (!!fileData && !uploadResources) {
        // single file
        const file = this.storageService.uploadFile(
          fileData,
          customFolder,
          renamePolicy,
          sharing,
          authEmail
        );
        return this.storageService.getFileInfo(file);
      } else if (!!uploadResources && uploadResources.length <= 30) {
        // multiple files
        const files = this.storageService.uploadFiles(
          uploadResources,
          authEmail
        );
        return this.storageService.getFilesInfo(files);
      } else {
        throw new Error('storage/invalid-upload');
      }
    })();
  }

  /**
   * update a file
   */
  post(req: {
    body: {
      id: string;
      update: FileUpdateData;
    };
    data: {
      auth: AuthData;
    };
  }) {
    const {id, update} = req.body;
    const authEmail = req.data.auth.sub;
    this.storageService.updateFile(authEmail, id, update);
  }

  /**
   * delete a file
   */
  delete(req: {
    body: {
      id: string;
    };
    data: {
      auth: AuthData;
    };
  }) {
    const authEmail = req.data.auth.sub;
    this.storageService.removeFile(authEmail, req.body.id);
  }
}

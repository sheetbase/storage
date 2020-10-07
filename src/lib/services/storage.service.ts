import {
  UploadFile,
  UploadResource,
  FileInfo,
  RenamePolicy,
  SharingConfig,
  SharingPreset,
  FileSharing,
  FileUpdateData,
} from '../types/storage.type';
import {OptionService} from './option.service';
import {HelperService} from './helper.service';

export class StorageService {
  // for viewing the file only
  // PUBLIC: anyone
  // PRIVATE:
  // only me (the developer)
  // and the uploader (if users login with their Google email)
  private sharingPresets: {[preset: string]: SharingConfig} = {
    PUBLIC: {access: 'ANYONE_WITH_LINK', permission: 'VIEW'},
    PRIVATE: {access: 'PRIVATE', permission: 'VIEW'},
  };

  constructor(
    private optionService: OptionService,
    private helperService: HelperService
  ) {}

  base64Parser(base64Value: string) {
    const [header, body] = base64Value.split(';base64,');
    const mimeType = header.replace('data:', '');
    if (!mimeType || !body) {
      throw new Error('Malform base64 data.');
    }
    const size = body.replace(/=/g, '').length * 0.75; // bytes
    return {mimeType, size, base64Body: body};
  }

  isFileInsideUploadFolder(file: GoogleAppsScript.Drive.File): boolean {
    const parentIds: string[] = [];
    const parents = file.getParents();
    while (parents.hasNext()) {
      parentIds.push(parents.next().getId());
    }
    return parentIds.indexOf(this.optionService.getOptions().uploadFolder) > -1;
  }

  isFileShared(file: GoogleAppsScript.Drive.File): boolean {
    const access = file.getSharingAccess();
    return (
      // eslint-disable-next-line no-undef
      access === DriveApp.Access.ANYONE ||
      // eslint-disable-next-line no-undef
      access === DriveApp.Access.ANYONE_WITH_LINK
    );
  }

  isValidFileType(mimeType: string) {
    const {allowTypes} = this.optionService.getOptions();
    return !allowTypes || allowTypes.indexOf(mimeType) > -1;
  }

  isValidFileSize(sizeBytes: number) {
    const {maxSize} = this.optionService.getOptions();
    const sizeMB = sizeBytes / 1000000;
    return !maxSize || maxSize === 0 || sizeMB <= maxSize;
  }

  getSharingPreset(preset: SharingPreset) {
    return this.sharingPresets[preset];
  }

  generateFileName(fileName: string, rename?: RenamePolicy) {
    const fileNameArr = fileName.split('.');
    // extract name & extension
    const ext = fileNameArr.pop();
    let name = fileNameArr.join('.');
    // rename
    if (rename) {
      if (rename === 'AUTO') {
        // eslint-disable-next-line no-undef
        name = Utilities.getUuid();
      }
      if (rename === 'HASH') {
        name = this.helperService.md5(fileName);
      }
    }
    return name + '.' + ext;
  }

  buildFileUrl(id: string) {
    const {urlBuilder} = this.optionService.getOptions();
    const builder =
      urlBuilder instanceof Array
        ? (id: string) => urlBuilder[0] + id + (urlBuilder[1] || '')
        : (urlBuilder as Function);
    return builder(id);
  }

  getFileInfo(file: GoogleAppsScript.Drive.File): FileInfo {
    const fileId = file.getId();
    const name = file.getName();
    const mimeType = file.getMimeType();
    const description = file.getDescription();
    const size = file.getSize();
    const link = file.getUrl();
    const url = this.buildFileUrl(fileId);
    return {
      id: fileId,
      name,
      mimeType,
      description,
      size,
      link,
      url,
      downloadUrl: url + '&export=download',
    };
  }

  getFilesInfo(files: GoogleAppsScript.Drive.File[]): FileInfo[] {
    const info: FileInfo[] = [];
    for (let i = 0; i < files.length; i++) {
      info.push(this.getFileInfo(files[i]));
    }
    return info;
  }

  getUploadFolder() {
    const {uploadFolder} = this.optionService.getOptions();
    // eslint-disable-next-line no-undef
    return DriveApp.getFolderById(uploadFolder);
  }

  getOrCreateFolderByName(
    name: string,
    parentFolder?: GoogleAppsScript.Drive.Folder
  ) {
    let folder = parentFolder || this.getUploadFolder();
    // get all children
    const childFolders = folder.getFoldersByName(name);
    // return the first or create new one
    if (!childFolders.hasNext()) {
      folder = folder.createFolder(name);
    } else {
      folder = childFolders.next();
    }
    return folder;
  }

  createFolderByYearAndMonth(parentFolder?: GoogleAppsScript.Drive.Folder) {
    const date = new Date();
    const yearStr = '' + date.getFullYear();
    let monthStr: number | string = date.getMonth() + 1;
    monthStr = '' + (monthStr < 10 ? '0' + monthStr : monthStr);
    const folder = this.getOrCreateFolderByName(yearStr, parentFolder);
    return this.getOrCreateFolderByName(monthStr, folder);
  }

  createFileFromBase64Body(
    parentFolder: GoogleAppsScript.Drive.Folder,
    fileName: string,
    mimeType: string,
    base64Body: string
  ) {
    // eslint-disable-next-line no-undef
    const data = Utilities.base64Decode(base64Body, Utilities.Charset.UTF_8);
    // eslint-disable-next-line no-undef
    const blob = Utilities.newBlob(data, mimeType, fileName);
    return parentFolder.createFile(blob);
  }

  setFileSharing(
    file: GoogleAppsScript.Drive.File,
    sharing: FileSharing = 'PRIVATE'
  ) {
    const {access = 'PRIVATE', permission = 'VIEW'} =
      typeof sharing === 'string' ? this.getSharingPreset(sharing) : sharing;
    return file.setSharing(
      // eslint-disable-next-line no-undef
      (DriveApp.Access[
        (access.toUpperCase() as unknown) as number
      ] as unknown) as GoogleAppsScript.Drive.Access,
      // eslint-disable-next-line no-undef
      (DriveApp.Permission[
        (permission.toUpperCase() as unknown) as number
      ] as unknown) as GoogleAppsScript.Drive.Permission
    );
  }

  setEditPermissionForUser(
    authEmail: string,
    file: GoogleAppsScript.Drive.File
  ) {
    file.addEditors([authEmail]);
    return file;
  }

  hasEditPermission(authEmail: string, file: GoogleAppsScript.Drive.File) {
    // eslint-disable-next-line no-undef
    return file.getAccess(authEmail) === DriveApp.Permission.EDIT;
  }

  hasViewPermission(file: GoogleAppsScript.Drive.File, authEmail?: string) {
    return (
      this.isFileShared(file) || // shared publicly
      (authEmail ? this.hasEditPermission(authEmail, file) : false) // for logged in user
    );
  }

  getFileById(id: string, authEmail?: string) {
    // eslint-disable-next-line no-undef
    const file = DriveApp.getFileById(id);
    if (
      file.isTrashed() || // file in the trash
      !this.hasViewPermission(file, authEmail) // no view permission
    ) {
      throw new Error('storage/no-file');
    }
    return file;
  }

  getFileInfoById(id: string, authEmail?: string) {
    return this.getFileInfo(this.getFileById(id, authEmail));
  }

  uploadFile(
    fileData: UploadFile,
    customFolder?: string,
    renamePolicy?: RenamePolicy,
    sharing: FileSharing = 'PRIVATE',
    authEmail?: string
  ) {
    // check input data
    if (!fileData || !fileData.base64Value || !fileData.name) {
      throw new Error('storage/invalid-upload');
    }

    // retrieve data
    const {name, base64Value} = fileData;
    const {mimeType, size, base64Body} = this.base64Parser(base64Value);

    // check input file
    if (!this.isValidFileType(mimeType)) {
      throw new Error('storage/invalid-type');
    }
    if (!this.isValidFileSize(size)) {
      throw new Error('storage/invalid-size');
    }

    // get the upload folder
    let folder = this.getUploadFolder();
    if (customFolder) {
      folder = this.getOrCreateFolderByName(customFolder, folder);
    } else if (this.optionService.getOptions().nested) {
      folder = this.createFolderByYearAndMonth(folder);
    }

    // save the file
    const fileName = this.generateFileName(name, renamePolicy);
    const file = this.createFileFromBase64Body(
      folder,
      fileName,
      mimeType,
      base64Body
    );
    // set sharing
    this.setFileSharing(file, sharing);
    // set edit security
    if (authEmail) {
      this.setEditPermissionForUser(authEmail, file);
    }

    // return
    return file;
  }

  uploadFiles(uploadResources: UploadResource[], authEmail?: string) {
    const files: GoogleAppsScript.Drive.File[] = [];
    for (let i = 0; i < uploadResources.length; i++) {
      // upload a file
      const {
        file: fileData,
        folder: customFolder,
        rename: renamePolicy,
        share: sharing,
      } = uploadResources[i];
      const file = this.uploadFile(
        fileData,
        customFolder,
        renamePolicy,
        sharing,
        authEmail
      );
      // save to return
      files.push(file);
    }
    return files;
  }

  updateFile(authEmail: string, id: string, data: FileUpdateData = {}) {
    let file = this.getFileById(id, authEmail);
    if (!this.hasEditPermission(authEmail, file)) {
      throw new Error('storage/no-edit');
    }
    // update data
    const {name, description, content, sharing} = data;
    if (name) {
      file.setName(name);
    }
    if (description) {
      file.setDescription(description);
    }
    if (content) {
      file.setContent(content);
    }
    if (sharing) {
      file = this.setFileSharing(file, sharing);
    }
    return file;
  }

  removeFile(authEmail: string, id: string) {
    const file = this.getFileById(id, authEmail);
    if (!this.hasEditPermission(authEmail, file)) {
      throw new Error('storage/no-edit');
    }
    return file.setTrashed(true);
  }
}

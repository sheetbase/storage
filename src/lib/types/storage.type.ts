export interface Options extends Extendable {
  uploadFolder: string; // the upload folder id
}

export interface Extendable {
  allowTypes?: string[]; // mimetype list
  maxSize?: number; // MB = 1,000,000 bytes
  nested?: boolean; // structured by: <year>/<month>
  urlBuilder?: string[] | {(id: string): string}; // customize the response url
}

export interface AuthData {
  uid: string;
  sub: string;
  tty: 'ID';
  isAdmin: boolean;
}

export interface UploadFile {
  name: string;
  base64Value: string;
}

export interface UploadResource {
  file: UploadFile;
  folder?: string;
  rename?: RenamePolicy;
  share?: FileSharing;
}

export interface FileInfo {
  id: string;
  name: string;
  mimeType: string;
  description: string;
  size: number;
  link: string;
  url: string;
  downloadUrl: string;
}

export type RenamePolicy = 'AUTO' | 'HASH';

export type FileSharing = SharingPreset | SharingConfig;
export type SharingPreset = 'PUBLIC' | 'PRIVATE';
export interface SharingConfig {
  access?: string;
  permission?: string;
}

export interface FileUpdateData {
  name?: string;
  description?: string;
  sharing?: FileSharing;
  content?: string; // text file only
}

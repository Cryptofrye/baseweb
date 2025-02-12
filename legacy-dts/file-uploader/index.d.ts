import * as React from 'react';
import { StyletronComponent } from 'styletron-react';
import { Override } from '../overrides';

export interface FileUploaderOverrides<T> {
  Root?: Override<T>;
  FileDragAndDrop?: Override<T>;
  ContentMessage?: Override<T>;
  ContentSeparator?: Override<T>;
  HiddenInput?: Override<T>;
  ProgressMessage?: Override<T>;
  ErrorMessage?: Override<T>;
  ButtonComponent?: Override<T>;
  Spinner?: Override<T>;
}

export interface StyleProps {
  $afterFileDrop: boolean;
  $isDisabled: boolean;
  $isDragActive: boolean;
  $isDragAccept: boolean;
  $isDragReject: boolean;
  $isFocused: boolean;
}

export type DropFilesEventHandler = (
  accepted: File[],
  rejected: File[],
  event: React.SyntheticEvent<HTMLElement>
) => any;

export type DropFileEventHandler = (
  acceptedOrRejected: File[],
  event: React.SyntheticEvent<HTMLElement>
) => any;

export type GetDataTransferItems = (
  event: React.SyntheticEvent<any>
) => Promise<Array<File | DataTransferItem>>;

export interface FileUploaderProps {
  accept?: string | string[];
  disableClick?: boolean;
  disabled?: boolean;
  getDataTransferItems?: GetDataTransferItems;
  maxSize?: number;
  minSize?: number;
  multiple?: boolean;
  name?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => any;
  onFocus?: (event: React.FocusEvent<HTMLElement>) => any;
  onBlur?: (event: React.FocusEvent<HTMLElement>) => any;
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => any;
  onDragStart?: (event: React.DragEvent<HTMLElement>) => any;
  onDragEnter?: (event: React.DragEvent<HTMLElement>) => any;
  onDragOver?: (event: React.DragEvent<HTMLElement>) => any;
  onDragLeave?: (event: React.DragEvent<HTMLElement>) => any;
  onDrop?: DropFilesEventHandler;
  onDropAccepted?: DropFileEventHandler;
  onDropRejected?: DropFileEventHandler;
  onFileDialogCancel?: () => any;
  preventDropOnDocument?: boolean;
  errorMessage?: string;
  onCancel?: () => any;
  onRetry?: () => any;
  overrides?: FileUploaderOverrides<StyleProps>;
  progressAmount?: number;
  progressMessage?: string;
}
export declare const FileUploader: React.FC<FileUploaderProps>;

export declare const StyledRoot: StyletronComponent<any, any>;
export declare const StyledFileDragAndDrop: StyletronComponent<any, any>;
export declare const StyledContentMessage: StyletronComponent<any, any>;
export declare const StyledErrorMessage: StyletronComponent<any, any>;
export declare const StyledHiddenInput: StyletronComponent<any, any>;

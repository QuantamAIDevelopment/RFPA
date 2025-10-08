import { apiService } from './api';

export interface FileUploadResult {
  success: boolean;
  downloadUrl?: string;
  filename?: string;
  error?: string;
}

export interface FileUploadOptions {
  onProgress?: (progress: number) => void;
  onError?: (error: string) => void;
  onSuccess?: (result: FileUploadResult) => void;
}

/**
 * Handle file selection and upload
 */
export class FileUploadHandler {
  private inputElement: HTMLInputElement | null = null;
  private enableLogs = (import.meta.env.VITE_ENABLE_LOGS || '').toString().toLowerCase() === 'true' || import.meta.env.DEV;

  private log(...args: unknown[]) {
    if (this.enableLogs) {
      const ts = new Date().toISOString();
      // eslint-disable-next-line no-console
      console.log(`[fileUpload ${ts}]`, ...args);
    }
  }

  /**
   * Create and trigger file input dialog
   */
  selectFile(): Promise<File | null> {
    return new Promise((resolve) => {
      // Create file input element
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pdf';
      input.style.display = 'none';
      
      input.onchange = (event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0] || null;
        this.log('selectFile:onchange', file ? { name: file.name, size: file.size, type: file.type } : { canceled: true });
        document.body.removeChild(input);
        resolve(file);
      };

      input.oncancel = () => {
        document.body.removeChild(input);
        resolve(null);
      };

      document.body.appendChild(input);
      this.log('selectFile:openDialog');
      input.click();
    });
  }

  /**
   * Upload and process RFP file
   */
  async uploadAndProcessFile(
    file: File, 
    options: FileUploadOptions = {}
  ): Promise<FileUploadResult> {
    const { onProgress, onError, onSuccess } = options;

    try {
      // Validate file
      const validation = apiService.validateFile(file);
      if (!validation.isValid) {
        const error = validation.error || 'Invalid file';
        onError?.(error);
        this.log('uploadAndProcessFile:invalid', { error });
        return { success: false, error };
      }

      // Simulate progress (since we can't track actual upload progress with fetch)
      onProgress?.(10);
      this.log('uploadAndProcessFile:progress', { progress: 10 });

      // Process the file
      const result = await apiService.processRfp(file);
      
      onProgress?.(100);
      this.log('uploadAndProcessFile:progress', { progress: 100 });

      if (result.success && result.downloadUrl && result.filename) {
        onSuccess?.(result);
        this.log('uploadAndProcessFile:success', { filename: result.filename });
        return {
          success: true,
          downloadUrl: result.downloadUrl,
          filename: result.filename,
        };
      } else {
        const error = result.error || 'Failed to process file';
        onError?.(error);
        this.log('uploadAndProcessFile:error', { error });
        return { success: false, error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      onError?.(errorMessage);
      this.log('uploadAndProcessFile:exception', { error: errorMessage });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Complete workflow: select file, upload, and process
   */
  async selectAndProcessFile(options: FileUploadOptions = {}): Promise<FileUploadResult> {
    try {
      const file = await this.selectFile();
      
      if (!file) {
        return { success: false, error: 'No file selected' };
      }

      return await this.uploadAndProcessFile(file, options);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'File selection failed';
      options.onError?.(errorMessage);
      return { success: false, error: errorMessage };
    }
  }
}

// Export singleton instance
export const fileUploadHandler = new FileUploadHandler();
export default fileUploadHandler;

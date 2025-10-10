// API service for RFP processing
export interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface ProcessRfpResponse extends ApiResponse {
  downloadUrl?: string;
  filename?: string;
}

class ApiService {
  private baseUrl: string;
  private enableLogs: boolean;

  constructor() {
    // Use environment variable or default to localhost:8000
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://allvy-rfp-pythonservice-ang2cfbna2dahmc8.centralindia-01.azurewebsites.net';
    this.enableLogs = (import.meta.env.VITE_ENABLE_LOGS || '').toString().toLowerCase() === 'true' || import.meta.env.DEV;
  }

  private log(...args: unknown[]) {
    if (this.enableLogs) {
      const ts = new Date().toISOString();
      // eslint-disable-next-line no-console
      console.log(`[apiService ${ts}]`, ...args);
    }
  }

  /**
   * Process RFP PDF file and get Excel analysis
   * @param file - The PDF file to process
   * @returns Promise with download URL and filename
   */
  async processRfp(file: File): Promise<ProcessRfpResponse> {
    try {
      this.log('processRfp:start', { name: file.name, size: file.size, type: file.type, baseUrl: this.baseUrl });
      const formData = new FormData();
      formData.append('file', file);

  // Cross-browser timeout (defaults to 1 hour). Can be overridden with VITE_API_TIMEOUT_MS (milliseconds).
  const defaultTimeoutMs = 60 * 60 * 1000; // 1 hour
  const timeoutMs = parseInt(String(import.meta.env.VITE_API_TIMEOUT_MS || ''), 10) || defaultTimeoutMs;
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(new DOMException('Timeout', 'AbortError')), timeoutMs);

  // Allow overriding the exact process endpoint via environment variable
  const endpoint = import.meta.env.VITE_API_PROCESS_RFP_URL || `${this.baseUrl}/process-rfp/`;
      this.log('processRfp:request', { endpoint });
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let browser set it with boundary for multipart/form-data
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        this.log('processRfp:httpError', { status: response.status, errorText });
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      // Check if response is an Excel file
      const contentType = response.headers.get('content-type');
      this.log('processRfp:responseHeaders', { contentType, contentDisposition: response.headers.get('content-disposition') });
      if (contentType && contentType.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')) {
        // Handle Excel file download
        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);
        
        // Extract filename from Content-Disposition header or use default
        const contentDisposition = response.headers.get('content-disposition');
        let filename = 'rfp_analysis.xlsx';
        
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1].replace(/['"]/g, '');
          }
        }

        const result = {
          success: true,
          downloadUrl,
          filename,
        } as const;
        this.log('processRfp:success', { filename, size: blob.size });
        return result;
      } else {
        // Handle JSON response (error case)
        const data = await response.json();
        const result = {
          success: false,
          error: data.error || data.message || 'Unknown error occurred',
        } as const;
        this.log('processRfp:jsonError', result);
        return result;
      }
    } catch (error) {
      this.log('processRfp:exception', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process RFP file',
      };
    }
  }

  /**
   * Download file from blob URL
   * @param downloadUrl - The blob URL to download
   * @param filename - The filename for the download
   */
  downloadFile(downloadUrl: string, filename: string): void {
    this.log('downloadFile', { filename, downloadUrl });
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the blob URL after a short delay
    setTimeout(() => {
      URL.revokeObjectURL(downloadUrl);
    }, 1000);
  }

  /**
   * Validate file before upload
   * @param file - The file to validate
   * @returns Validation result
   */
  validateFile(file: File): { isValid: boolean; error?: string } {
    // Check file type
    if (file.type !== 'application/pdf') {
      return {
        isValid: false,
        error: 'Please upload a PDF file only.',
      };
    }

    // Check file size (limit to 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'File size must be less than 50MB.',
      };
    }

    return { isValid: true };
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;

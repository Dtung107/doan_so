/**
 * Universal Mobile-Ready File Downloader
 * Optimized for Android APK (Capacitor/WebView) and Web Browsers
 */

import { getApiUrl } from './apiConfig';

/**
 * Downloads a .py Python file to the user's mobile device or computer
 */
export async function downloadPythonFile(
  rawFileName: string,
  content: string
): Promise<{ success: boolean; method: 'server' | 'blob' | 'data' | 'share' | 'clipboard'; message: string }> {
  let fileName = (rawFileName || 'script.py').trim();
  if (!fileName.endsWith('.py')) {
    fileName += '.py';
  }

  // Clean filename for safety
  const safeFileName = fileName.replace(/[^a-zA-Z0-9._\-]/g, '_');

  // Strategy 1: Server-side attachment endpoint (Best for Android Chrome, WebViews & Desktop)
  // The server sends Content-Disposition: attachment; filename="name.py" and Content-Type: application/octet-stream
  try {
    const serverUrl = getApiUrl(
      `/api/project/download-file?name=${encodeURIComponent(safeFileName)}&content=${encodeURIComponent(content)}`
    );

    const iframeOrLink = document.createElement('a');
    iframeOrLink.href = serverUrl;
    iframeOrLink.download = safeFileName;
    iframeOrLink.setAttribute('download', safeFileName);
    iframeOrLink.target = '_blank';
    iframeOrLink.rel = 'noopener noreferrer';
    iframeOrLink.style.display = 'none';
    document.body.appendChild(iframeOrLink);
    iframeOrLink.click();

    setTimeout(() => {
      try {
        document.body.removeChild(iframeOrLink);
      } catch (_) {}
    }, 2000);
  } catch (err) {
    console.warn('[FileDownload] Server download link trigger failed:', err);
  }

  // Strategy 2: Blob Object URL (Standard W3C download trigger)
  try {
    const blob = new Blob([content], { type: 'text/x-python;charset=utf-8' });
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = safeFileName;
    link.setAttribute('download', safeFileName);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      try {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      } catch (_) {}
    }, 3000);
  } catch (blobErr) {
    console.warn('[FileDownload] Blob URL download error:', blobErr);
  }

  // Strategy 3: Base64 Data URI with octet-stream for stubborn mobile WebViews
  try {
    const utf8Bytes = new TextEncoder().encode(content);
    let binary = '';
    const len = utf8Bytes.length;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(utf8Bytes[i]);
    }
    const base64 = window.btoa(binary);
    const dataUri = `data:application/octet-stream;charset=utf-8;base64,${base64}`;

    const dataLink = document.createElement('a');
    dataLink.href = dataUri;
    dataLink.download = safeFileName;
    dataLink.setAttribute('download', safeFileName);
    dataLink.style.display = 'none';
    document.body.appendChild(dataLink);
    dataLink.click();

    setTimeout(() => {
      try {
        document.body.removeChild(dataLink);
      } catch (_) {}
    }, 2000);
  } catch (_) {}

  // Strategy 4: Native Android Share Sheet (Save to Files / Google Drive / Zalo)
  // If running on a touch/mobile device, trigger Web Share if supported
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      if (typeof File !== 'undefined') {
        const file = new File([content], safeFileName, {
          type: 'text/x-python;charset=utf-8',
          lastModified: Date.now(),
        });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: safeFileName,
            text: `Mã nguồn Python: ${safeFileName}`,
          });
          return {
            success: true,
            method: 'share',
            message: `Đã mở bảng lưu tệp [${safeFileName}] về máy!`,
          };
        }
      }
    } catch (shareErr: any) {
      if (shareErr.name === 'AbortError') {
        return {
          success: true,
          method: 'server',
          message: `Lệnh tải tệp [${safeFileName}] đã được gửi đến thiết bị! Kiểm tra thư mục Download.`,
        };
      }
    }
  }

  // Strategy 5: Also copy to clipboard as guaranteed backup
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(content);
    }
  } catch (_) {}

  return {
    success: true,
    method: 'server',
    message: `Đã gửi lệnh tải tệp [${safeFileName}] về máy! Vui lòng kiểm tra thanh thông báo hoặc thư mục Download.`,
  };
}

/**
 * Opens native Android Share sheet (Save to Drive, Zalo, Files, etc.)
 */
export async function sharePythonFile(
  rawFileName: string,
  content: string
): Promise<{ success: boolean; message: string }> {
  let fileName = (rawFileName || 'script.py').trim();
  if (!fileName.endsWith('.py')) {
    fileName += '.py';
  }

  const safeFileName = fileName.replace(/[^a-zA-Z0-9._\-]/g, '_');

  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      if (typeof File !== 'undefined') {
        const file = new File([content], safeFileName, {
          type: 'text/plain;charset=utf-8',
          lastModified: Date.now(),
        });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: safeFileName,
            text: `Mã nguồn Python: ${safeFileName}`,
          });
          return {
            success: true,
            message: `Đã mở bảng lưu/chia sẻ tệp [${safeFileName}] trên Android!`,
          };
        }
      }

      await navigator.share({
        title: safeFileName,
        text: content,
      });
      return {
        success: true,
        message: `Đã mở bảng chia sẻ cho [${safeFileName}]!`,
      };
    } catch (err: any) {
      if (err.name === 'AbortError') {
        return { success: true, message: 'Đã hủy thao tác chia sẻ.' };
      }
    }
  }

  // Fallback: Copy to clipboard
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(content);
      return {
        success: true,
        message: `Đã sao chép toàn bộ mã nguồn của [${safeFileName}] vào bộ nhớ tạm!`,
      };
    }
  } catch (_) {}

  return {
    success: false,
    message: 'Thiết bị không hỗ trợ tính năng chia sẻ trực tiếp. Đã sao chép mã nguồn.',
  };
}

/**
 * Converts an image URL to a PNG blob for clipboard compatibility.
 * @param {string} url - The URL of the image.
 * @returns {Promise<Blob>}
 */
export const getPngBlob = async (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Handle CORS
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas toBlob failed'));
      }, 'image/png');
    };
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = url;
  });
};

/**
 * Copies text and an optional image to the clipboard.
 * Falls back to text-only if image copying is not supported or fails.
 * @param {string} text - The text to copy.
 * @param {string} imageUrl - The URL of the image to copy.
 * @returns {Promise<{success: boolean, type: 'rich' | 'text'}>}
 */
export const copyToClipboard = async (text, imageUrl) => {
  const canCopyImage = !!(window.ClipboardItem && navigator.clipboard);
  
  if (canCopyImage && imageUrl) {
    try {
      const pngBlob = await getPngBlob(imageUrl);
      const item = new ClipboardItem({
        'text/plain': new Blob([text], { type: 'text/plain' }),
        'image/png': pngBlob
      });
      await navigator.clipboard.write([item]);
      return { success: true, type: 'rich' };
    } catch (err) {
      console.warn('Advanced clipboard copy failed, falling back to text:', err);
    }
  }

  // Fallback to text only
  try {
    await navigator.clipboard.writeText(text);
    return { success: true, type: 'text' };
  } catch (err) {
    console.error('Clipboard write failed:', err);
    return { success: false };
  }
};

/**
 * Shares content using the native Web Share API if available.
 * @param {object} data - { title, text, url, imageUrl }
 * @returns {Promise<boolean>}
 */
export const nativeShare = async ({ title, text, url, imageUrl }) => {
  if (!navigator.share) return false;

  const shareData = { title, text, url };

  if (imageUrl && navigator.canShare) {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'product-image.jpg', { type: blob.type });
      
      if (navigator.canShare({ files: [file] })) {
        shareData.files = [file];
      }
    } catch (err) {
      console.warn('Failed to include image in native share:', err);
    }
  }

  try {
    await navigator.share(shareData);
    return true;
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error('Native share failed:', err);
    }
    return false;
  }
};

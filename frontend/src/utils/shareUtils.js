/**
 * Converts an image URL to a PNG blob, appending the Sera logo and URL at the bottom.
 * @param {string} url - The URL of the image.
 * @param {string} linkUrl - The URL to print on the image.
 * @returns {Promise<Blob>}
 */
export const getPngBlob = async (url, linkUrl = null) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Handle CORS
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const targetSize = 800;
      canvas.width = targetSize;
      canvas.height = targetSize + 150; // extra space for text/logo at bottom

      const ctx = canvas.getContext('2d');
      
      // Fill white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw product image in center (cover logic)
      const ratio = Math.max(targetSize / img.width, targetSize / img.height);
      const newWidth = img.width * ratio;
      const newHeight = img.height * ratio;
      const x = (targetSize - newWidth) / 2;
      const y = (targetSize - newHeight) / 2;
      
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, targetSize, targetSize);
      ctx.clip();
      ctx.drawImage(img, x, y, newWidth, newHeight);
      ctx.restore();

      // Draw Logo and Text at bottom
      const logo = new Image();
      logo.onload = () => {
        const logoHeight = 50;
        const logoWidth = logo.width * (logoHeight / logo.height);
        ctx.drawImage(logo, (targetSize - logoWidth) / 2, targetSize + 25, logoWidth, logoHeight);
        
        if (linkUrl) {
          ctx.font = '500 22px sans-serif';
          ctx.fillStyle = '#6b7280'; // text-gray-500
          ctx.textAlign = 'center';
          ctx.fillText(linkUrl.replace('https://', ''), targetSize / 2, targetSize + 115);
        }

        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas toBlob failed'));
        }, 'image/png');
      };
      
      logo.onerror = () => {
        canvas.toBlob((blob) => resolve(blob), 'image/png');
      };
      logo.src = '/slogo.png'; // Make sure this matches the public folder image
    };
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = url;
  });
};

/**
 * Copies text and an optional customized image to the clipboard.
 * @param {string} text - The text to copy.
 * @param {string} imageUrl - The URL of the image to copy.
 * @param {string} linkUrl - The URL to draw on the image.
 * @returns {Promise<{success: boolean, type: 'rich' | 'text'}>}
 */
export const copyToClipboard = async (text, imageUrl, linkUrl = null) => {
  const canCopyImage = !!(window.ClipboardItem && navigator.clipboard);
  
  if (canCopyImage && imageUrl) {
    try {
      const pngBlob = await getPngBlob(imageUrl, linkUrl);
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

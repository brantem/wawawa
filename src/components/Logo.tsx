import { useState, useEffect } from 'react';

import { cn } from 'lib/helpers';

type LogoProps = Omit<React.ComponentPropsWithoutRef<'img'>, 'src'> & {
  src: string;
  title: string;
};

// The original logo is a transparent image with a fixed size, but the actual logo dimensions vary. Many images have
// significant transparent padding around the logo itself. This component trims the transparent edges to return only
// the logo content without the excess padding.
export default function Logo({ src, title, className, ...props }: LogoProps) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = async () => {
      const canvas = new OffscreenCanvas(img.width, img.height);
      const ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: true })!;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // single-pass bounding box detection to identify the non-transparent content area
      const data = ctx.getImageData(0, 0, img.width, img.height).data;
      let minX = img.width;
      let minY = img.height;
      let maxX = 0;
      let maxY = 0;

      for (let i = 3; i < data.length; i += 4) {
        if (data[i] > 0) {
          const pos = (i - 3) / 4;
          const x = pos % img.width;
          const y = Math.floor(pos / img.width);
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        }
      }

      // skip if the image is fully transparent
      if (minX > maxX) return;

      const trimmedWidth = maxX - minX + 1;
      const trimmedHeight = maxY - minY + 1;
      const trimmedCanvas = new OffscreenCanvas(trimmedWidth, trimmedHeight);
      const trimmedCtx = trimmedCanvas.getContext('2d', { alpha: true })!;
      trimmedCtx.drawImage(canvas, minX, minY, trimmedWidth, trimmedHeight, 0, 0, trimmedWidth, trimmedHeight);

      const blob = await trimmedCanvas.convertToBlob({ type: 'image/png' });
      const reader = new FileReader();
      reader.onload = () => setUrl(reader.result as string);
      reader.readAsDataURL(blob);
    };
    img.onerror = () => setUrl('MISSING');
    img.src = `${import.meta.env.VITE_PROXY_URL}/?url=${encodeURIComponent(src.replace('/logo/medium', '/logo/small'))}`;
  }, [src]);

  return url ? (
    <img
      ref={(img) => {
        if (!img) return;
        img.onload = () => img.classList.remove('opacity-0');
      }}
      src={url}
      title={title}
      className={cn('opacity-0 transition-opacity', className)}
      {...props}
      fetchPriority="high"
    />
  ) : url === 'MISSING' ? (
    <span className={cn('text-3xl font-semibold', className)}>{title}</span>
  ) : null;
}

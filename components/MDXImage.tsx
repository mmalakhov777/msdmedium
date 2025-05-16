import React from 'react';

interface MDXImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt: string;
  src: string;
  width?: number | string;
  height?: number | string;
}

const MDXImage: React.FC<MDXImageProps> = ({ alt, src, width, height, ...props }) => (
  <img
    src={src}
    alt={alt}
    loading="lazy"
    width={width}
    height={height}
    className="mdx-img"
    {...props}
  />
);

export default MDXImage; 
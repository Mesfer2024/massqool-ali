/* eslint-disable @next/next/no-img-element */
/**
 * DataUrlImg — wrapper for base64/data-URL images.
 * next/image cannot optimize data: URIs, so we use a plain <img> here.
 */
interface DataUrlImgProps {
  src: string;
  alt: string;
  className?: string;
}

export default function DataUrlImg({ src, alt, className }: DataUrlImgProps) {
  return <img src={src} alt={alt} className={className} />;
}

import Image from "next/image";

type IconImageProps = {
  src: string;
  alt?: string;
  size?: number;
  className?: string;
};

export function IconImage({ src, alt = "", size = 30, className = "" }: IconImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={`object-contain animate-pulseSoft ${className}`}
      aria-hidden={alt ? undefined : "true"}
    />
  );
}

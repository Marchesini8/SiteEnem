import Image from "next/image";

type VerifiedIconProps = {
  size?: number;
  className?: string;
};

export function VerifiedIcon({ size = 22, className = "" }: VerifiedIconProps) {
  return (
    <Image
      src="/images/verified-badge.png"
      alt=""
      width={size}
      height={size}
      className={`shrink-0 object-contain animate-pulseSoft ${className}`}
      aria-hidden="true"
    />
  );
}

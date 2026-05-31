import Image from "next/image";

type DriveIconProps = {
  size?: number;
  className?: string;
};

export function DriveIcon({ size = 28, className = "" }: DriveIconProps) {
  return (
    <Image
      src="/images/google-drive-icon.png"
      alt=""
      width={size}
      height={size}
      className={`object-contain animate-pulseSoft ${className}`}
      aria-hidden="true"
    />
  );
}

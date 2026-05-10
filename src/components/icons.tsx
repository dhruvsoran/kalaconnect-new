import type { SVGProps } from 'react';
import Image from 'next/image';

export function KalaConnectIcon(props: SVGProps<SVGSVGElement>) {
  const { className, ...rest } = props;
  return (
    <Image
      src="https://png.pngtree.com/png-vector/20240607/ourmid/pngtree-unique-logo-designs-colorful-abstract-images-modern-artistic-logos-creative-art-png-image_12575011.png"
      alt="KalaConnect Logo"
      width={props.width ? Number(props.width) : 32}
      height={props.height ? Number(props.height) : 32}
      className={className}
      // The passed props like stroke, fill etc. are for SVG, so we don't spread them to the Image component.
    />
  );
}

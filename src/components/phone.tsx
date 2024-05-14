/* eslint-disable @next/next/no-img-element */
import { HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

import Image from 'next/image';

interface PhoneProps extends HTMLAttributes<HTMLDivElement> {
	imgSrc: string;
	dark?: boolean;
	className?: string;
}

export default function Phone({ imgSrc, dark = false, className, ...props }: PhoneProps) {
	return (
		<div
			className={cn('relative pointer-events-none z-50 overflow-hidden', className)}
			{...props}
		>
			<Image
				src={dark ? '/phone-template-dark-edges.png' : '/phone-template-white-edges.png'}
				alt="phone template"
				width={896}
				height={1831}
				className="pointer-events-none z-50 select-none"
			/>

			<div className="absolute -z-10 inset-0">
				<img
					src={imgSrc}
					className="object-cover"
					alt="overlaying phone image"
				/>
			</div>
		</div>
	);
}

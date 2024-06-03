'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';

import { CaseColor } from '@prisma/client';
import { AspectRatio } from './ui/aspect-ratio';

import Image from 'next/image';

type PhonePreviewProps = {
	croppedImageUrl: string;
	color: CaseColor;
};

export default function PhonePreview({ croppedImageUrl, color }: PhonePreviewProps) {
	const ref = useRef<HTMLDivElement>(null);

	const [renderedDimensions, setRenderedDimensions] = useState({
		width: 0,
		height: 0,
	});

	const handleResize = () => {
		if (!ref.current) return;

		const { width, height } = ref.current.getBoundingClientRect();

		setRenderedDimensions({ width, height });
	};

	useEffect(() => {
		handleResize();

		window.addEventListener('resize', handleResize);

		return () => window.removeEventListener('resize', handleResize);
	}, [ref.current]);

	let caseBackgroundColor = 'bg-zinc-900';
	if (color === 'blue') caseBackgroundColor = 'bg-blue-950';
	if (color === 'rose') caseBackgroundColor = 'bg-rose-950';

	return (
		<AspectRatio
			ref={ref}
			ratio={3000 / 2001}
			className="relative"
		>
			<div
				className="absolute z-20 scale-[1.0352]"
				style={{
					left: renderedDimensions.width / 2 - renderedDimensions.width / (1216 / 121),
					top: renderedDimensions.height / 6.22,
				}}
			>
				<Image
					src={croppedImageUrl}
					alt="phone in hand image"
					width={renderedDimensions.width / (3000 / 637)}
					height={400}
					className={cn('phone-skew relative z-20 rounded-b-[10px] rounded-t-[15px] md:rounded-b-[20px] md:rounded-t-[30px]', caseBackgroundColor)}
				/>
			</div>

			<div className="relative z-40 h-full w-full">
				<Image
					src="/clearphone.png"
					alt="clear phone"
					width={3000}
					height={2001}
					className="pointer-events-none h-full w-full rounded-md"
				/>
			</div>
		</AspectRatio>
	);
}

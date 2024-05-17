'use client';

import Image from 'next/image';
import MaxWidthWrapper from './max-width-wrapper';
import { HTMLAttributes, useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { cn } from '@/lib/utils';
import Phone from './phone';

const PHONES = ['/testimonials/1.jpg', '/testimonials/2.jpg', '/testimonials/3.jpg', '/testimonials/4.jpg', '/testimonials/5.jpg', '/testimonials/6.jpg'];

export default function Reviews() {
	return (
		<MaxWidthWrapper className="relative max-w-5xl">
			<Image
				src="/what-people-are-buying.png"
				alt="what people are buying	"
				width={193}
				height={143}
				aria-hidden="true"
				className="absolute select-none hidden xl:block -left-32 top-1/3"
			/>
			<ReviewGrid />
		</MaxWidthWrapper>
	);
}

function ReviewGrid() {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const isInView = useInView(containerRef, { once: true, amount: 0.4 });
	const columns = splitArray(PHONES, 3);
	const colum1 = columns[0];
	const colum2 = columns[1];
	const colum3 = splitArray(columns[2], 2);

	return (
		<div
			ref={containerRef}
			className="relative -mx-4 mt-16 grid h-[49rem] max-h-[150vh] grid-cols-1 items-start gap-8 overflow-hidden px-4 sm:mt-20 md:grid-cols-2 lg:grid-cols-3"
		>
			{isInView ? (
				<>
					<ReviewColumn
						phones={[...colum1, ...colum3.flat(), ...colum2]}
						reviewClassName={(index) => cn({ 'md:hidden': index >= colum1.length + colum3[0].length, 'lg:hidden': index >= colum1.length })}
						msPerPixel={10}
					/>
					<ReviewColumn
						phones={[...colum2, ...colum3[1]]}
						className="hidden md:block"
						reviewClassName={(index) => (index >= colum2.length ? 'lg:hidden' : '')}
						msPerPixel={15}
					/>
					<ReviewColumn
						phones={colum3.flat()}
						className="hidden md:block"
						msPerPixel={10}
					/>
				</>
			) : null}
			<div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-100"></div>
			<div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-100"></div>
		</div>
	);
}

function ReviewColumn({
	phones,
	className,
	reviewClassName,
	msPerPixel = 0,
}: {
	phones: string[];
	className?: string;
	msPerPixel?: number;
	reviewClassName?: (reviewIndex: number) => string;
}) {
	const columnRef = useRef<HTMLDivElement | null>(null);
	const [columnHeight, setColumnHeight] = useState(0);
	const duration = `${columnHeight * msPerPixel}ms`;

	useEffect(() => {
		if (!columnRef.current) return;

		const resizeObserver = new window.ResizeObserver(() => {
			setColumnHeight(columnRef.current?.offsetHeight ?? 0);
		});

		resizeObserver.observe(columnRef.current);

		return () => {
			resizeObserver.disconnect();
		};
	}, []);

	return (
		<div
			ref={columnRef}
			className={cn('animate-marquee space-y-8 py-4', className)}
			style={{ '--marquee-duration': duration } as React.CSSProperties}
		>
			{phones.concat(phones).map((imgSrc, index) => (
				<Review
					key={index}
					className={reviewClassName?.(index % phones.length)}
					imgSrc={imgSrc}
				/>
			))}
		</div>
	);
}

interface ReviewProps extends HTMLAttributes<HTMLDivElement> {
	imgSrc: string;
}

function Review({ imgSrc, className, ...props }: ReviewProps) {
	const POSSIBLE_ANIMATION_DELAYS = ['0s', '0.1s', '0.2s', '0.3s', '0.4s', '0.5s'];

	const animationDelay = POSSIBLE_ANIMATION_DELAYS[Math.floor(Math.random() * POSSIBLE_ANIMATION_DELAYS.length)];

	return (
		<div
			className={cn('animate-fade-in rounded-[2.25rem] bg-white p-6 opacity-0 shadow-xl shadow-slate-900/5', className)}
			style={{ animationDelay }}
			{...props}
		>
			<Phone imgSrc={imgSrc} />
		</div>
	);
}

function splitArray<T>(array: Array<T>, numParts: number) {
	const result: Array<Array<T>> = [];

	for (let i = 0; i < array.length; i++) {
		const index = i % numParts;

		if (!result[index]) result[index] = [];

		result[index].push(array[i]);
	}

	return result;
}

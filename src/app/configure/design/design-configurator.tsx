'use client';

import { useRef, useState } from 'react';
import NextImage from 'next/image';

import { Rnd } from 'react-rnd';
import { base64ToBlob, cn, formatPrice } from '@/lib/utils';
import { BASE_PRICE } from '@/config/products';

import { COLORS, FINISHES, MATERIALS, MODELS } from '@/validators/option-validator';

import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Description, Radio, RadioGroup, Label as RadioLabel } from '@headlessui/react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

import { ArrowRight, Check, ChevronsUpDown } from 'lucide-react';

import HandleComponent from '@/components/handle-component';
import { useUploadThing } from '@/lib/uploadthing';
import { useToast } from '@/components/ui/use-toast';
import { useMutation } from '@tanstack/react-query';
import { TConfig } from '@/lib/types';
import { saveConfig } from './actions';
import { useRouter } from 'next/navigation';

type DesignConfiguratorProps = {
	configId: string;
	imageUrl: string;
	imageDimensions: {
		width: number;
		height: number;
	};
};

type TOptions = {
	color: (typeof COLORS)[number];
	model: (typeof MODELS.options)[number];
	material: (typeof MATERIALS.options)[number];
	finish: (typeof FINISHES.options)[number];
};

export default function DesignConfigurator({ configId, imageUrl, imageDimensions }: DesignConfiguratorProps) {
	const router = useRouter();
	const { toast } = useToast();

	const { mutate, isPending } = useMutation({
		mutationKey: ['save-config'],
		mutationFn: async (args: TConfig) => {
			await Promise.all([saveConfiguration(), saveConfig(args)]);
		},
		onError: () => {
			toast({
				title: 'Something went wrong!',
				description: 'There was an error on out end. Please try again.',
				variant: 'destructive',
			});
		},
		onSuccess: () => {
			router.push(`/configure/preview?id=${configId}`);
		},
	});

	const [options, setOptions] = useState<TOptions>({
		color: COLORS[0],
		model: MODELS.options[0],
		material: MATERIALS.options[0],
		finish: FINISHES.options[0],
	});

	const [renderedDimension, setRenderedDimension] = useState({
		width: imageDimensions.width / 4,
		height: imageDimensions.height / 4,
	});

	const [renderedPosition, setRenderedPosition] = useState({
		x: 150,
		y: 205,
	});

	const containerRef = useRef<HTMLDivElement>(null);
	const phoneCaseRef = useRef<HTMLDivElement>(null);

	const { startUpload } = useUploadThing('imageUploader');

	const saveConfiguration = async () => {
		try {
			const { left: containerLeft, top: containerTop } = containerRef.current!.getBoundingClientRect();
			const { left: caseLeft, top: caseTop, width, height } = phoneCaseRef.current!.getBoundingClientRect();

			const topOffset = caseTop - containerTop;
			const leftOffset = caseLeft - containerLeft;

			const finalY = renderedPosition.y - topOffset;
			const finalX = renderedPosition.x - leftOffset;

			const canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext('2d');

			const userImage = new Image();
			userImage.crossOrigin = 'anonymous';
			userImage.src = imageUrl;
			await new Promise((resolve) => (userImage.onload = resolve));

			ctx?.drawImage(userImage, finalX, finalY, renderedDimension.width, renderedDimension.height);

			const base64 = canvas.toDataURL();
			const base64Data = base64.split(',')[1];

			const blob = base64ToBlob(base64Data, 'image/png');
			const file = new File([blob], 'filename.png', { type: 'image/png' });

			await startUpload([file], { configId });
		} catch (error) {
			toast({
				title: 'Something went wrong!',
				description: 'There was a problem saving your config, please try again.',
				variant: 'destructive',
			});
		}
	};

	return (
		<section className="relative mb-20 mt-20 grid grid-cols-1 pb-20 lg:grid-cols-3">
			<div
				ref={containerRef}
				className="relative col-span-2 flex h-[37.5rem] w-full max-w-4xl items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
			>
				<div className="pointer-events-none relative aspect-[896/1831] w-60 bg-opacity-50">
					<AspectRatio
						ref={phoneCaseRef}
						ratio={896 / 1831}
						className="pointer-events-none relative z-50 aspect-[896/1831] w-full"
					>
						<NextImage
							fill
							alt="phone image"
							src="/phone-template.png"
							className="pointer-events-none z-50 select-none"
						/>
					</AspectRatio>
					<div className="absolute inset-0 bottom-px left-[3px] right-[3px] top-px z-40 rounded-[32px] shadow-[0_0_0_99999px_rgba(229,231,235,0.6)]" />
					<div className={cn('absolute inset-0 bottom-px left-[3px] right-[3px] top-px rounded-[32px]', `bg-${options.color.tw}`)} />
				</div>

				<Rnd
					default={{
						x: 150,
						y: 205,
						height: imageDimensions.height / 4,
						width: imageDimensions.width / 4,
					}}
					onResizeStop={(_, __, ref, ___, { x, y }) => {
						setRenderedDimension({
							height: parseInt(ref.style.height.slice(0, -2)),
							width: parseInt(ref.style.width.slice(0, -2)),
						});

						setRenderedPosition({ x, y });
					}}
					onDragStop={(_, data) => {
						const { x, y } = data;
						setRenderedPosition({ x, y });
					}}
					lockAspectRatio
					resizeHandleComponent={{
						topLeft: <HandleComponent />,
						topRight: <HandleComponent />,
						bottomLeft: <HandleComponent />,
						bottomRight: <HandleComponent />,
					}}
				>
					<div className="relative h-full w-full">
						<NextImage
							fill
							src={imageUrl}
							alt="your image"
							className="pointer-events-none"
						/>
					</div>
				</Rnd>
			</div>

			<div className="col-span-full flex h-[37.5rem] w-full flex-col bg-white lg:col-span-1">
				<ScrollArea className="relative flex-1 overflow-auto">
					<div
						aria-hidden="true"
						className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-12 bg-gradient-to-t from-white"
					/>

					<div className="px-8 pb-12 pt-8">
						<h2 className="text-3xl font-bold tracking-tight">Cusomize your case</h2>
						<div className="my-6 h-px w-full bg-zinc-200" />
						<div className="relative mt-4 flex h-full flex-col justify-between">
							<div className="flex flex-col gap-6">
								<RadioGroup
									value={options.color}
									onChange={(val) => setOptions((prev) => ({ ...prev, color: val }))}
								>
									<Label>Color: {options.color.label}</Label>
									<div className="mt-3 flex items-center space-x-3">
										{COLORS.map((color) => (
											<Radio
												key={color.label}
												value={color}
												className={({ checked }) =>
													cn(
														'relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full border-2 border-transparent p-0.5 focus:outline-none focus:ring-0 active:outline-none active:ring-0',
														{
															[`border-${color.tw}`]: checked,
														}
													)
												}
											>
												<span className={cn(`bg-${color.tw}`, 'h-8 w-8 rounded-full border border-black border-opacity-10')} />
											</Radio>
										))}
									</div>
								</RadioGroup>

								<div className="relative flex w-full flex-col gap-3">
									<Label>Model</Label>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="outline"
												role="combobox"
												className="w-full justify-between"
											>
												{options.model.label}
												<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent>
											{MODELS.options.map((model) => (
												<DropdownMenuItem
													key={model.label}
													className={cn('flex cursor-default items-center gap-1 p-1.5 text-sm hover:bg-zinc-100', {
														'bg-zinc-100': model.label === options.model.label,
													})}
													onClick={() => setOptions((prev) => ({ ...prev, model }))}
												>
													<Check className={cn('mr-2 h-4 w-4', model.label === options.model.label ? 'opacity-100' : 'opacity-0')} />
													{model.label}
												</DropdownMenuItem>
											))}
										</DropdownMenuContent>
									</DropdownMenu>
								</div>

								{[MATERIALS, FINISHES].map(({ name, options: selectableOptions }) => (
									<RadioGroup
										key={name}
										value={options[name]}
										onChange={(val) => setOptions((prev) => ({ ...prev, [name]: val }))}
									>
										<Label className="capitalize">{name}</Label>
										<div className="mt-3 space-y-4">
											{selectableOptions.map((option) => (
												<Radio
													key={option.value}
													value={option}
													className={({ checked }) =>
														cn(
															'relative block cursor-pointer rounded-lg border-2 border-zinc-200 bg-white px-6 py-4 shadow-sm outline-none ring-0 focus:outline-none focus:ring-0 sm:flex sm:justify-between',
															{
																'border-primary': checked,
															}
														)
													}
												>
													<span className="flex items-center">
														<span className="flex flex-col text-sm">
															<RadioLabel
																as="span"
																className="font-medium text-gray-900"
															>
																{option.label}
															</RadioLabel>

															{option.description && (
																<Description
																	as="span"
																	className="text-gray-500"
																>
																	<span className="block sm:inline">{option.description}</span>
																</Description>
															)}
														</span>
													</span>

													<Description
														as="span"
														className="mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right"
													>
														<span className="font-medium text-gray-900">{formatPrice(option.price / 100)}</span>
													</Description>
												</Radio>
											))}
										</div>
									</RadioGroup>
								))}
							</div>
						</div>
					</div>
				</ScrollArea>

				<div className="h-16 w-full bg-white px-8">
					<div className="h-px w-full bg-zinc-200" />
					<div className="flex h-full w-full items-center justify-end">
						<div className="flex w-full items-center gap-6">
							<p className="whitespace-nowrap font-medium">{formatPrice((BASE_PRICE + options.finish.price + options.material.price) / 100)}</p>
							<Button
								size="sm"
								className="w-full"
								isLoading={isPending}
								disabled={isPending}
								loadingText="Saving..."
								onClick={() =>
									mutate({
										configId,
										color: options.color.value,
										finish: options.finish.value,
										material: options.material.value,
										model: options.model.value,
									})
								}
							>
								Continue <ArrowRight className="ml-1.5 inline h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

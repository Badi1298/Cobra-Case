'use client';

import { useRouter } from 'next/navigation';

import { changeOrderStatus } from './actions';
import { useMutation } from '@tanstack/react-query';

import { cn } from '@/lib/utils';
import { OrderStatus } from '@prisma/client';

import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type StatusDropdownProps = {
	id: string;
	orderStatus: OrderStatus;
};

const LABEL_MAP: Record<keyof typeof OrderStatus, string> = {
	awaiting_shipment: 'Awaiting Shipment',
	shipped: 'Shipped',
	fulfilled: 'Fulfilled',
};

export default function StatusDropdown({ id, orderStatus }: StatusDropdownProps) {
	const router = useRouter();

	const { mutate } = useMutation({
		mutationKey: ['change-order-status'],
		mutationFn: changeOrderStatus,
		onSuccess: () => router.refresh(),
	});

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					className="flex w-52 items-center justify-between"
				>
					{LABEL_MAP[orderStatus]}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="p-0">
				{Object.keys(OrderStatus).map((status) => (
					<DropdownMenuItem
						key={status}
						className={cn('flex cursor-default items-center gap-1 p-2.5 text-sm hover:bg-zinc-100', {
							'bg-zinc-100': orderStatus === status,
						})}
						onClick={() => mutate({ id, newStatus: status as OrderStatus })}
					>
						<Check className={cn('mr-2 h-4 w-4 text-primary', orderStatus === status ? 'opacity-100' : 'opacity-0')} />
						{LABEL_MAP[status as OrderStatus]}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

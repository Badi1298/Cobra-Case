'use server';

import db from '@/lib/db';

import { OrderStatus } from '@prisma/client';

type TChangeOrderStatus = {
	id: string;
	newStatus: OrderStatus;
};

export const changeOrderStatus = async ({ id, newStatus }: TChangeOrderStatus) => {
	await db.order.update({
		where: { id },
		data: { status: newStatus },
	});
};

'use server';

import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import db from '@/lib/db';

export const getPaymentStatus = async (orderId: string) => {
	const { getUser } = getKindeServerSession();
	const user = await getUser();

	if (!user?.id || !user.email) throw new Error('You need to be logged in to view this page.');

	const order = await db.order.findFirst({
		where: { id: orderId, userId: user.id },
		include: {
			user: true,
			configuration: true,
			billingAddress: true,
			shippingAddress: true,
		},
	});

	if (!order) throw new Error('This order does not exist.');

	if (order.isPaid) return order;
	else return false;
};

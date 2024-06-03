'use server';

import db from '@/lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export const getAuthStatus = async () => {
	const { getUser } = getKindeServerSession();
	const user = await getUser();

	if (!user?.id || !user.email) throw new Error('Invalid user data.');

	const dbUser = await db.user.findUnique({
		where: { id: user.id },
	});

	if (!dbUser) {
		await db.user.create({
			data: {
				id: user.id,
				email: user.email,
			},
		});
	}

	return { success: true };
};

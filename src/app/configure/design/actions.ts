'use server';

import db from '@/lib/db';
import { TConfig } from '@/lib/types';

export async function saveConfig({ color, finish, material, model, configId }: TConfig) {
	await db.configuration.update({
		where: { id: configId },
		data: { color, finish, material, model },
	});
}

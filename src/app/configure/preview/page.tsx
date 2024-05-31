import { notFound } from 'next/navigation';

import db from '@/lib/db';

import DesignPreview from './design-preview';

type PreviewPageProps = {
	searchParams: {
		id: string;
	};
};

export default async function PreviewPage({ searchParams }: PreviewPageProps) {
	const { id } = searchParams;

	if (!id) return notFound();

	const configuration = await db.configuration
		.findUnique({
			where: { id },
		})
		.catch(() => notFound());

	return <DesignPreview configuration={configuration!} />;
}

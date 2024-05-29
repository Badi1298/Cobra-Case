import { notFound } from 'next/navigation';

import db from '@/lib/db';

import DesignConfigurator from './design-configurator';

type PageProps = {
	searchParams: {
		[key: string]: string | string[] | undefined;
	};
};

export default async function Page({ searchParams }: PageProps) {
	const { id } = searchParams;

	if (!id || typeof id !== 'string') return notFound();

	const configuration = await db.configuration.findUnique({
		where: { id },
	});

	if (!configuration) return notFound();

	const { imageUrl, width, height } = configuration;

	return (
		<DesignConfigurator
			configId={id}
			imageUrl={imageUrl}
			imageDimensions={{ width, height }}
		/>
	);
}

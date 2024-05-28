type PageProps = {
	searchParams: {
		[key: string]: string | string[] | undefined;
	};
};

export default async function Page({ searchParams }: PageProps) {
	const { id } = searchParams;

	return <div>Page</div>;
}

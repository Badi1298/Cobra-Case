import { ReactNode } from 'react';

import Steps from '@/components/steps';
import MaxWidthWrapper from '@/components/max-width-wrapper';

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<MaxWidthWrapper className="flex-1 flex flex-col">
			<Steps />
			{children}
		</MaxWidthWrapper>
	);
}

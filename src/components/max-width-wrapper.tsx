import { cn } from '@/lib/utils';

type MaxWidthWrapper = {
	children: React.ReactNode;
	className?: string;
};

export default function MaxWidthWrapper({ children, className }: MaxWidthWrapper) {
	return <div className={cn('h-full mx-auto w-full max-w-screen-xl px-2.5 md:px-20', className)}>{children}</div>;
}

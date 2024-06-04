import type { Metadata } from 'next';

import { Recursive } from 'next/font/google';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Providers from '@/components/providers';

import { SpeedInsights } from '@vercel/speed-insights/next';
import { constructMetadata } from '@/lib/utils';

const recursive = Recursive({ subsets: ['latin'] });

export const metadata: Metadata = constructMetadata();

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={recursive.className}>
				<Navbar />

				<main className="grainy-light flex min-h-[calc(100vh-3.5rem-1px)] flex-col">
					<div className="flex h-full flex-1 flex-col">
						<Providers>
							{children}
							<SpeedInsights />
						</Providers>
					</div>
					<Footer />
				</main>

				<Toaster />
			</body>
		</html>
	);
}

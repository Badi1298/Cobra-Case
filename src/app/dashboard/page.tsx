/* eslint-disable react/no-unescaped-entities */
import { notFound } from 'next/navigation';

import db from '@/lib/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

const WEEKLY_GOAL = 500;
const MONTHLY_GOAL = 2000;

export default async function Page() {
	const { getUser } = getKindeServerSession();
	const user = await getUser();

	if (!user || user.email !== process.env.ADMIN_EMAIL) return notFound();

	const orders = await db.order.findMany({
		where: { isPaid: true, createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 7)) } },
		orderBy: { createdAt: 'desc' },
		include: {
			user: true,
			shippingAddress: true,
		},
	});

	const lastWeekRevenue = await db.order.aggregate({
		where: { isPaid: true, createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 7)) } },
		_sum: { amount: true },
	});

	const lastMonthRevenue = await db.order.aggregate({
		where: { isPaid: true, createdAt: { gte: new Date(new Date().setDate(new Date().getDate() - 30)) } },
		_sum: { amount: true },
	});

	return (
		<div className="flex min-h-screen w-full bg-muted/40">
			<div className="mx-auto flex w-full max-w-7xl flex-col sm:gap-4 sm:py-4">
				<div className="flex flex-col gap-16">
					<div className="grid gap-4 sm:grid-cols-2">
						<Card>
							<CardHeader className="pb-2">
								<CardDescription>Last Week's Revenue</CardDescription>
								<CardTitle className="text-4xl">{formatPrice(lastWeekRevenue._sum.amount ?? 0)}</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-sm text-muted-foreground">of {formatPrice(WEEKLY_GOAL)} goal</div>
							</CardContent>
							<CardFooter>
								<Progress value={((lastWeekRevenue._sum.amount ?? 0) * 100) / WEEKLY_GOAL} />
							</CardFooter>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardDescription>Last Month's Revenue</CardDescription>
								<CardTitle className="text-4xl">{formatPrice(lastMonthRevenue._sum.amount ?? 0)}</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-sm text-muted-foreground">of {formatPrice(MONTHLY_GOAL)} goal</div>
							</CardContent>
							<CardFooter>
								<Progress value={((lastMonthRevenue._sum.amount ?? 0) * 100) / MONTHLY_GOAL} />
							</CardFooter>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}

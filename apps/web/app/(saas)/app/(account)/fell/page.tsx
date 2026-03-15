import { PageHeader } from "@saas/shared/components/PageHeader";
import { FellManager } from "@saas/fell/components/FellManager";
import { db } from "@repo/database";

export default async function FellPage() {
	const fells = await db.fell.findMany({
		orderBy: { createdAt: "desc" },
	});

	// 序列化 Prisma 对象，避免跨服务端/客户端边界时触发 Symbol.toStringTag 错误
	const serializedFells = fells.map((fell) => ({
		id: fell.id,
		name: fell.name,
		weather: fell.weather,
		content: fell.content as Record<string, unknown>,
		imageUrl: fell.imageUrl,
		published: fell.published,
		createdAt: fell.createdAt.toISOString(),
		updatedAt: fell.updatedAt.toISOString(),
	}));

	return (
		<>
			<PageHeader title="感受管理" subtitle="记录和管理你的生活感受" />
			<FellManager initialFells={serializedFells} />
		</>
	);
}

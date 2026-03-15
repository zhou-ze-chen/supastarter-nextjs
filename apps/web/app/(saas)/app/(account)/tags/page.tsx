import { PageHeader } from "@saas/shared/components/PageHeader";
import { TagsManager } from "@saas/tags/components/TagsManager";
import { db } from "@repo/database";

export default async function TagsPage() {
	const tags = await db.noteTag.findMany({
		orderBy: { createdAt: "desc" },
		include: {
			_count: {
				select: { notes: true },
			},
		},
	});

	const serializedTags = tags.map((tag) => ({
		id: tag.id,
		name: tag.name,
		createdAt: tag.createdAt.toISOString(),
		updatedAt: tag.updatedAt.toISOString(),
		_count: tag._count,
	}));

	return (
		<>
			<PageHeader title="标签管理" subtitle="管理笔记分类标签" />
			<TagsManager initialTags={serializedTags} />
		</>
	);
}

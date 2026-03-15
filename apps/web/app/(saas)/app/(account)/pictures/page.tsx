import { PageHeader } from "@saas/shared/components/PageHeader";
import { PictureManager } from "@saas/picture/components/PictureManager";
import { db } from "@repo/database";

export default async function PicturesPage() {
	const pictures = await db.picture.findMany({
		orderBy: { createdAt: "desc" },
	});

	const serializedPictures = pictures.map((pic) => ({
		id: pic.id,
		name: pic.name,
		title: pic.title,
		description: pic.description,
		imageUrl: pic.imageUrl,
		published: pic.published,
		createdAt: pic.createdAt.toISOString(),
		updatedAt: pic.updatedAt.toISOString(),
	}));

	return (
		<>
			<PageHeader title="图片管理" subtitle="管理你的图片集" />
			<PictureManager initialPictures={serializedPictures} />
		</>
	);
}

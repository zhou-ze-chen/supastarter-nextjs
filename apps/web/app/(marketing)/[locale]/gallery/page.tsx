import { GalleryPage } from "@marketing/gallery/components/GalleryPage";
import { db } from "@repo/database";

export async function generateMetadata() {
	return {
		title: "图库 - 逸刻时光",
	};
}

export default async function GalleryRoute() {
	const entries = await db.picture.findMany({
		where: { published: true },
		orderBy: { createdAt: "desc" },
	});

	const galleryEntries = entries.map((entry) => ({
		id: entry.id,
		name: entry.name,
		title: entry.title,
		description: entry.description,
		image: entry.imageUrl,
		likes: entry.likes,
		views: entry.views,
		date: entry.createdAt.toISOString(),
	}));

	return <GalleryPage entries={galleryEntries} />;
}

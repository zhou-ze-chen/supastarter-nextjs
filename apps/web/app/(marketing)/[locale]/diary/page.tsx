import { DiaryPage } from "@marketing/diary/components/DiaryPage";
import { db } from "@repo/database";
import { tiptapJsonToHtml } from "@saas/shared/lib/tiptapRenderer";

export async function generateMetadata() {
	return {
		title: "随记 - 逸刻时光",
	};
}

export default async function DiaryRoute() {
	const entries = await db.fell.findMany({
		where: { published: true },
		orderBy: { createdAt: "desc" },
	});

	const diaryEntries = entries.map((entry) => ({
		id: entry.id,
		title: entry.name,
		date: entry.createdAt.toISOString(),
		weather: entry.weather,
		content: tiptapJsonToHtml(entry.content),
		image: entry.imageUrl,
	}));

	return <DiaryPage entries={diaryEntries} />;
}

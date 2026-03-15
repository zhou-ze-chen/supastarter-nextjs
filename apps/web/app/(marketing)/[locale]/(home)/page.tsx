import { BlogSection } from "@marketing/home/components/BlogSection";
import { DiarySection } from "@marketing/home/components/DiarySection";
import { GallerySection } from "@marketing/home/components/GallerySection";
import { Hero } from "@marketing/home/components/Hero";
import { HomeData } from "@marketing/home/components/HomeData";
import { Products } from "@marketing/home/components/Products";
import { db } from "@repo/database";
import { tiptapJsonToText } from "@saas/shared/lib/tiptapRenderer";
import { setRequestLocale } from "next-intl/server";

export default async function Home({
	params,
}: {
	params: Promise<{ locale: string }>;
}) {
	const { locale } = await params;
	setRequestLocale(locale);

	const publishedNotes = await db.note.findMany({
		where: { published: true },
		orderBy: { createdAt: "desc" },
		include: { noteTag: true },
	});

	// 序列化 Prisma 对象为纯 JS 对象，避免跨服务端/客户端边界时触发 Symbol.toStringTag 错误
	const serializedNotes = publishedNotes.map((note) => ({
		id: note.id,
		title: note.title,
		content: note.content,
		imageUrl: note.imageUrl,
		description: note.description,
		published: note.published,
		noteTagId: note.noteTagId,
		noteTag: { id: note.noteTag.id, name: note.noteTag.name },
		createdAt: note.createdAt.toISOString(),
		updatedAt: note.updatedAt.toISOString(),
	}));

	const latestFell = await db.fell.findFirst({
		where: { published: true },
		orderBy: { createdAt: "desc" },
	});

	const latestDiary = latestFell
		? {
				title: latestFell.name,
				date: latestFell.createdAt.toISOString(),
				weather: latestFell.weather,
				content: tiptapJsonToText(latestFell.content as any),
				image: latestFell.imageUrl,
			}
		: null;

	return (
		<>
			<Hero />
			<HomeData />
			<Products />
			<BlogSection publishedNotes={serializedNotes} />
			<DiarySection latestEntry={latestDiary} />
			<GallerySection />
		</>
	);
}

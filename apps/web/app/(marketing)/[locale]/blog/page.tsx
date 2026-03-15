import { BlogList } from "@marketing/blog/components/BlogList";
import { db } from "@repo/database";

export async function generateMetadata() {
	return {
		title: "文章 - 逸刻时光",
	};
}

export default async function BlogListPage() {
	const notes = await db.note.findMany({
		where: { published: true },
		orderBy: { createdAt: "desc" },
		include: { noteTag: true },
	});

	const serializedNotes = notes.map((note) => ({
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

	return <BlogList publishedNotes={serializedNotes} />;
}

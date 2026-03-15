import { PageHeader } from "@saas/shared/components/PageHeader";
import { NotesManager } from "@saas/notes/components/NotesManager";
import { db } from "@repo/database";

export default async function NotesPage() {
	const [notes, tags] = await Promise.all([
		db.note.findMany({
			orderBy: { createdAt: "desc" },
			include: { noteTag: true },
		}),
		db.noteTag.findMany({
			orderBy: { name: "asc" },
		}),
	]);

	const serializedNotes = notes.map((note) => ({
		id: note.id,
		title: note.title,
		content: note.content as Record<string, unknown>,
		imageUrl: note.imageUrl,
		description: note.description,
		published: note.published,
		noteTagId: note.noteTagId,
		noteTag: { id: note.noteTag.id, name: note.noteTag.name },
		createdAt: note.createdAt.toISOString(),
		updatedAt: note.updatedAt.toISOString(),
	}));

	const serializedTags = tags.map((tag) => ({
		id: tag.id,
		name: tag.name,
	}));

	return (
		<>
			<PageHeader title="笔记管理" subtitle="编写和管理你的笔记内容" />
			<NotesManager initialNotes={serializedNotes} tags={serializedTags} />
		</>
	);
}

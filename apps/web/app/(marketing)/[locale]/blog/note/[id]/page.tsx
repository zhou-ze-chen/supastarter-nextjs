import { LocaleLink } from "@i18n/routing";
import { db } from "@repo/database";
import {
	tiptapJsonToHtml,
	tiptapJsonToText,
} from "@saas/shared/lib/tiptapRenderer";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

type Params = {
	id: string;
	locale: string;
};

export async function generateMetadata(props: { params: Promise<Params> }) {
	const { id } = await props.params;
	const note = await db.note.findUnique({
		where: { id, published: true },
	});

	if (!note) return {};

	return {
		title: note.title,
		description: note.description || tiptapJsonToText(note.content).slice(0, 160),
	};
}

export default async function NoteDetailPage(props: {
	params: Promise<Params>;
}) {
	const { id, locale } = await props.params;
	setRequestLocale(locale);

	const note = await db.note.findUnique({
		where: { id, published: true },
		include: { noteTag: true },
	});

	if (!note) {
		return notFound();
	}

	return (
		<div className="container max-w-6xl pt-32 pb-24">
			<div className="mx-auto max-w-2xl">
				<div className="mb-12">
					<LocaleLink href="/blog">&larr; 返回文章列表</LocaleLink>
				</div>

				<h1 className="font-bold text-4xl">{note.title}</h1>

				<div className="mt-4 flex items-center justify-start gap-6">
					<div className="mr-0 ml-auto">
						<p className="text-sm opacity-30">
							{new Date(note.createdAt).toLocaleDateString("zh-CN")}
						</p>
					</div>

					<div className="flex flex-1 flex-wrap gap-2">
						<span className="font-semibold text-primary text-xs uppercase tracking-wider">
							#{note.noteTag.name}
						</span>
					</div>
				</div>
			</div>

			{note.imageUrl && (
				<div className="relative mt-6 overflow-hidden rounded-xl">
					<img
						src={note.imageUrl}
						alt={note.title}
						className="w-full object-cover"
					/>
				</div>
			)}

			<div className="mx-auto max-w-2xl pb-8">
				{note.description && (
					<p className="mt-8 text-lg text-foreground/60 italic">
						{note.description}
					</p>
				)}
				<div
					className="prose prose-neutral dark:prose-invert mt-8 max-w-none"
					dangerouslySetInnerHTML={{ __html: tiptapJsonToHtml(note.content) }}
				/>
			</div>
		</div>
	);
}

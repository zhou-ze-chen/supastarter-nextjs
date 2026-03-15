"use client";

import type { JSONContent } from "@tiptap/react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@ui/components/tooltip";
import {
	ChevronDownIcon,
	ImageIcon,
	PencilIcon,
	PlusIcon,
	SendIcon,
	TrashIcon,
	UndoIcon,
	XIcon,
} from "lucide-react";
import { TiptapEditor } from "@saas/shared/components/TiptapEditor";
import {
	isTiptapJsonEmpty,
	tiptapJsonToHtml,
} from "@saas/shared/lib/tiptapRenderer";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
	createNote,
	deleteNote,
	getNoteCoverUploadUrl,
	publishNote,
	unpublishNote,
	updateNote,
} from "../actions";

interface NoteTag {
	id: string;
	name: string;
}

interface NoteWithTag {
	id: string;
	title: string;
	content: JSONContent;
	imageUrl: string | null;
	description: string | null;
	published: boolean;
	noteTagId: string;
	noteTag: NoteTag;
	createdAt: string;
	updatedAt: string;
}

interface NoteForm {
	title: string;
	content: JSONContent | null;
	noteTagId: string;
	imageUrl: string;
	description: string;
}

const emptyForm: NoteForm = {
	title: "",
	content: null,
	noteTagId: "",
	imageUrl: "",
	description: "",
};

export function NotesManager({
	initialNotes,
	tags,
}: {
	initialNotes: NoteWithTag[];
	tags: NoteTag[];
}) {
	const router = useRouter();
	const [showForm, setShowForm] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [form, setForm] = useState<NoteForm>(emptyForm);
	const [loading, setLoading] = useState(false);
	const [coverFile, setCoverFile] = useState<File | null>(null);
	const [coverPreview, setCoverPreview] = useState<string | null>(null);
	const [uploading, setUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const openCreateForm = () => {
		setEditingId(null);
		setForm({ ...emptyForm, noteTagId: tags[0]?.id ?? "" });
		setCoverFile(null);
		setCoverPreview(null);
		setShowForm(true);
	};

	const openEditForm = (note: NoteWithTag) => {
		setEditingId(note.id);
		setForm({
			title: note.title,
			content: note.content,
			noteTagId: note.noteTagId,
			imageUrl: note.imageUrl ?? "",
			description: note.description ?? "",
		});
		setCoverFile(null);
		setCoverPreview(note.imageUrl);
		setShowForm(true);
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setCoverFile(file);
		const url = URL.createObjectURL(file);
		setCoverPreview(url);
	};

	const uploadCoverImage = async (noteId: string): Promise<string | undefined> => {
		if (!coverFile) return form.imageUrl.trim() || undefined;
		setUploading(true);
		try {
			const { signedUploadUrl, publicUrl } = await getNoteCoverUploadUrl(noteId);
			const res = await fetch(signedUploadUrl, {
				method: "PUT",
				body: coverFile,
				headers: { "Content-Type": coverFile.type },
			});
			if (!res.ok) throw new Error("上传失败");
			return publicUrl;
		} catch {
			toast.error("封面图片上传失败");
			return form.imageUrl.trim() || undefined;
		} finally {
			setUploading(false);
		}
	};

	const handleSubmit = async () => {
		if (!form.title.trim() || isTiptapJsonEmpty(form.content) || !form.noteTagId) return;
		setLoading(true);

		try {
			const payload = {
				title: form.title.trim(),
				content: form.content as Record<string, unknown>,
				noteTagId: form.noteTagId,
				description: form.description.trim() || undefined,
			};
			if (editingId) {
				const imageUrl = await uploadCoverImage(editingId);
				await updateNote(editingId, { ...payload, imageUrl });
				toast.success("笔记修改成功");
			} else {
				const noteId = await createNote(payload);
				if (coverFile) {
					const imageUrl = await uploadCoverImage(noteId);
					if (imageUrl) {
						await updateNote(noteId, { ...payload, imageUrl });
					}
				}
				toast.success("笔记创建成功");
			}
		} finally {
			setShowForm(false);
			setForm(emptyForm);
			setCoverFile(null);
			setCoverPreview(null);
			setEditingId(null);
			setLoading(false);
			router.refresh();
		}
	};

	const handlePublish = async (id: string, isPublished: boolean) => {
		setLoading(true);
		if (isPublished) {
			await unpublishNote(id);
			toast.success("笔记已撤回发布");
		} else {
			await publishNote(id);
			toast.success("笔记发布成功");
		}
		setLoading(false);
		router.refresh();
	};

	const handleDelete = async (id: string) => {
		if (!confirm("确定要删除这篇笔记吗？")) return;
		setLoading(true);
		await deleteNote(id);
		toast.success("笔记删除成功");
		setLoading(false);
		router.refresh();
	};

	return (
		<TooltipProvider delayDuration={300}>
			<div className="mt-4 max-w-4xl">
				{/* Top bar */}
				<div className="flex items-center justify-between">
					<span className="text-sm text-foreground/50">
						共 {initialNotes.length} 篇笔记
					</span>
					<Tooltip>
						<TooltipTrigger asChild>
							<button
								type="button"
								onClick={openCreateForm}
								className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-80"
							>
								<PlusIcon className="size-4" />
								新建笔记
							</button>
						</TooltipTrigger>
						<TooltipContent>创建一篇新的笔记</TooltipContent>
					</Tooltip>
				</div>

				{/* Form */}
				{showForm && (
					<div className="mt-4 rounded-xl border bg-card p-6">
						<div className="mb-4 flex items-center justify-between">
							<h3 className="font-bold">
								{editingId ? "编辑笔记" : "新建笔记"}
							</h3>
							<button
								type="button"
								onClick={() => setShowForm(false)}
								className="rounded-lg p-1 text-foreground/50 hover:text-foreground"
							>
								<XIcon className="size-5" />
							</button>
						</div>

						<div className="space-y-4">
							<div>
								<label htmlFor="note-title" className="mb-1 block text-sm font-medium">标题</label>
								<input
									id="note-title"
									type="text"
									value={form.title}
									onChange={(e) =>
										setForm((f) => ({ ...f, title: e.target.value }))
									}
									placeholder="笔记标题"
									className="w-full rounded-lg border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>

							<div>
								<label htmlFor="note-tag" className="mb-1 block text-sm font-medium">标签</label>
								<div className="relative">
									<select
										id="note-tag"
										value={form.noteTagId}
										onChange={(e) =>
											setForm((f) => ({ ...f, noteTagId: e.target.value }))
										}
										className="w-full appearance-none rounded-lg border bg-background px-4 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-primary"
									>
										<option value="" disabled>
											选择标签
										</option>
										{tags.map((tag) => (
											<option key={tag.id} value={tag.id}>
												{tag.name}
											</option>
										))}
									</select>
									<ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-foreground/40" />
								</div>
								{tags.length === 0 && (
									<p className="mt-1 text-xs text-red-500">
										请先在标签管理页面创建标签
									</p>
								)}
							</div>

							<div>
								<label htmlFor="note-desc" className="mb-1 block text-sm font-medium">简介</label>
								<input
									id="note-desc"
									type="text"
									value={form.description}
									onChange={(e) =>
										setForm((f) => ({ ...f, description: e.target.value }))
									}
									placeholder="可选的简短描述"
									className="w-full rounded-lg border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>

							<div>
								<label htmlFor="note-image" className="mb-1 block text-sm font-medium">
									封面图片
								</label>
								<input
									ref={fileInputRef}
									id="note-image"
									type="file"
									accept="image/png,image/jpeg,image/webp"
									onChange={handleFileChange}
									className="hidden"
								/>
								{coverPreview ? (
									<div className="relative w-fit">
										<img
											src={coverPreview}
											alt="封面预览"
											className="h-32 max-w-xs rounded-lg object-cover"
										/>
										<button
											type="button"
											onClick={() => {
												setCoverFile(null);
												setCoverPreview(null);
												setForm((f) => ({ ...f, imageUrl: "" }));
												if (fileInputRef.current) {
													fileInputRef.current.value = "";
												}
											}}
											className="absolute -top-2 -right-2 rounded-full bg-foreground/80 p-1 text-background hover:bg-foreground"
										>
											<XIcon className="size-3" />
										</button>
									</div>
								) : (
									<button
										type="button"
										onClick={() => fileInputRef.current?.click()}
										className="flex h-32 w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-foreground/20 text-sm text-foreground/40 transition-colors hover:border-primary hover:text-primary"
									>
										<ImageIcon className="size-5" />
										点击上传封面图片
									</button>
								)}
								{uploading && (
									<p className="mt-1 text-xs text-primary">正在上传...</p>
								)}
							</div>

							<div>
								<p className="mb-1 text-sm font-medium">内容</p>
								<TiptapEditor
									key={editingId ?? "new"}
									value={form.content}
									onChange={(json) =>
										setForm((f) => ({ ...f, content: json as JSONContent }))
									}
									outputFormat="json"
								/>
							</div>

							<div className="flex justify-end gap-3">
								<Tooltip>
									<TooltipTrigger asChild>
										<button
											type="button"
											onClick={() => setShowForm(false)}
											className="rounded-lg border px-4 py-2 text-sm transition-colors hover:bg-foreground/5"
										>
											取消
										</button>
									</TooltipTrigger>
									<TooltipContent>放弃当前编辑</TooltipContent>
								</Tooltip>
								<Tooltip>
									<TooltipTrigger asChild>
										<button
											type="button"
											onClick={handleSubmit}
											disabled={
												loading ||
												!form.title.trim() ||
												isTiptapJsonEmpty(form.content) ||
												!form.noteTagId
											}
											className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-80 disabled:opacity-50"
										>
											{editingId ? "保存修改" : "创建笔记"}
										</button>
									</TooltipTrigger>
									<TooltipContent>
										{editingId ? "保存对笔记的修改" : "保存并创建笔记"}
									</TooltipContent>
								</Tooltip>
							</div>
						</div>
					</div>
				)}

				{/* Notes list */}
				<div className="mt-6 space-y-3">
					{initialNotes.length === 0 && !showForm && (
						<p className="py-12 text-center text-sm text-foreground/50">
							暂无笔记，点击「新建笔记」开始创作
						</p>
					)}

					{initialNotes.map((note) => (
						<div
							key={note.id}
							className="flex items-start gap-4 rounded-xl border bg-card p-4"
						>
							{note.imageUrl && (
								<img
									src={note.imageUrl}
									alt={note.title}
									className="size-20 shrink-0 rounded-lg object-cover"
								/>
							)}
							<div className="min-w-0 flex-1">
								<div className="flex items-start justify-between gap-2">
									<div>
										<div className="flex items-center gap-2">
											<h3 className="font-bold">{note.title}</h3>
											{note.published ? (
												<span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-600">
													已发布
												</span>
											) : (
												<span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs text-foreground/50">
													草稿
												</span>
											)}
										</div>
										<div className="mt-1 flex items-center gap-2">
											<span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
												{note.noteTag.name}
											</span>
											<span className="text-xs text-foreground/40">
												{new Date(note.createdAt).toLocaleDateString("zh-CN")}
											</span>
										</div>
									</div>
									<div className="flex shrink-0 items-center gap-1">
										<Tooltip>
											<TooltipTrigger asChild>
												<button
													type="button"
													onClick={() =>
														handlePublish(note.id, note.published)
													}
													disabled={loading}
													className={`rounded-lg p-2 transition-colors ${
														note.published
															? "text-green-600 hover:bg-green-500/10 hover:text-green-700"
															: "text-foreground/50 hover:bg-primary/10 hover:text-primary"
													}`}
												>
													{note.published ? (
														<UndoIcon className="size-4" />
													) : (
														<SendIcon className="size-4" />
													)}
												</button>
											</TooltipTrigger>
											<TooltipContent>
												{note.published
													? "撤回发布，将笔记设为草稿"
													: "发布笔记，使其对外可见"}
											</TooltipContent>
										</Tooltip>
										<Tooltip>
											<TooltipTrigger asChild>
												<button
													type="button"
													onClick={() => openEditForm(note)}
													className="rounded-lg p-2 text-foreground/50 transition-colors hover:bg-foreground/5 hover:text-foreground"
												>
													<PencilIcon className="size-4" />
												</button>
											</TooltipTrigger>
											<TooltipContent>编辑笔记内容</TooltipContent>
										</Tooltip>
										<Tooltip>
											<TooltipTrigger asChild>
												<button
													type="button"
													onClick={() => handleDelete(note.id)}
													className="rounded-lg p-2 text-foreground/50 transition-colors hover:bg-red-500/10 hover:text-red-500"
												>
													<TrashIcon className="size-4" />
												</button>
											</TooltipTrigger>
											<TooltipContent>删除这篇笔记</TooltipContent>
										</Tooltip>
									</div>
								</div>
								{note.description && (
									<p className="mt-2 text-sm text-foreground/60">
										{note.description}
									</p>
								)}
								<div
									className="prose prose-sm prose-neutral dark:prose-invert mt-1 line-clamp-2 text-foreground/40"
									dangerouslySetInnerHTML={{ __html: tiptapJsonToHtml(note.content) }}
								/>
							</div>
						</div>
					))}
				</div>
			</div>
		</TooltipProvider>
	);
}

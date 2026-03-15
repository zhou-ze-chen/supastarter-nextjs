"use client";

import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createTag, deleteTag, updateTag } from "../actions";

interface TagWithCount {
	id: string;
	name: string;
	createdAt: string;
	updatedAt: string;
	_count: { notes: number };
}

export function TagsManager({ initialTags }: { initialTags: TagWithCount[] }) {
	const router = useRouter();
	const [newTagName, setNewTagName] = useState("");
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editingName, setEditingName] = useState("");
	const [loading, setLoading] = useState(false);

	const handleCreate = async () => {
		const name = newTagName.trim();
		if (!name) return;
		setLoading(true);
		await createTag(name);
		setNewTagName("");
		setLoading(false);
		toast.success("您已添加标签成功");
		router.refresh();
	};

	const handleUpdate = async (id: string) => {
		const name = editingName.trim();
		if (!name) return;
		setLoading(true);
		await updateTag(id, name);
		setEditingId(null);
		setLoading(false);
		toast.success("标签修改成功");
		router.refresh();
	};

	const handleDelete = async (id: string) => {
		if (!confirm("确定要删除这个标签吗？关联的笔记也会被删除。")) return;
		setLoading(true);
		await deleteTag(id);
		setLoading(false);
		toast.success("标签删除成功");
		router.refresh();
	};

	return (
		<div className="mt-4 max-w-2xl">
			{/* Create new tag */}
			<div className="flex gap-3">
				<input
					type="text"
					value={newTagName}
					onChange={(e) => setNewTagName(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") handleCreate();
					}}
					placeholder="输入标签名称..."
					className="flex-1 rounded-lg border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
				/>
				<button
					type="button"
					onClick={handleCreate}
					disabled={loading || !newTagName.trim()}
					className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-80 disabled:opacity-50"
				>
					<PlusIcon className="size-4" />
					添加标签
				</button>
			</div>

			{/* Tags list */}
			<div className="mt-6 space-y-2">
				{initialTags.length === 0 && (
					<p className="py-8 text-center text-sm text-foreground/50">
						暂无标签，请添加一个标签
					</p>
				)}

				{initialTags.map((tag) => (
					<div
						key={tag.id}
						className="flex items-center justify-between rounded-lg border bg-card px-4 py-3"
					>
						{editingId === tag.id ? (
							<div className="flex flex-1 items-center gap-3">
								<input
									type="text"
									value={editingName}
									onChange={(e) => setEditingName(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter") handleUpdate(tag.id);
										if (e.key === "Escape") setEditingId(null);
									}}
									className="flex-1 rounded-lg border bg-background px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary"
									autoFocus
								/>
								<button
									type="button"
									onClick={() => handleUpdate(tag.id)}
									disabled={loading}
									className="rounded-lg bg-primary px-3 py-1.5 text-sm text-primary-foreground"
								>
									保存
								</button>
								<button
									type="button"
									onClick={() => setEditingId(null)}
									className="rounded-lg border px-3 py-1.5 text-sm"
								>
									取消
								</button>
							</div>
						) : (
							<>
								<div className="flex items-center gap-3">
									<span className="font-medium">{tag.name}</span>
									<span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs text-foreground/60">
										{tag._count.notes} 篇笔记
									</span>
								</div>
								<div className="flex items-center gap-2">
									<button
										type="button"
										onClick={() => {
											setEditingId(tag.id);
											setEditingName(tag.name);
										}}
										className="rounded-lg p-2 text-foreground/50 transition-colors hover:bg-foreground/5 hover:text-foreground"
									>
										<PencilIcon className="size-4" />
									</button>
									<button
										type="button"
										onClick={() => handleDelete(tag.id)}
										className="rounded-lg p-2 text-foreground/50 transition-colors hover:bg-red-500/10 hover:text-red-500"
									>
										<TrashIcon className="size-4" />
									</button>
								</div>
							</>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

"use client";

import type { JSONContent } from "@tiptap/react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@ui/components/tooltip";
import {
	CloudSunIcon,
	GlobeIcon,
	ImageIcon,
	PencilIcon,
	PlusIcon,
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
	createFell,
	deleteFell,
	getFellCoverUploadUrl,
	publishFell,
	unpublishFell,
	updateFell,
} from "../actions";

interface FellItem {
	id: string;
	name: string;
	weather: string;
	content: JSONContent;
	imageUrl: string | null;
	published: boolean;
	createdAt: string;
	updatedAt: string;
}

interface FellForm {
	name: string;
	weather: string;
	content: JSONContent | null;
	imageUrl: string;
}

const emptyForm: FellForm = {
	name: "",
	weather: "",
	content: null,
	imageUrl: "",
};

export function FellManager({
	initialFells,
}: {
	initialFells: FellItem[];
}) {
	const router = useRouter();
	const [showForm, setShowForm] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [form, setForm] = useState<FellForm>(emptyForm);
	const [loading, setLoading] = useState(false);
	const [coverFile, setCoverFile] = useState<File | null>(null);
	const [coverPreview, setCoverPreview] = useState<string | null>(null);
	const [uploading, setUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const openCreateForm = () => {
		setEditingId(null);
		setForm(emptyForm);
		setCoverFile(null);
		setCoverPreview(null);
		setShowForm(true);
	};

	const openEditForm = (fell: FellItem) => {
		setEditingId(fell.id);
		setForm({
			name: fell.name,
			weather: fell.weather,
			content: fell.content,
			imageUrl: fell.imageUrl ?? "",
		});
		setCoverFile(null);
		setCoverPreview(fell.imageUrl);
		setShowForm(true);
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setCoverFile(file);
		const url = URL.createObjectURL(file);
		setCoverPreview(url);
	};

	const uploadCoverImage = async (fellId: string): Promise<string | undefined> => {
		if (!coverFile) return form.imageUrl.trim() || undefined;
		setUploading(true);
		try {
			const { signedUploadUrl, publicUrl } = await getFellCoverUploadUrl(fellId);
			const res = await fetch(signedUploadUrl, {
				method: "PUT",
				body: coverFile,
				headers: { "Content-Type": coverFile.type },
			});
			if (!res.ok) throw new Error("上传失败");
			return publicUrl;
		} catch {
			toast.error("图片上传失败");
			return form.imageUrl.trim() || undefined;
		} finally {
			setUploading(false);
		}
	};

	const handleSubmit = async () => {
		if (!form.name.trim() || !form.weather.trim() || isTiptapJsonEmpty(form.content)) {
			return;
		}
		setLoading(true);

		try {
			const payload = {
				name: form.name.trim(),
				weather: form.weather.trim(),
				content: form.content as Record<string, unknown>,
			};
			if (editingId) {
				const imageUrl = await uploadCoverImage(editingId);
				await updateFell(editingId, { ...payload, imageUrl });
				toast.success("感受修改成功");
			} else {
				const fellId = await createFell(payload);
				if (coverFile) {
					const imageUrl = await uploadCoverImage(fellId);
					if (imageUrl) {
						await updateFell(fellId, { ...payload, imageUrl });
					}
				}
				toast.success("感受创建成功");
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

	const handleDelete = async (id: string) => {
		if (!confirm("确定要删除这条感受吗？")) return;
		setLoading(true);
		await deleteFell(id);
		toast.success("感受删除成功");
		setLoading(false);
		router.refresh();
	};

	return (
		<TooltipProvider delayDuration={300}>
			<div className="mt-4 max-w-4xl">
				{/* Top bar */}
				<div className="flex items-center justify-between">
					<span className="text-sm text-foreground/50">
						共 {initialFells.length} 条感受
					</span>
					<Tooltip>
						<TooltipTrigger asChild>
							<button
								type="button"
								onClick={openCreateForm}
								className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-80"
							>
								<PlusIcon className="size-4" />
								新建感受
							</button>
						</TooltipTrigger>
						<TooltipContent>记录一条新的感受</TooltipContent>
					</Tooltip>
				</div>

				{/* Form */}
				{showForm && (
					<div className="mt-4 rounded-xl border bg-card p-6">
						<div className="mb-4 flex items-center justify-between">
							<h3 className="font-bold">
								{editingId ? "编辑感受" : "新建感受"}
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
								<label
									htmlFor="fell-name"
									className="mb-1 block text-sm font-medium"
								>
									名称
								</label>
								<input
									id="fell-name"
									type="text"
									value={form.name}
									onChange={(e) =>
										setForm((f) => ({ ...f, name: e.target.value }))
									}
									placeholder="感受名称"
									className="w-full rounded-lg border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>

							<div>
								<label
									htmlFor="fell-weather"
									className="mb-1 block text-sm font-medium"
								>
									天气
								</label>
								<input
									id="fell-weather"
									type="text"
									value={form.weather}
									onChange={(e) =>
										setForm((f) => ({ ...f, weather: e.target.value }))
									}
									placeholder="例如：晴天、多云、下雨"
									className="w-full rounded-lg border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>

							<div>
								<label
									htmlFor="fell-image"
									className="mb-1 block text-sm font-medium"
								>
									图片
								</label>
								<input
									ref={fileInputRef}
									id="fell-image"
									type="file"
									accept="image/png,image/jpeg,image/webp"
									onChange={handleFileChange}
									className="hidden"
								/>
								{coverPreview ? (
									<div className="relative w-fit">
										<img
											src={coverPreview}
											alt="图片预览"
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
										点击上传图片
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
												!form.name.trim() ||
												!form.weather.trim() ||
												isTiptapJsonEmpty(form.content)
											}
											className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-80 disabled:opacity-50"
										>
											{editingId ? "保存修改" : "创建感受"}
										</button>
									</TooltipTrigger>
									<TooltipContent>
										{editingId ? "保存对感受的修改" : "保存并创建感受"}
									</TooltipContent>
								</Tooltip>
							</div>
						</div>
					</div>
				)}

				{/* Fell list */}
				<div className="mt-6 space-y-3">
					{initialFells.length === 0 && !showForm && (
						<p className="py-12 text-center text-sm text-foreground/50">
							暂无感受，点击「新建感受」开始记录
						</p>
					)}

					{initialFells.map((fell) => (
						<div
							key={fell.id}
							className="flex items-start gap-4 rounded-xl border bg-card p-4"
						>
							{fell.imageUrl && (
								<img
									src={fell.imageUrl}
									alt={fell.name}
									className="size-20 shrink-0 rounded-lg object-cover"
								/>
							)}
							<div className="min-w-0 flex-1">
								<div className="flex items-start justify-between gap-2">
									<div>
										<h3 className="font-bold">{fell.name}</h3>
										<div className="mt-1 flex items-center gap-2">
											<span className="flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs text-blue-600">
												<CloudSunIcon className="size-3" />
												{fell.weather}
											</span>
											<span className="text-xs text-foreground/40">
												{new Date(fell.createdAt).toLocaleDateString("zh-CN")}
											</span>
											{fell.published && (
												<span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-600">
													<GlobeIcon className="size-3" />
													已发布
												</span>
											)}
										</div>
									</div>
									<div className="flex shrink-0 items-center gap-1">
										<Tooltip>
											<TooltipTrigger asChild>
												<button
													type="button"
													onClick={async () => {
														if (fell.published) {
															await unpublishFell(fell.id);
															toast.success("已取消发布");
														} else {
															await publishFell(fell.id);
															toast.success("发布成功");
														}
														router.refresh();
													}}
													className={`rounded-lg p-2 transition-colors ${
														fell.published
															? "text-green-500 hover:bg-green-500/10 hover:text-green-600"
															: "text-foreground/50 hover:bg-foreground/5 hover:text-foreground"
													}`}
												>
													{fell.published ? (
														<UndoIcon className="size-4" />
													) : (
														<GlobeIcon className="size-4" />
													)}
												</button>
											</TooltipTrigger>
											<TooltipContent>
												{fell.published ? "取消发布到随记" : "发布到随记"}
											</TooltipContent>
										</Tooltip>
										<Tooltip>
											<TooltipTrigger asChild>
												<button
													type="button"
													onClick={() => openEditForm(fell)}
													className="rounded-lg p-2 text-foreground/50 transition-colors hover:bg-foreground/5 hover:text-foreground"
												>
													<PencilIcon className="size-4" />
												</button>
											</TooltipTrigger>
											<TooltipContent>编辑感受内容</TooltipContent>
										</Tooltip>
										<Tooltip>
											<TooltipTrigger asChild>
												<button
													type="button"
													onClick={() => handleDelete(fell.id)}
													className="rounded-lg p-2 text-foreground/50 transition-colors hover:bg-red-500/10 hover:text-red-500"
												>
													<TrashIcon className="size-4" />
												</button>
											</TooltipTrigger>
											<TooltipContent>删除这条感受</TooltipContent>
										</Tooltip>
									</div>
								</div>
								<div
									className="prose prose-sm prose-neutral dark:prose-invert mt-2 line-clamp-3 text-foreground/60"
									dangerouslySetInnerHTML={{ __html: tiptapJsonToHtml(fell.content) }}
								/>
							</div>
						</div>
					))}
				</div>
			</div>
		</TooltipProvider>
	);
}

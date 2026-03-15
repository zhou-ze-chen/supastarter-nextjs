"use client";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@ui/components/tooltip";
import {
	GlobeIcon,
	ImageIcon,
	PencilIcon,
	PlusIcon,
	TrashIcon,
	UndoIcon,
	XIcon,
} from "lucide-react";
import { TiptapEditor } from "@saas/shared/components/TiptapEditor";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
	createPicture,
	deletePicture,
	getPictureCoverUploadUrl,
	publishPicture,
	unpublishPicture,
	updatePicture,
} from "../actions";

interface PictureItem {
	id: string;
	name: string;
	title: string;
	description: string | null;
	imageUrl: string | null;
	published: boolean;
	createdAt: string;
	updatedAt: string;
}

interface PictureForm {
	name: string;
	title: string;
	description: string;
	imageUrl: string;
}

const emptyForm: PictureForm = {
	name: "",
	title: "",
	description: "",
	imageUrl: "",
};

export function PictureManager({
	initialPictures,
}: {
	initialPictures: PictureItem[];
}) {
	const router = useRouter();
	const [showForm, setShowForm] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [form, setForm] = useState<PictureForm>(emptyForm);
	const [loading, setLoading] = useState(false);
	const [coverPreview, setCoverPreview] = useState<string | null>(null);
	const [uploading, setUploading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const openCreateForm = () => {
		setEditingId(null);
		setForm(emptyForm);
		setCoverPreview(null);
		setShowForm(true);
	};

	const openEditForm = (picture: PictureItem) => {
		setEditingId(picture.id);
		setForm({
			name: picture.name,
			title: picture.title,
			description: picture.description ?? "",
			imageUrl: picture.imageUrl ?? "",
		});
		setCoverPreview(picture.imageUrl);
		setShowForm(true);
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setCoverPreview(URL.createObjectURL(file));
		setUploading(true);
		try {
			const { signedUploadUrl, publicUrl } =
				await getPictureCoverUploadUrl();
			const res = await fetch(signedUploadUrl, {
				method: "PUT",
				body: file,
				headers: { "Content-Type": file.type },
			});
			if (!res.ok) {
				const text = await res.text();
				console.error("S3上传失败:", res.status, text);
				throw new Error(`上传失败: ${res.status}`);
			}
			setForm((f) => ({ ...f, imageUrl: publicUrl }));
			toast.success("图片上传成功");
		} catch (err) {
			console.error("上传异常:", err);
			toast.error("图片上传失败，请重试");
			setCoverPreview(null);
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		} finally {
			setUploading(false);
		}
	};

	const handleSubmit = async () => {
		if (!form.name.trim() || !form.title.trim()) return;
		setLoading(true);

		try {
			const payload = {
				name: form.name.trim(),
				title: form.title.trim(),
				description: form.description.trim() || undefined,
				imageUrl: form.imageUrl.trim() || undefined,
			};
			if (editingId) {
				await updatePicture(editingId, payload);
				toast.success("图片修改成功");
			} else {
				await createPicture(payload);
				toast.success("图片创建成功");
			}
		} finally {
			setShowForm(false);
			setForm(emptyForm);
			setCoverPreview(null);
			setEditingId(null);
			setLoading(false);
			router.refresh();
		}
	};

	const handleDelete = async (id: string) => {
		if (!confirm("确定要删除这张图片吗？")) return;
		setLoading(true);
		await deletePicture(id);
		toast.success("图片删除成功");
		setLoading(false);
		router.refresh();
	};

	return (
		<TooltipProvider delayDuration={300}>
			<div className="mt-4 max-w-4xl">
				{/* Top bar */}
				<div className="flex items-center justify-between">
					<span className="text-sm text-foreground/50">
						共 {initialPictures.length} 张图片
					</span>
					<Tooltip>
						<TooltipTrigger asChild>
							<button
								type="button"
								onClick={openCreateForm}
								className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-80"
							>
								<PlusIcon className="size-4" />
								新建图片
							</button>
						</TooltipTrigger>
						<TooltipContent>添加一张新的图片</TooltipContent>
					</Tooltip>
				</div>

				{/* Form */}
				{showForm && (
					<div className="mt-4 rounded-xl border bg-card p-6">
						<div className="mb-4 flex items-center justify-between">
							<h3 className="font-bold">
								{editingId ? "编辑图片" : "新建图片"}
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
									htmlFor="picture-name"
									className="mb-1 block text-sm font-medium"
								>
									名称
								</label>
								<input
									id="picture-name"
									type="text"
									value={form.name}
									onChange={(e) =>
										setForm((f) => ({ ...f, name: e.target.value }))
									}
									placeholder="图片名称"
									className="w-full rounded-lg border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>

							<div>
								<label
									htmlFor="picture-title"
									className="mb-1 block text-sm font-medium"
								>
									标题
								</label>
								<input
									id="picture-title"
									type="text"
									value={form.title}
									onChange={(e) =>
										setForm((f) => ({ ...f, title: e.target.value }))
									}
									placeholder="图片标题"
									className="w-full rounded-lg border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
								/>
							</div>

							<div>
								<label
									htmlFor="picture-image"
									className="mb-1 block text-sm font-medium"
								>
									图片
								</label>
								<input
									ref={fileInputRef}
									id="picture-image"
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
								<p className="mb-1 text-sm font-medium">描述（可选）</p>
								<TiptapEditor
									key={editingId ?? "new"}
									value={form.description}
									onChange={(html) =>
										setForm((f) => ({ ...f, description: html as string }))
									}
									outputFormat="html"
									minHeight="120px"
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
												loading || !form.name.trim() || !form.title.trim()
											}
											className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-80 disabled:opacity-50"
										>
											{editingId ? "保存修改" : "创建图片"}
										</button>
									</TooltipTrigger>
									<TooltipContent>
										{editingId ? "保存对图片的修改" : "保存并创建图片"}
									</TooltipContent>
								</Tooltip>
							</div>
						</div>
					</div>
				)}

				{/* Picture list */}
				<div className="mt-6 space-y-3">
					{initialPictures.length === 0 && !showForm && (
						<p className="py-12 text-center text-sm text-foreground/50">
							暂无图片，点击「新建图片」开始添加
						</p>
					)}

					{initialPictures.map((picture) => (
						<div
							key={picture.id}
							className="flex items-start gap-4 rounded-xl border bg-card p-4"
						>
							{picture.imageUrl && (
								<img
									src={picture.imageUrl}
									alt={picture.name}
									className="size-20 shrink-0 rounded-lg object-cover"
								/>
							)}
							<div className="min-w-0 flex-1">
								<div className="flex items-start justify-between gap-2">
									<div>
										<h3 className="font-bold">{picture.title}</h3>
										<div className="mt-1 flex items-center gap-2">
											<span className="flex items-center gap-1 rounded-full bg-purple-500/10 px-2 py-0.5 text-xs text-purple-600">
												<ImageIcon className="size-3" />
												{picture.name}
											</span>
											<span className="text-xs text-foreground/40">
												{new Date(picture.createdAt).toLocaleDateString(
													"zh-CN",
												)}
											</span>
											{picture.published && (
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
														if (picture.published) {
															await unpublishPicture(picture.id);
															toast.success("已取消发布");
														} else {
															await publishPicture(picture.id);
															toast.success("发布成功");
														}
														router.refresh();
													}}
													className={`rounded-lg p-2 transition-colors ${
														picture.published
															? "text-green-500 hover:bg-green-500/10 hover:text-green-600"
															: "text-foreground/50 hover:bg-foreground/5 hover:text-foreground"
													}`}
												>
													{picture.published ? (
														<UndoIcon className="size-4" />
													) : (
														<GlobeIcon className="size-4" />
													)}
												</button>
											</TooltipTrigger>
											<TooltipContent>
												{picture.published ? "取消发布到图库" : "发布到图库"}
											</TooltipContent>
										</Tooltip>
										<Tooltip>
											<TooltipTrigger asChild>
												<button
													type="button"
													onClick={() => openEditForm(picture)}
													className="rounded-lg p-2 text-foreground/50 transition-colors hover:bg-foreground/5 hover:text-foreground"
												>
													<PencilIcon className="size-4" />
												</button>
											</TooltipTrigger>
											<TooltipContent>编辑图片信息</TooltipContent>
										</Tooltip>
										<Tooltip>
											<TooltipTrigger asChild>
												<button
													type="button"
													onClick={() => handleDelete(picture.id)}
													className="rounded-lg p-2 text-foreground/50 transition-colors hover:bg-red-500/10 hover:text-red-500"
												>
													<TrashIcon className="size-4" />
												</button>
											</TooltipTrigger>
											<TooltipContent>删除这张图片</TooltipContent>
										</Tooltip>
									</div>
								</div>
								{picture.description && (
									<div
										className="prose prose-sm prose-neutral dark:prose-invert mt-2 line-clamp-3 text-foreground/60"
										dangerouslySetInnerHTML={{ __html: picture.description }}
									/>
								)}
							</div>
						</div>
					))}
				</div>
			</div>
		</TooltipProvider>
	);
}

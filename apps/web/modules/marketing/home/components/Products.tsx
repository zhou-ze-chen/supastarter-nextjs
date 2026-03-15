"use client";

import { cn } from "@ui/lib";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	EyeIcon,
	HeartIcon,
	MessageSquareIcon,
	ShareIcon,
	XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Product {
	title: string;
	date: string;
	category: string;
	tag: string;
	image: string;
	likes: number;
	views: number;
	comments: number;
	intro: string;
	contentImages: string[];
}

const products: Product[] = [
	{
		title: "逸刻时光1.0",
		date: "2024-10-28",
		category: "产品",
		tag: "产品 / 博客v1.0",
		image: "https://www.huohuo90.com:443/files/1730124974492.jpg",
		likes: 22,
		views: 700,
		comments: 4,
		intro: "本站1.0版本建设说明",
		contentImages: [
			"https://www.huohuo90.com:443/files/1730125070611.jpg",
			"https://www.huohuo90.com:443/files/1730125055407.jpg",
			"https://www.huohuo90.com:443/files/1730125079221.jpg",
			"https://www.huohuo90.com:443/files/1730125088103.jpg",
			"https://www.huohuo90.com:443/files/1730125098028.jpg",
			"https://www.huohuo90.com:443/files/1730125107245.jpg",
			"https://www.huohuo90.com:443/files/1730125117330.jpg",
			"https://www.huohuo90.com:443/files/1730125125922.jpg",
		],
	},
	{
		title: "逸刻笔记",
		date: "2024-10-28",
		category: "练习",
		tag: "练习 / 移动端、笔记",
		image: "https://www.huohuo90.com:443/files/1730124514106.jpg",
		likes: 20,
		views: 580,
		comments: 2,
		intro: "一款简洁的移动端笔记应用",
		contentImages: [
			"https://www.huohuo90.com:443/files/1730124514106.jpg",
		],
	},
	{
		title: "聊天",
		date: "2024-10-28",
		category: "产品",
		tag: "产品 / 即时通讯",
		image: "https://www.huohuo90.com:443/files/1730123443019.jpg",
		likes: 23,
		views: 650,
		comments: 3,
		intro: "即时通讯聊天室项目展示",
		contentImages: [
			"https://www.huohuo90.com:443/files/1730123443019.jpg",
		],
	},
];

const filters: { label: string; category: string | null }[] = [
	{ label: "全部", category: null },
	{ label: "产品", category: "产品" },
	{ label: "练习", category: "练习" },
];

export function Products() {
	const [activeFilter, setActiveFilter] = useState<string | null>(null);
	const [page, setPage] = useState(1);
	const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
	const totalPages = 2;

	const filteredProducts = activeFilter
		? products.filter((p) => p.category === activeFilter)
		: products;

	const getCounts = (category: string | null) => {
		if (category === null) return products.length;
		return products.filter((p) => p.category === category).length;
	};

	// Lock body scroll when modal is open
	useEffect(() => {
		if (selectedProduct) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [selectedProduct]);

	return (
		<section className="container py-16">
			{/* Title bar */}
			<div className="mb-8">
				<div className="flex items-center gap-3">
					<h2 className="text-2xl font-bold">项目产品</h2>
					<p className="text-sm text-foreground/50">
						设计及开发项目总结，不限于开发完成的项目，包括一些产品概念...
					</p>
				</div>

				{/* Filter tabs */}
				<div className="mt-4 flex gap-3">
					{filters.map((filter) => (
						<button
							key={filter.label}
							type="button"
							className={cn(
								"rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
								activeFilter === filter.category
									? "bg-foreground text-background"
									: "border bg-transparent hover:bg-foreground/5",
							)}
							onClick={() => setActiveFilter(filter.category)}
						>
							{filter.label} {getCounts(filter.category)}
						</button>
					))}
				</div>
			</div>

			{/* Product grid */}
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{filteredProducts.map((product) => (
					<div
						key={product.title}
						className="overflow-hidden rounded-2xl border bg-card transition-shadow hover:shadow-lg"
					>
						{/* Cover image */}
						<div className="h-60 overflow-hidden">
							<img
								src={product.image}
								alt={product.title}
								className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
							/>
						</div>

						{/* Content */}
						<div className="p-5">
							<h3 className="text-lg font-bold">{product.title}</h3>
							<p className="mt-1 text-sm text-foreground/40">{product.date}</p>
							<p className="mt-3 text-sm text-foreground/70">{product.tag}</p>

							<div className="mt-6 flex items-center justify-between">
								<div className="flex items-center gap-1.5 text-foreground/50">
									<HeartIcon className="size-5" />
									<span className="text-sm">{product.likes}</span>
								</div>
								<button
									type="button"
									className="ml-4 w-full rounded-lg border py-2 text-sm font-medium transition-colors hover:bg-foreground/5"
									onClick={() => setSelectedProduct(product)}
								>
									瞧一瞧
								</button>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Pagination */}
			<div className="mt-14 flex items-center justify-center gap-4">
				<button
					type="button"
					className="rounded-full border p-2 transition-colors hover:bg-foreground/5"
					onClick={() => setPage((p) => Math.max(1, p - 1))}
				>
					<ChevronLeftIcon className="size-5" />
				</button>
				<span className="text-sm text-foreground/60">
					{page}/{totalPages}
				</span>
				<button
					type="button"
					className="rounded-full border p-2 transition-colors hover:bg-foreground/5"
					onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
				>
					<ChevronRightIcon className="size-5" />
				</button>
			</div>

			{/* Article detail modal */}
			{selectedProduct && (
				<ArticleModal
					product={selectedProduct}
					onClose={() => setSelectedProduct(null)}
				/>
			)}
		</section>
	);
}

function ArticleModal({
	product,
	onClose,
}: {
	product: Product;
	onClose: () => void;
}) {
	const [liked, setLiked] = useState(false);

	return (
		<div
			role="dialog"
			aria-modal="true"
			className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm"
			onClick={(e) => {
				if (e.target === e.currentTarget) onClose();
			}}
			onKeyDown={(e) => {
				if (e.key === "Escape") onClose();
			}}
		>
			<div className="relative my-12 w-full max-w-3xl rounded-2xl bg-card shadow-2xl">
				{/* Close button */}
				<button
					type="button"
					onClick={onClose}
					className="absolute top-4 right-4 z-10 rounded-full bg-foreground/10 p-2 transition-colors hover:bg-foreground/20"
				>
					<XIcon className="size-5" />
				</button>

				{/* Article content */}
				<div className="p-8 md:p-10">
					{/* Title */}
					<h2 className="text-2xl font-bold">{product.title}</h2>

					{/* Labels */}
					<div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
						<span className="text-sm text-foreground/60">{product.tag}</span>
						<span className="text-sm text-foreground/60">{product.date}</span>
					</div>

					{/* Stats */}
					<div className="mt-3 flex items-center gap-5 text-sm text-foreground/50">
						<span className="flex items-center gap-1.5">
							<HeartIcon className="size-4" />
							{product.likes}
						</span>
						<span className="flex items-center gap-1.5">
							<EyeIcon className="size-4" />
							{product.views}
						</span>
						<span className="flex items-center gap-1.5">
							<MessageSquareIcon className="size-4" />
							{product.comments}
						</span>
					</div>

					{/* Introduction */}
					<div className="mt-6 rounded-xl border bg-foreground/[0.02] px-5 py-4">
						<p className="text-sm text-foreground/70">{product.intro}</p>
					</div>

					{/* Content images */}
					<div className="mt-8 space-y-4">
						{product.contentImages.map((img) => (
							<img
								key={img}
								src={img}
								alt={product.title}
								className="w-full rounded-lg object-cover"
							/>
						))}
					</div>

					{/* Signature */}
					<div className="mt-10 flex items-center gap-3 border-t pt-6">
						<YikeSignIcon className="size-6 text-foreground/40" />
						<div>
							<p className="text-sm font-medium">{product.title}</p>
							<span className="text-xs text-foreground/50">{product.tag}</span>
						</div>
					</div>

					{/* Tool bar */}
					<div className="mt-6 flex items-center gap-6 border-t pt-6">
						<button
							type="button"
							className={cn(
								"flex items-center gap-1.5 text-sm transition-colors",
								liked
									? "text-primary"
									: "text-foreground/50 hover:text-foreground",
							)}
							onClick={() => setLiked(!liked)}
						>
							<HeartIcon
								className={cn("size-5", liked && "fill-primary")}
							/>
							{product.likes + (liked ? 1 : 0)}
						</button>
						<button
							type="button"
							className="flex items-center gap-1.5 text-sm text-foreground/50 transition-colors hover:text-foreground"
						>
							<MessageSquareIcon className="size-5" />
							{product.comments}
						</button>
						<button
							type="button"
							className="flex items-center gap-1.5 text-sm text-foreground/50 transition-colors hover:text-foreground"
						>
							<ShareIcon className="size-5" />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

function YikeSignIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 1280 1024"
			className={className}
			fill="currentColor"
		>
			<title>逸刻时光</title>
			<path d="M1260.166 105.6a20 20 0 0 1 17.248 30.08L868.39 850.4a132.544 132.544 0 0 1-114.944 66.944H488.262a20 20 0 0 1-17.248-30.112L880.07 172.544A132.544 132.544 0 0 1 995.014 105.6h265.152zm-974.976 0c47.392 0 91.2 25.504 114.912 66.88l6.144 10.688 6.144-10.688a132.544 132.544 0 0 1 114.912-66.88h264.576a20 20 0 0 1 17.248 30.08L400.07 850.4a132.544 132.544 0 0 1-114.976 66.944H20.006a20 20 0 0 1-17.248-30.112L217.99 511.648 2.726 135.712a20.192 20.192 0 0 1-2.592-8.544l-.064-1.504c0-11.072 8.928-20.064 19.904-20.064H285.19zm833.28 502.24a20.032 20.032 0 0 1 7.232 7.456l151.744 271.552a20.672 20.672 0 0 1-7.232 27.744 19.232 19.232 0 0 1-9.856 2.72h-304a20 20 0 0 1-19.712-20.32 20.8 20.8 0 0 1 2.656-10.176l152.288-271.552a19.36 19.36 0 0 1 26.88-7.424z" />
		</svg>
	);
}

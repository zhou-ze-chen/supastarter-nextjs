"use client";

import { cn } from "@ui/lib";
import { useState } from "react";

interface GalleryEntry {
	id: string;
	name: string;
	title: string;
	description: string | null;
	image: string | null;
	likes: number;
	views: number;
	date: string;
}

function formatDate(dateStr: string) {
	const d = new Date(dateStr);
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function LikeIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 1024 1024"
			className={className}
			fill="currentColor"
		>
			<title>点赞</title>
			<path d="M76.8 921.6V384h208.998l181.76-311.987a25.6 25.6 0 0 1 34.816-9.344l140.058 80.102a25.6 25.6 0 0 1 11.136 31.54l-61.85 158.182h348.57a25.6 25.6 0 0 1 24.883 31.616L835.302 902.016A25.6 25.6 0 0 1 810.42 921.6H76.8zm179.174-460.8H153.6v384h102.374v-384zM508.34 154.547 332.8 455.86V844.8h437.274l105.164-435.507H479.206l86.733-221.799-57.6-32.947z" />
		</svg>
	);
}

function EyeIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 1024 1024"
			className={className}
			fill="currentColor"
		>
			<title>浏览</title>
			<path d="M512 230.4c199.885 0 373.018 114.534 457.344 281.574C885.044 679.04 711.884 793.6 512 793.6c-199.885 0-373.018-114.534-457.344-281.574C138.956 344.96 312.116 230.4 512 230.4zm0 76.8a434.893 434.893 0 0 0-366.464 200.346l-2.816 4.48 2.816 4.48a434.944 434.944 0 0 0 357.248 200.192l9.216.102c150.682 0 287.488-77.21 366.464-200.346l2.816-4.48-2.816-4.48a434.944 434.944 0 0 0-357.248-200.192L512 307.2zm0 38.4a166.4 166.4 0 1 1 0 332.8 166.4 166.4 0 0 1 0-332.8zm0 76.8a89.6 89.6 0 1 0 0 179.2 89.6 89.6 0 0 0 0-179.2z" />
		</svg>
	);
}

function CommentIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 1024 1024"
			className={className}
			fill="currentColor"
		>
			<title>评论</title>
			<path d="M947.2 128a25.6 25.6 0 0 1 25.6 25.6v640a25.6 25.6 0 0 1-25.6 25.6H484.045L297.42 965.862A25.6 25.6 0 0 1 256 945.741V819.2H76.8a25.6 25.6 0 0 1-25.6-25.6v-640A25.6 25.6 0 0 1 76.8 128h870.4zM896 204.8H128v537.6h204.8v97.971L457.472 742.4H896V204.8zM563.2 537.6v76.8H256v-76.8h307.2zM768 332.8v76.8H256v-76.8h512z" />
		</svg>
	);
}

function YikeSignIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 1024 1024"
			className={className}
			fill="currentColor"
		>
			<title>逸刻时光</title>
			<path d="M369.536 28.416c10.394 8.243 4.07 17.613 0 25.6a1421.67 1421.67 0 0 0-55.322 136.883l-1.894 5.709c-13.491 49.92-23.5 74.931-37.811 129.203-17.152 63.744-33.613 127.232-44.135 192.487-6.476 37.836-17.664 84.224-19.968 122.086 4.583-1.638 21.581-17.1 44.288-32 37.632-24.986 82.304-57.395 114.56-75.315a172.723 172.723 0 0 1 46.439-20.48 13.44 13.44 0 0 1 13.696 3.328c3.584 3.584 4.864 8.909 3.302 13.773a129.126 129.126 0 0 1-16.998 44.21 133.043 133.043 0 0 0-22.81 43.546c-6.093 14.797-27.264 66.74-7.961 44.365 6.4-6.989 12.032-14.669 16.716-22.937 6.221-6.784 9.984-9.626 14.464-1.204 8.09 15.59-30.515 78.388-60.083 91.956-9.037 4.096-13.747 3.404-18.893-3.38a29.985 29.985 0 0 1-7.424-17.51c1.997-12.34 8.295-30.643 15.156-49.92l3.2-8.934 1.612-4.48 3.175-8.96c12.979-37.095 22.835-70.733 3.072-65.536-27.008 6.528-98.15 67.02-142.669 114.099l-15.795 18.176c-.947 36.48-12.288 71.757-15.54 108.544-3.635 41.881-9.727 83.533-10.495 125.85-.282 13.44 4.3 31.334-12.16 37.043-19.456 6.656-44.954-42.19-51.303-50.996-16.051-27.136-21.58-52.915-35.072-80.05-5.273-11.111-5.939-26.164-13.517-36.609a77.926 77.926 0 0 1-7.552-35.149c2.56-16 84.634-75.545 98.125-87.347 6.451-5.913 14.9-14.233 19.482-18.816l3.328-3.302s2.97-15.744 4.864-31.053c1.869-15.36-4.199-7.731-11.623 0-18.355 18.97-32.921 41.78-53.99 60.493-4.045 1.766-9.293 0-13.491 0C78.54 680.934 77.056 670.77 83.66 648.78a596.75 596.75 0 0 0 12.544-62.541c1.894-20.326 4.07-40.704 5.273-61.03a104.448 104.448 0 0 0-1.203-29.03 30.515 30.515 0 0 0-13.85-20.583 30.234 30.234 0 0 0-24.499-3.43 137.717 137.717 0 0 1-18.739 3.942 17.536 17.536 0 0 1-17.971-11.392 15.232 15.232 0 0 1 5.683-17.51c17.664-12.34 37.12-23.04 59.392-18.049 23.066 4.352 40.704 23.245 43.571 46.67a256.287 256.287 0 0 1 7.578 53.452 347.315 347.315 0 0 1-7.578 69.453c.41 11.11 12.442-.82 16.487-6.784a420.787 420.787 0 0 0 65.715-166.451c.947-5.274 2.304-10.445 3.507-15.719 11.623-42.06 22.963-84.121 34.816-126.029 4.352-15.334 15.949-52.019 15.949-60.697a283.724 283.724 0 0 1 12.416-49.51c10.726-30.413 19.712-61.39 27.008-92.8a108.57 108.57 0 0 1 30.9-48.282 20.992 20.992 0 0 1 28.876-4.07zm-209.894 696.32a514.464 514.464 0 0 0-66.816 54.272 25.472 25.472 0 0 0-3.226 25.907 407.04 407.04 0 0 0 43.469 63.232c0-.153 3.225-8.55 3.225-8.55 12.544-23.194 10.932-49.92 15.258-74.88.947-5.837 1.894-12.903 2.97-19.405 1.075-7.731 4.736-32.691 5.12-40.55zM566.784 295.68a20.275 20.275 0 0 1 0 30.336c-12.186 11.622-13.26 16.691-21.99 38.349-19.303 48.23-28.928 99.789-42.343 149.76a18951.169 18951.169 0 0 0-15.949 73.728c-1.484 7.219-2.816 14.413-4.147 21.632-2.97 15.897 6.298 20.045 19.712 20.045a228.66 228.66 0 0 0 46.49-47.156c28.544-31.667 43.571-54.784 70.374-81.484a25.882 25.882 0 0 1 37.274-5.095c17.664 8.832-4.173 31.667-11.264 40.09-19.303 22.451-12.211 14.157-36.199 40.064-19.456 20.454-45.312 49.843-67.02 71.065a772.2 772.2 0 0 0 124.518-22.553c6.17-1.869 17.408-7.757 18.227-1.869a56.576 56.576 0 0 1 0 15.744 45.158 45.158 0 0 1-4.557 16.845 16.051 16.051 0 0 0-1.715 3.072 588.544 588.544 0 0 1 42.445-38.042l-1.638-3.379c-7.936-13.414-26.164-11.827-36.096-19.072-10.701-7.782-28.416-10.394-24.423-29.414 2.611-12.442 13.44-13.261 39.373-4.224 2.048.665 4.25 1.356 6.17 2.176 50.304 21.376 72.704-7.245 81.126-19.636l1.638-2.457a12.34 12.34 0 0 1 2.048-2.663c41.6-50.099 94.157-58.035 153.421-39.27 12.493 4.096 24.013 9.984 24.013 26.394 3.84 27.904-11.11 45.03-33.46 57.6a173.1 173.1 0 0 1-71.09 21.76c-18.253 1.382-36.506 5.478-54.887 6.86-36.25 2.586-63.539 24.064-85.504 47.744-4.787 5.12-10.163 10.65-15.539 16.23l-6.451 6.76c-16.999 18.047-31.744 36.095-25.088 46.105 29.363 17.51 79.616 6.835 118.297-9.856 70.656-30.208 132.301-57.19 185.114-126.976 15.36-20.224 26.214-6.963 20.326 13.005-12.774 42.137-45.568 68.403-79.334 91.955-58.88 40.371-122.547 68.966-197.325 72.243a117.786 117.786 0 0 1-54.349-6.016 39.27 39.27 0 0 1-28.825-42.982c3.02-18.458 11.136-27.648 24.832-49.255l4.096-4.3a10.598 10.598 0 0 1-5.376-2.202 573.176 573.176 0 0 0-135.424 18.56 51.584 51.584 0 0 0-40.192 31.923 89.226 89.226 0 0 1-25.19 32.205c-4.685 4.403-8.986 9.472-16.359 6.528a17.229 17.229 0 0 1-11.136-17.613c1.74-28.595 2.15-57.446 6.451-85.632a256 256 0 0 1 15.821-71.22l2.637-15c4.25-25.089 7.731-50.356 14.771-74.625 9.267-31.667 17.306-63.18 24.397-95.385 5.888-27.776 22.784-52.48 26.803-81.204a72.078 72.078 0 0 1 13.414-20.172c6.298-4.02 20.788-8.832 29.082 0zm340.634 231.629c-37.325 12.16-76.288 19.149-103.066 52.94 43.776-2.175 82.33-13.823 109.773-50.764zM427.52 411.366c6.016 7.757 7.5 18.51 3.789 27.802-4.352 12.186-14.592 20.787-26.624 22.4a31.974 31.974 0 0 1-30.925-14.643 31.386 31.386 0 0 1 1.229-30.464c15.027-19.661 35.917-23.066 52.531-5.095z" />
		</svg>
	);
}

export function GalleryPage({ entries }: { entries: GalleryEntry[] }) {
	// Build dynamic filters from entries
	const categories = Array.from(new Set(entries.map((e) => e.name)));
	const filters = [
		{ label: "全部", count: entries.length, value: "all" },
		...categories.map((cat) => ({
			label: cat,
			count: entries.filter((e) => e.name === cat).length,
			value: cat,
		})),
	];

	const [activeFilter, setActiveFilter] = useState("all");

	const filteredItems =
		activeFilter === "all"
			? entries
			: entries.filter((item) => item.name === activeFilter);

	if (entries.length === 0) {
		return (
			<div className="container max-w-5xl pt-32 pb-16">
				<p className="py-20 text-center text-foreground/40">暂无图库内容</p>
			</div>
		);
	}

	return (
		<div className="container max-w-5xl pt-32 pb-16">
			{/* Filter bar */}
			{categories.length > 1 && (
				<div className="mb-8 flex items-center gap-2">
					{filters.map((f) => (
						<button
							key={f.value}
							type="button"
							onClick={() => setActiveFilter(f.value)}
							className={cn(
								"rounded-full px-5 py-2 text-sm font-medium transition-colors",
								activeFilter === f.value
									? "bg-foreground text-background"
									: "border bg-transparent hover:bg-foreground/5",
							)}
						>
							{f.label} {f.count}
						</button>
					))}
				</div>
			)}

			{/* Article list */}
			<div className="flex flex-col gap-10">
				{filteredItems.map((item) => (
					<article
						key={item.id}
						className="overflow-hidden rounded-2xl border bg-card"
					>
						{/* Article title */}
						<div className="px-6 pt-6">
							<h2 className="text-xl font-bold">{item.title}</h2>
						</div>

						{/* Labels: category / name + date */}
						<div className="px-6 pt-3">
							<div className="flex flex-wrap items-center gap-x-4 gap-y-2">
								<div className="flex items-center gap-2">
									<span className="text-sm text-foreground/50">
										{item.name}
									</span>
									<span className="text-sm text-foreground/50">
										{formatDate(item.date)}
									</span>
								</div>
								<div className="flex items-center gap-3">
									<span className="flex items-center gap-1 text-xs text-foreground/40">
										<LikeIcon className="size-3.5" />
										{item.likes}
									</span>
									<span className="flex items-center gap-1 text-xs text-foreground/40">
										<EyeIcon className="size-3.5" />
										{item.views}
									</span>
									<span className="flex items-center gap-1 text-xs text-foreground/40">
										<CommentIcon className="size-3.5" />
										0
									</span>
								</div>
							</div>
						</div>

						{/* Description */}
						{item.description && (
							<div className="px-6 pt-4">
								<p className="text-sm leading-relaxed text-foreground/70">
									{item.description}
								</p>
							</div>
						)}

						{/* Image */}
						{item.image && (
							<div className="px-6 pt-4">
								<img
									src={item.image}
									alt={item.title}
									className="w-full rounded-lg object-cover"
								/>
							</div>
						)}

						{/* Signature */}
						<div className="flex items-center gap-3 px-6 pt-6 pb-2">
							<YikeSignIcon className="size-6 text-foreground/20" />
							<div>
								<p className="text-sm font-medium text-foreground/60">
									{item.title}
								</p>
								<span className="text-xs text-foreground/40">{item.name}</span>
							</div>
						</div>

						{/* Tool bar */}
						<div className="flex items-center gap-6 border-t px-6 py-3">
							<button
								type="button"
								className="flex items-center gap-1.5 text-sm text-foreground/50 transition-colors hover:text-foreground"
							>
								<LikeIcon className="size-4" />
								<span>{item.likes}</span>
							</button>
							<button
								type="button"
								className="flex items-center gap-1.5 text-sm text-foreground/50 transition-colors hover:text-foreground"
							>
								<CommentIcon className="size-4" />
								<span>0</span>
							</button>
						</div>
					</article>
				))}
			</div>

			{/* Bottom text */}
			<div className="mt-14 flex justify-center">
				<span className="text-sm text-foreground/40">已经到底了</span>
			</div>
		</div>
	);
}

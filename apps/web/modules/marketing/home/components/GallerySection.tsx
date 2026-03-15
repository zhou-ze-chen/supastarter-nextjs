"use client";

import { cn } from "@ui/lib";
import { CameraIcon, HeartIcon } from "lucide-react";
import { useState } from "react";

const photos: {
	src: string;
	title: string;
	location: string;
	likes: number;
	aspect: "portrait" | "landscape" | "square";
}[] = [
	{
		src: "https://www.huohuo90.com:443/files/1730124974492.jpg",
		title: "城市黄昏",
		location: "重庆",
		likes: 45,
		aspect: "landscape",
	},
	{
		src: "https://www.huohuo90.com:443/files/1730124514106.jpg",
		title: "街角咖啡",
		location: "成都",
		likes: 38,
		aspect: "portrait",
	},
	{
		src: "https://www.huohuo90.com:443/files/1730123443019.jpg",
		title: "晨光",
		location: "大理",
		likes: 56,
		aspect: "landscape",
	},
	{
		src: "https://www.huohuo90.com:443/files/1730903826171.png",
		title: "云端",
		location: "丽江",
		likes: 32,
		aspect: "square",
	},
	{
		src: "https://www.huohuo90.com:443/files/1730194963224.png",
		title: "夜色阑珊",
		location: "上海",
		likes: 41,
		aspect: "portrait",
	},
	{
		src: "https://www.huohuo90.com:443/files/1730194869888.png",
		title: "春日漫步",
		location: "杭州",
		likes: 29,
		aspect: "landscape",
	},
];

export function GallerySection() {
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

	return (
		<section id="gallery" className="container py-16">
			{/* Title */}
			<div className="mb-8">
				<div className="flex items-center gap-3">
					<h2 className="text-2xl font-bold">摄影图库</h2>
					<p className="text-sm text-foreground/50">
						用镜头记录生活的美好瞬间...
					</p>
				</div>
			</div>

			{/* Masonry-like grid */}
			<div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
				{photos.map((photo, index) => (
					<div
						key={photo.title}
						className="group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl border bg-card"
						onMouseEnter={() => setHoveredIndex(index)}
						onMouseLeave={() => setHoveredIndex(null)}
					>
						<div
							className={cn(
								"overflow-hidden",
								photo.aspect === "portrait" && "h-80",
								photo.aspect === "landscape" && "h-52",
								photo.aspect === "square" && "h-64",
							)}
						>
							<img
								src={photo.src}
								alt={photo.title}
								className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
							/>
						</div>

						{/* Overlay */}
						<div
							className={cn(
								"absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent p-4 transition-opacity duration-300",
								hoveredIndex === index
									? "opacity-100"
									: "opacity-0",
							)}
						>
							<h4 className="text-base font-bold text-white">
								{photo.title}
							</h4>
							<div className="mt-1 flex items-center justify-between">
								<span className="flex items-center gap-1 text-xs text-white/70">
									<CameraIcon className="size-3" />
									{photo.location}
								</span>
								<span className="flex items-center gap-1 text-xs text-white/70">
									<HeartIcon className="size-3" />
									{photo.likes}
								</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

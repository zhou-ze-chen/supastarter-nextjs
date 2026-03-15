"use client";

import {
	ArticleOverlay,
	type ArticleData,
} from "@marketing/blog/components/ArticleOverlay";
import {
	tiptapJsonToHtml,
	tiptapJsonToText,
} from "@saas/shared/lib/tiptapRenderer";
import { cn } from "@ui/lib";
import { EyeIcon, MessageSquareIcon } from "lucide-react";
import { useState } from "react";

interface NoteTag {
	id: string;
	name: string;
}

interface PublishedNote {
	id: string;
	title: string;
	content: unknown;
	imageUrl: string | null;
	description: string | null;
	published: boolean;
	noteTagId: string;
	noteTag: NoteTag;
	createdAt: string;
	updatedAt: string;
}

const blogPosts: {
	title: string;
	date: string;
	summary: string;
	content: string;
	category: string;
	tag: string;
	comments: number;
	views: number;
	image: string;
}[] = [
	{
		title: "西北大环线第七天",
		date: "2024-10-28",
		summary: "祁连——阿柔大寺——门源菜花——西宁",
		category: "旅行",
		tag: "西北大环线",
		comments: 8,
		views: 368,
		image: "https://www.huohuo90.com:443/files/1730120546231.jpg",
		content: `<p>今天从祁连出发，都忘了今天是在哪里吃的早餐，只记得早上起来天气微凉，空气清新，很舒服。今天的景点很少。我们没有去阿柔大寺，上午途中经过一个赛马场，停车去逛了一圈，人很多。听说下午有举行赛马。</p>
<p><img src="https://www.huohuo90.com:3000/files/1730120380669.jpg" alt="赛马场" style="max-width:100%;border-radius:8px;margin:12px 0" /></p>
<p>这里也可以看到一点雪山。</p>
<p><img src="https://www.huohuo90.com:3000/files/1730120395414.jpg" alt="雪山" style="max-width:100%;border-radius:8px;margin:12px 0" /></p>
<p>天气很好，这里的山上长满野花，紫的/粉的/黄的较多。有些人在山上摘野花，也有人坐在山上看人来人往的我们。</p>
<p>山边围着铁丝网，山上大多是当地人。一些人把摘来的野花编织成头上戴的花环。后来我问人手中拿着一簇的小花叫什么，他说他们那叫满天星。</p>
<p>赛马是在下午，上午这时已经有很多马匹和选手在赛场。马有高有矮相差好大，选手看着也是有装束专业和平常随意的。不过高大的马还真高，四条腿修长，一看就是能跑的。赛马场我们没有长留，转了一圈就走了。</p>
<p>门源油菜花，又到了看油菜花的地方了。再好好看看油菜花吧，这大片大片的黄色油菜花田。</p>
<p>今天有一段路上的景色很美，路过一些村落的油菜花更让人向往，感觉很惬意。村落被遍野的油菜花包围着，不是很高的后山，蓝天上飘着大朵大朵的白云。</p>
<p>下午很早我们就回到了西宁，热情的小东哥请我们吃了餐正宗的烤串，好吃。晚上坐车回到兰州，到此本趟为期7天的旅游结束。</p>
<p>愿有机会再走一次。</p>`,
	},
	{
		title: "西北大环线第六天",
		date: "2024-10-28",
		summary: "张掖——扁都口——祁连大草原——祁连卓尔山",
		category: "旅行",
		tag: "西北大环线",
		comments: 0,
		views: 152,
		image: "https://www.huohuo90.com:443/files/1730119896318.jpg",
		content: "<p>张掖——扁都口——祁连大草原——祁连卓尔山</p>",
	},
	{
		title: "西北大环线第五天",
		date: "2024-10-28",
		summary: "敦煌——瓜州——嘉峪关城楼——张掖七彩丹霞",
		category: "旅行",
		tag: "西北大环线",
		comments: 0,
		views: 57,
		image: "https://www.huohuo90.com:443/files/1730118792464.jpg",
		content: "<p>敦煌——瓜州——嘉峪关城楼——张掖七彩丹霞</p>",
	},
	{
		title: "西北大环线第四天",
		date: "2024-10-28",
		summary: "莫高窟——鸣沙山月牙泉——敦煌",
		category: "旅行",
		tag: "西北大环线",
		comments: 0,
		views: 45,
		image: "https://www.huohuo90.com:443/files/1730118560069.jpg",
		content: "<p>莫高窟——鸣沙山月牙泉——敦煌</p>",
	},
	{
		title: "西北大环线第三天",
		date: "2024-10-27",
		summary: "大柴旦——南八仙雅丹——当金山——阿克塞石油小镇——敦煌",
		category: "旅行",
		tag: "西北大环线",
		comments: 0,
		views: 32,
		image: "https://www.huohuo90.com:443/files/1730016033382.jpg",
		content: "<p>大柴旦——南八仙雅丹——当金山——阿克塞石油小镇——敦煌</p>",
	},
	{
		title: "西北大环线第二天",
		date: "2024-10-27",
		summary: "黑马河——茶卡盐湖——翡翠湖——大柴旦",
		category: "旅行",
		tag: "西北大环线",
		comments: 0,
		views: 39,
		image: "https://www.huohuo90.com:443/files/1730015309314.jpg",
		content: "<p>黑马河——茶卡盐湖——翡翠湖——大柴旦</p>",
	},
	{
		title: "西北大环线第一天",
		date: "2024-10-27",
		summary: "西宁——塔尔寺——拉脊山——青海湖——黑马河",
		category: "旅行",
		tag: "西北大环线",
		comments: 0,
		views: 65,
		image: "https://www.huohuo90.com:443/files/1730124974492.jpg",
		content: "<p>西宁——塔尔寺——拉脊山——青海湖——黑马河</p>",
	},
];

interface UnifiedPost {
	id: string;
	title: string;
	date: string;
	summary: string;
	content: string;
	category: string;
	tag: string;
	comments: number;
	views: number;
	likes: number;
	image: string | null;
}

function notesToUnified(notes: PublishedNote[]): UnifiedPost[] {
	return notes.map((note) => ({
		id: `note-${note.id}`,
		title: note.title,
		date: new Date(note.createdAt).toISOString().slice(0, 10),
		summary: note.description || tiptapJsonToText(note.content).slice(0, 100),
		content: tiptapJsonToHtml(note.content),
		category: note.noteTag.name,
		tag: note.noteTag.name,
		comments: 0,
		views: 0,
		likes: 0,
		image: note.imageUrl,
	}));
}

function hardcodedToUnified(posts: typeof blogPosts): UnifiedPost[] {
	return posts.map((post, i) => ({
		id: `blog-${i}`,
		title: post.title,
		date: post.date,
		summary: post.summary,
		content: post.content,
		category: post.category,
		tag: post.tag,
		comments: post.comments,
		views: post.views,
		likes: 5,
		image: post.image,
	}));
}

export function BlogSection({
	publishedNotes = [],
}: {
	publishedNotes?: PublishedNote[];
}) {
	const [activeFilter, setActiveFilter] = useState("all");
	const [selectedArticle, setSelectedArticle] = useState<ArticleData | null>(
		null,
	);

	const allPosts = [
		...notesToUnified(publishedNotes),
		...hardcodedToUnified(blogPosts),
	];

	const categoryCount = new Map<string, number>();
	for (const post of allPosts) {
		categoryCount.set(
			post.category,
			(categoryCount.get(post.category) || 0) + 1,
		);
	}
	const filters = [
		{ label: "全部", count: allPosts.length, value: "all" },
		...Array.from(categoryCount.entries()).map(([cat, count]) => ({
			label: cat,
			count,
			value: cat,
		})),
	];

	const filteredPosts =
		activeFilter === "all"
			? allPosts
			: allPosts.filter((p) => p.category === activeFilter);

	return (
		<section className="container py-16">
			{/* Title bar */}
			<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-3">
					<h2 className="text-2xl font-bold">最新文章</h2>
					<p className="text-sm text-foreground/50">
						记录生活的点点滴滴...
					</p>
				</div>
				<div className="flex items-center gap-2">
					{filters.map((f) => (
						<button
							key={f.value}
							type="button"
							onClick={() => setActiveFilter(f.value)}
							className={cn(
								"rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
								activeFilter === f.value
									? "bg-foreground text-background"
									: "border bg-transparent hover:bg-foreground/5",
							)}
						>
							{f.label} {f.count}
						</button>
					))}
				</div>
			</div>

			{/* Blog list */}
			<div className="flex flex-col gap-6">
				{filteredPosts.map((post) => (
					<button
						type="button"
						key={post.id}
						onClick={() => setSelectedArticle(post)}
						className="group rounded-2xl border bg-card p-5 text-left transition-shadow hover:shadow-lg"
					>
						<div className="flex flex-col gap-4 sm:flex-row sm:items-start">
							{/* Cover image - overlapping top effect */}
							{post.image && (
								<div className="-mt-10 h-[120px] w-full shrink-0 overflow-hidden rounded-xl sm:w-[160px]">
									<img
										src={post.image}
										alt={post.title}
										className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
									/>
								</div>
							)}

							{/* Title + date */}
							<div className="flex flex-col gap-1 pt-0 sm:pt-4">
								<h3 className="text-base font-bold transition-colors group-hover:text-primary">
									{post.title}
								</h3>
								<span className="text-xs text-foreground/40">
									{post.date}
								</span>
							</div>
						</div>

						{/* Summary */}
						<p className="mt-3 text-sm text-foreground/60">{post.summary}</p>

						{/* Footer */}
						<div className="mt-3 flex items-center justify-between">
							<span className="text-xs text-foreground/50">
								{post.category} / {post.tag}
							</span>
							<div className="flex items-center gap-4 text-xs text-foreground/40">
								<span className="flex items-center gap-1">
									<MessageSquareIcon className="size-3.5" />
									{post.comments}
								</span>
								<span className="flex items-center gap-1">
									<EyeIcon className="size-3.5" />
									{post.views}
								</span>
							</div>
						</div>
					</button>
				))}
			</div>

			{/* Bottom text */}
			<div className="mt-8 flex justify-center">
				<span className="text-sm text-foreground/40">已经到底了</span>
			</div>

			{/* Article overlay */}
			<ArticleOverlay
				article={selectedArticle}
				onClose={() => setSelectedArticle(null)}
			/>
		</section>
	);
}

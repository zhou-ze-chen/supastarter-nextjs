"use client";

import { useState } from "react";

export function AboutPage() {
	const [showMore, setShowMore] = useState(false);

	return (
		<div className="container max-w-5xl pt-32 pb-16">
			{/* About story */}
			<div className="mx-auto max-w-3xl">
				<h2 className="mb-8 text-2xl font-bold">关于逸刻时光</h2>

				<div className="space-y-6 text-foreground/80 leading-relaxed">
					<p>
						这是博客，所以大致会从建设这个博客说起。我一直希望有一块完全属于自己的空间，可以在这块空间里按照自己的想法，去不被限制情境和主题的存放我自己。用我的方式去分享、去展示自己。当然我是一个良好公民，分享的内容一定会在合乎规范之内。你会说那么多好用的便捷的平台、圈子、论坛…可是我并不是一个善于分享的人，是又那么期望这些是按照自己的方式和节奏去记录、去存放、去留下脚印。任何一个平台都有他们的规则。那么我就应该脱离这一切，去创造这一方只属于我的天地，我的博客正是脱离这些平台的天地。她纵使有无数的缺点，但她只属于我。当然也幸运于自己会一些前端并坚持一直保有兴趣，我的想法最后能得偿所愿，如现在你所见。
					</p>
					<p>
						我好想在这里记录下我的一切，特别是那些还能久久停留在脑海里的记忆。或许在慢慢的时间流逝中他们终会模糊并被抹去。我想把他们记录成文字，留在这方天地间。不要说我矫情、偏执或者自恋，可这里是只属于我的哈哈哈～
					</p>
				</div>

				{/* Photo card */}
				<div className="mt-14">
					<div className="inline-block overflow-hidden rounded-xl shadow-lg">
						<div
							className="h-52 w-52 bg-cover bg-center"
							style={{
								backgroundImage:
									"url(https://www.huohuo90.com/images/about/yike.jpg)",
							}}
						/>
						<p className="bg-card py-2 text-center text-sm font-medium">
							YIKE
						</p>
					</div>
				</div>

				{/* Show more */}
				<div className="mt-10">
					<button
						type="button"
						onClick={() => setShowMore(!showMore)}
						className="rounded-full border px-6 py-2 text-sm font-medium transition-colors hover:bg-foreground/5"
					>
						{showMore ? "收起" : "查看更多"}
					</button>
					{showMore && (
						<p className="mt-4 text-sm text-foreground/50">
							持续更新中～
						</p>
					)}
				</div>
			</div>
		</div>
	);
}

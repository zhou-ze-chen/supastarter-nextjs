"use client";

import { useEffect, useState } from "react";

const carouselItems: {
	title: string;
	subtitle: string;
	description: string;
	image: string;
	primaryBtn: string;
	secondaryBtn: string;
}[] = [
	{
		title: "莱卡云",
		subtitle: "致力于提供稳定可靠、安全可信、可持续创新的云服务",
		description:
			"莱卡云专注于基础云计算，游戏云等业务，采用BGP多线接入，直连中国电信CN2网络，强力保证为客户提供优质稳定的网络资源与机房服务。",
		image: "https://www.huohuo90.com:443/files/1730903826171.png",
		primaryBtn: "立即选购",
		secondaryBtn: "进入官网",
	},
	{
		title: "Yike Design",
		subtitle: "Vue3+Ts+Less 开发的前端UI框架",
		description:
			"一套简洁干净的前端UI框架。从源码出发，提供便捷的源码配置，单个组件自由组合成专属UI库，为服务于交互与展示。",
		image: "https://www.huohuo90.com:443/files/1730194963224.png",
		primaryBtn: "官方网址",
		secondaryBtn: "github仓库",
	},
	{
		title: "一刻时光留言墙，留下你的足迹",
		subtitle: "当下的心情，就让它留在当下吧～",
		description:
			"如您对留言墙感兴趣，欢迎来留言。需要查看设计稿和下载切图的同学，点击下方设计稿入口查阅。详细视频请访问b站。",
		image: "https://www.huohuo90.com:443/files/1730194869888.png",
		primaryBtn: "去留言～",
		secondaryBtn: "访问设计稿",
	},
	{
		title: "vue+node.js 0到1实现即时通讯聊天室",
		subtitle: "单聊、群聊 可发送文字、表情、图片、语音、位置、语音通话、视频通话...",
		description:
			"详细开发过程视频请访问b站，设计稿统一放入codesign，访问密码 \" yike \"",
		image: "https://www.huohuo90.com:443/files/1730194898125.png",
		primaryBtn: "访问设计稿",
		secondaryBtn: "学习视频",
	},
];

export function HomeData() {
	const [activeIndex, setActiveIndex] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setActiveIndex((prev) => (prev + 1) % carouselItems.length);
		}, 5000);
		return () => clearInterval(timer);
	}, []);

	const currentItem = carouselItems[activeIndex];

	return (
		<section className="container py-20">
			<div className="flex flex-col gap-8 lg:flex-row">
				{/* Left: Stats */}
				<div className="flex flex-col gap-6 lg:w-64">
					<div
						className="rounded-2xl p-6"
						style={{
							backgroundImage:
								"linear-gradient(121deg, rgba(186, 255, 16, 0.1) 0%, rgba(255, 37, 243, 0.09) 100%)",
						}}
					>
						<p className="text-3xl font-bold">77706</p>
						<p className="mt-1 text-sm text-foreground/60">总访问量</p>
					</div>
					<div
						className="rounded-2xl p-6"
						style={{
							backgroundImage:
								"linear-gradient(121deg, rgba(255, 57, 244, 0.1) 0%, rgba(45, 86, 255, 0.1) 100%)",
						}}
					>
						<p className="text-3xl font-bold">17</p>
						<p className="mt-1 text-sm text-foreground/60">今日访问</p>
					</div>
				</div>

				{/* Right: Carousel */}
				<div className="flex-1 overflow-hidden rounded-2xl border bg-card">
					<div className="relative h-full min-h-[360px]">
						{/* Carousel content */}
						<div
							className="flex h-full transition-transform duration-500 ease-in-out"
							style={{ transform: `translateX(-${activeIndex * 100}%)` }}
						>
							{carouselItems.map((item) => (
								<div
									key={item.title}
									className="relative min-w-full"
								>
									{/* Full-bleed image */}
									<img
										src={item.image}
										alt={item.title}
										className="h-full w-full object-cover"
									/>
									{/* Text overlay in top-left */}
									<div className="absolute top-0 left-0 max-w-sm p-6 md:p-8">
										<h3 className="text-xl font-bold text-foreground">{item.title}</h3>
										<p className="mt-2 text-sm text-foreground/70">
											{item.subtitle}
										</p>
										<p className="mt-3 text-sm text-foreground/50 line-clamp-2">
											{item.description}
										</p>
										<div className="mt-4 flex gap-3">
											<button
												type="button"
												className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-opacity hover:opacity-80"
											>
												{item.primaryBtn}
											</button>
											<button
												type="button"
												className="rounded-full border px-5 py-2 text-sm font-medium transition-colors hover:bg-foreground/5"
											>
												{item.secondaryBtn}
											</button>
										</div>
									</div>
								</div>
							))}
						</div>

						{/* Dots indicator */}
						<div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
							{carouselItems.map((item, i) => (
								<button
									key={item.title}
									type="button"
									className={`h-1.5 rounded-full transition-all duration-300 ${
										i === activeIndex
											? "w-8 bg-primary"
											: "w-3 bg-foreground/20"
									}`}
									onClick={() => setActiveIndex(i)}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

"use client";

import { LocaleLink, useLocalePathname } from "@i18n/routing";
import { ColorModeToggle } from "@shared/components/ColorModeToggle";
import { cn } from "@ui/lib";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

export function NavBar() {
	const localePathname = useLocalePathname();
	const [isTop, setIsTop] = useState(true);

	const debouncedScrollHandler = useDebounceCallback(
		() => {
			setIsTop(window.scrollY <= 10);
		},
		150,
		{ maxWait: 150 },
	);

	useEffect(() => {
		window.addEventListener("scroll", debouncedScrollHandler);
		debouncedScrollHandler();
		return () => {
			window.removeEventListener("scroll", debouncedScrollHandler);
		};
	}, [debouncedScrollHandler]);

	const menuItems: { label: string; href: string }[] = [
		{ label: "首页", href: "/" },
		{ label: "文章", href: "/blog" },
		{ label: "随记", href: "/diary" },
		{ label: "图库", href: "/gallery" },
		{ label: "关于", href: "/about" },
	];

	const isMenuItemActive = (href: string) => {
		if (href === "/") return localePathname === "/";
		return localePathname.startsWith(href);
	};

	return (
		<nav
			className={cn(
				"fixed top-0 left-0 z-50 w-full transition-all duration-300",
				!isTop
					? "bg-card/80 shadow-sm backdrop-blur-lg"
					: "bg-transparent",
			)}
			data-test="navigation"
		>
			<div className="container">
				<div className="flex items-center justify-between gap-6 py-4">
					{/* Logo */}
					<LocaleLink
						href="/"
						className="block shrink-0 hover:no-underline active:no-underline"
					>
						<YikeLogo className="h-8 w-auto text-primary" />
					</LocaleLink>

					{/* Menu */}
					<div className="hidden items-center gap-12 lg:flex">
						{menuItems.map((item) => (
							<LocaleLink
								key={item.href}
								href={item.href}
								className={cn(
									"text-sm font-medium transition-colors",
									isMenuItemActive(item.href)
										? "font-bold text-foreground"
										: "text-foreground/70 hover:text-foreground",
								)}
								prefetch
							>
								{item.label}
							</LocaleLink>
						))}
					</div>

					{/* Right: Search + Theme Toggle */}
					<div className="flex items-center gap-3">
						<div className="relative hidden sm:block">
							<input
								type="text"
								placeholder="文章/图库/日记/资源"
								className="h-9 w-48 rounded-lg border bg-transparent px-3 pr-8 text-sm outline-none transition-colors focus:border-primary"
							/>
							<SearchIcon className="absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-foreground/40" />
						</div>
						<ColorModeToggle />
					</div>
				</div>
			</div>
		</nav>
	);
}

function YikeLogo({ className }: { className?: string }) {
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

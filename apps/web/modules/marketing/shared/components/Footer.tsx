import { LocaleLink } from "@i18n/routing";

export function Footer() {
	return (
		<footer className="border-t py-8 text-foreground/60 text-sm">
			<div className="container flex flex-col items-center gap-4 md:flex-row md:justify-between">
				<div className="flex items-center gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 1280 1024"
						className="h-6 w-auto text-primary"
						fill="currentColor"
					>
						<title>逸刻时光</title>
						<path d="M1260.166 105.6a20 20 0 0 1 17.248 30.08L868.39 850.4a132.544 132.544 0 0 1-114.944 66.944H488.262a20 20 0 0 1-17.248-30.112L880.07 172.544A132.544 132.544 0 0 1 995.014 105.6h265.152zm-974.976 0c47.392 0 91.2 25.504 114.912 66.88l6.144 10.688 6.144-10.688a132.544 132.544 0 0 1 114.912-66.88h264.576a20 20 0 0 1 17.248 30.08L400.07 850.4a132.544 132.544 0 0 1-114.976 66.944H20.006a20 20 0 0 1-17.248-30.112L217.99 511.648 2.726 135.712a20.192 20.192 0 0 1-2.592-8.544l-.064-1.504c0-11.072 8.928-20.064 19.904-20.064H285.19zm833.28 502.24a20.032 20.032 0 0 1 7.232 7.456l151.744 271.552a20.672 20.672 0 0 1-7.232 27.744 19.232 19.232 0 0 1-9.856 2.72h-304a20 20 0 0 1-19.712-20.32 20.8 20.8 0 0 1 2.656-10.176l152.288-271.552a19.36 19.36 0 0 1 26.88-7.424z" />
					</svg>
					<span className="font-medium text-foreground">逸刻时光</span>
				</div>

				<div className="flex items-center gap-6">
					<LocaleLink href="/" className="hover:text-foreground">
						首页
					</LocaleLink>
					<LocaleLink href="/blog" className="hover:text-foreground">
						文章
					</LocaleLink>
					<LocaleLink href="/#diary" className="hover:text-foreground">
						随记
					</LocaleLink>
					<LocaleLink href="/#gallery" className="hover:text-foreground">
						图库
					</LocaleLink>
					<LocaleLink href="/#about" className="hover:text-foreground">
						关于
					</LocaleLink>
				</div>

				<p className="text-xs opacity-70">
					© {new Date().getFullYear()} 逸刻时光. All rights reserved.
				</p>
			</div>
		</footer>
	);
}

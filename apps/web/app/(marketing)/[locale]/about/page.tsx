import { AboutPage } from "@marketing/about/components/AboutPage";

export async function generateMetadata() {
	return {
		title: "关于 - 逸刻时光",
	};
}

export default async function AboutRoute() {
	return <AboutPage />;
}

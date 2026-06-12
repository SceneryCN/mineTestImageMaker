import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
	variable: "--font-outfit",
	subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
	variable: "--font-jetbrains",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "JLImage",
	description: "JLImage — 智能对话 · 一键生图 · 实时修正",
	applicationName: "JLImage",
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: "#07070d",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="zh-CN"
			className={`${outfit.variable} ${jetbrainsMono.variable} h-full`}
		>
			<body className="relative flex min-h-[100dvh] flex-col antialiased">
				{children}
			</body>
		</html>
	);
}

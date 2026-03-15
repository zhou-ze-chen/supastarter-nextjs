"use client";

import type { JSONContent } from "@tiptap/react";
import { EditorContent, Mark, mergeAttributes, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
	Bold,
	Heading2,
	HighlighterIcon,
	Italic,
	List,
	ListOrdered,
	Quote,
	SmileIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// 内联定义 Highlight Mark，避免导入 @tiptap/extension-highlight 包
// 该包的模块格式与 Next.js RSC 不兼容，会导致 "Cannot access toStringTag on the server" 错误
const CustomHighlight = Mark.create({
	name: "highlight",
	addOptions() {
		return { multicolor: true, HTMLAttributes: {} };
	},
	addAttributes() {
		return {
			color: {
				default: null,
				parseHTML: (element: HTMLElement) =>
					element.getAttribute("data-color") ||
					element.style.backgroundColor,
				renderHTML: (attributes: Record<string, string | null>) => {
					if (!attributes.color) {
						return {};
					}
					return {
						"data-color": attributes.color,
						style: `background-color: ${attributes.color}; color: inherit`,
					};
				},
			},
		};
	},
	parseHTML() {
		return [{ tag: "mark" }];
	},
	renderHTML({
		HTMLAttributes,
	}: { HTMLAttributes: Record<string, string | null> }) {
		return [
			"mark",
			mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
			0,
		];
	},
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	addCommands(): any {
		return {
			setHighlight:
				(attributes?: { color?: string }) =>
				({ commands }: { commands: any }) =>
					commands.setMark(this.name, attributes),
			toggleHighlight:
				(attributes?: { color?: string }) =>
				({ commands }: { commands: any }) =>
					commands.toggleMark(this.name, attributes),
			unsetHighlight:
				() =>
				({ commands }: { commands: any }) =>
					commands.unsetMark(this.name),
		};
	},
});

interface TiptapEditorProps {
	value: JSONContent | string | null;
	onChange: (value: JSONContent | string) => void;
	outputFormat?: "json" | "html";
	minHeight?: string;
}

const EMOJI_CATEGORIES = [
	{ label: "常用", emojis: ["😀", "😂", "🥰", "😎", "🤔", "👍", "❤️", "🔥", "✨", "🎉", "😊", "🥺", "😭", "😤", "🤣", "💪"] },
	{ label: "表情", emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙", "🥲", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "😮‍💨", "🤥", "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🥵", "🥶", "🥴", "😵", "🤯", "😎", "🥸", "🤓", "😈", "👿", "👻", "💀", "☠️", "👽", "🤖"] },
	{ label: "手势", emojis: ["👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "💪"] },
	{ label: "心形", emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❤️‍🔥", "❤️‍🩹", "💕", "💞", "💓", "💗", "💖", "💘", "💝"] },
	{ label: "自然", emojis: ["🌸", "🌺", "🌻", "🌹", "🌷", "🌼", "🌿", "🍀", "🍁", "🍂", "🌳", "🌴", "🌵", "🌾", "🌊", "🔥", "⭐", "🌟", "✨", "⚡", "☀️", "🌤️", "⛅", "🌈", "❄️", "💧", "🌙", "🐱", "🐶", "🐼"] },
	{ label: "食物", emojis: ["🍎", "🍊", "🍋", "🍇", "🍓", "🍑", "🍒", "🥝", "🍔", "🍕", "🍜", "🍣", "🍦", "🍰", "🎂", "🍫", "☕", "🍵", "🥤", "🍺"] },
	{ label: "物品", emojis: ["🎈", "🎁", "🎀", "🏆", "🥇", "🎯", "🎮", "🎵", "🎶", "📷", "💻", "📱", "⌚", "💡", "📚", "✏️", "📝", "💰", "🔑", "🚀"] },
];

const HIGHLIGHT_COLORS = [
	{ label: "黄色", color: "#fef08a" },
	{ label: "橙色", color: "#ffc078" },
	{ label: "绿色", color: "#8ce99a" },
	{ label: "蓝色", color: "#74c0fc" },
	{ label: "紫色", color: "#b197fc" },
	{ label: "红色", color: "#ffa8a8" },
	{ label: "粉色", color: "#fcc2d7" },
	{ label: "灰色", color: "#dee2e6" },
];

function HighlightPicker({
	onSelect,
	onClear,
	onClose,
	activeColor,
}: {
	onSelect: (color: string) => void;
	onClear: () => void;
	onClose: () => void;
	activeColor: string | null;
}) {
	const pickerRef = useRef<HTMLDivElement>(null);

	return (
		<div
			ref={pickerRef}
			role="dialog"
			className="absolute top-full left-0 z-50 mt-1 w-auto rounded-lg border bg-card p-2 shadow-lg"
			onMouseDown={(e) => e.preventDefault()}
		>
			<div className="flex items-center gap-1">
				{HIGHLIGHT_COLORS.map((item) => (
					<button
						key={item.color}
						type="button"
						title={item.label}
						onClick={() => {
							onSelect(item.color);
							onClose();
						}}
						className={`flex size-7 items-center justify-center rounded-md transition-all hover:scale-110 ${
							activeColor === item.color
								? "ring-2 ring-primary ring-offset-1"
								: ""
						}`}
						style={{ backgroundColor: item.color }}
					/>
				))}
				<button
					type="button"
					title="清除高亮"
					onClick={() => {
						onClear();
						onClose();
					}}
					className="ml-1 flex size-7 items-center justify-center rounded-md border border-dashed border-foreground/20 text-xs text-foreground/40 transition-colors hover:border-foreground/40 hover:text-foreground/60"
				>
					✕
				</button>
			</div>
		</div>
	);
}

function EmojiPicker({
	onSelect,
	onClose,
}: {
	onSelect: (emoji: string) => void;
	onClose: () => void;
}) {
	const [activeCategory, setActiveCategory] = useState(0);
	const pickerRef = useRef<HTMLDivElement>(null);

	return (
		<div
			ref={pickerRef}
			role="dialog"
			className="absolute top-full left-0 z-50 mt-1 w-[320px] rounded-lg border bg-card shadow-lg"
			onMouseDown={(e) => e.preventDefault()}
		>
			{/* Category tabs */}
			<div className="flex gap-1 overflow-x-auto border-b px-2 py-1.5">
				{EMOJI_CATEGORIES.map((cat, i) => (
					<button
						key={cat.label}
						type="button"
						onClick={() => setActiveCategory(i)}
						className={`shrink-0 rounded px-2 py-1 text-xs transition-colors ${
							activeCategory === i
								? "bg-primary/10 text-primary font-medium"
								: "text-foreground/50 hover:text-foreground/70"
						}`}
					>
						{cat.label}
					</button>
				))}
			</div>
			{/* Emoji grid */}
			<div className="grid max-h-[200px] grid-cols-8 gap-0.5 overflow-y-auto p-2">
				{EMOJI_CATEGORIES[activeCategory].emojis.map((emoji) => (
					<button
						key={emoji}
						type="button"
						onClick={() => {
							onSelect(emoji);
							onClose();
						}}
						className="flex size-8 items-center justify-center rounded text-lg hover:bg-foreground/5"
					>
						{emoji}
					</button>
				))}
			</div>
		</div>
	);
}

function ToolbarButton({
	onClick,
	active,
	title,
	children,
}: {
	onClick: () => void;
	active?: boolean;
	title: string;
	children: React.ReactNode;
}) {
	return (
		<button
			type="button"
			title={title}
			onMouseDown={(e) => {
				e.preventDefault();
				onClick();
			}}
			className={`rounded p-1.5 transition-colors ${
				active
					? "bg-primary/10 text-primary"
					: "text-foreground/40 hover:bg-foreground/5 hover:text-foreground/70"
			}`}
		>
			{children}
		</button>
	);
}

export function TiptapEditor({
	value,
	onChange,
	outputFormat = "json",
	minHeight = "160px",
}: TiptapEditorProps) {
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [showHighlightPicker, setShowHighlightPicker] = useState(false);
	const emojiWrapperRef = useRef<HTMLDivElement>(null);
	const highlightWrapperRef = useRef<HTMLDivElement>(null);

	const editor = useEditor({
		extensions: [StarterKit, CustomHighlight],
		content: value || "",
		immediatelyRender: false,
		onUpdate: ({ editor }) => {
			if (outputFormat === "json") {
				// 使用 JSON.parse(JSON.stringify()) 确保返回纯 JSON 对象
				// 避免 Next.js Server Actions 序列化错误 (GitHub issue #4805)
				onChange(JSON.parse(JSON.stringify(editor.getJSON())));
			} else {
				onChange(editor.getHTML());
			}
		},
		editorProps: {
			attributes: {
				class:
					"w-full bg-background px-4 py-3 text-sm outline-none prose prose-neutral dark:prose-invert max-w-none",
				style: `min-height: ${minHeight}`,
			},
		},
	});

	useEffect(() => {
		if (!showEmojiPicker && !showHighlightPicker) return;
		const handleClickOutside = (e: MouseEvent) => {
			if (
				showEmojiPicker &&
				emojiWrapperRef.current &&
				!emojiWrapperRef.current.contains(e.target as Node)
			) {
				setShowEmojiPicker(false);
			}
			if (
				showHighlightPicker &&
				highlightWrapperRef.current &&
				!highlightWrapperRef.current.contains(e.target as Node)
			) {
				setShowHighlightPicker(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [showEmojiPicker, showHighlightPicker]);

	const handleInsertEmoji = (emoji: string) => {
		editor?.chain().focus().insertContent(emoji).run();
	};

	return (
		<div className="w-full overflow-hidden rounded-lg border focus-within:ring-2 focus-within:ring-primary">
			<div className="flex flex-wrap items-center gap-0.5 border-b bg-background px-2 py-1.5">
				<ToolbarButton
					title="加粗"
					onClick={() => editor?.chain().focus().toggleBold().run()}
					active={editor?.isActive("bold")}
				>
					<Bold className="size-4" />
				</ToolbarButton>
				<ToolbarButton
					title="斜体"
					onClick={() => editor?.chain().focus().toggleItalic().run()}
					active={editor?.isActive("italic")}
				>
					<Italic className="size-4" />
				</ToolbarButton>
				<ToolbarButton
					title="标题"
					onClick={() =>
						editor?.chain().focus().toggleHeading({ level: 2 }).run()
					}
					active={editor?.isActive("heading", { level: 2 })}
				>
					<Heading2 className="size-4" />
				</ToolbarButton>
				<div className="mx-1 h-4 w-px bg-foreground/10" />
				<ToolbarButton
					title="无序列表"
					onClick={() => editor?.chain().focus().toggleBulletList().run()}
					active={editor?.isActive("bulletList")}
				>
					<List className="size-4" />
				</ToolbarButton>
				<ToolbarButton
					title="有序列表"
					onClick={() => editor?.chain().focus().toggleOrderedList().run()}
					active={editor?.isActive("orderedList")}
				>
					<ListOrdered className="size-4" />
				</ToolbarButton>
				<ToolbarButton
					title="引用"
					onClick={() => editor?.chain().focus().toggleBlockquote().run()}
					active={editor?.isActive("blockquote")}
				>
					<Quote className="size-4" />
				</ToolbarButton>
				<div className="mx-1 h-4 w-px bg-foreground/10" />
				<div ref={highlightWrapperRef} className="relative">
					<ToolbarButton
						title="高亮颜色"
						onClick={() => setShowHighlightPicker(!showHighlightPicker)}
						active={editor?.isActive("highlight")}
					>
						<HighlighterIcon className="size-4" />
					</ToolbarButton>
					{showHighlightPicker && (
						<HighlightPicker
							activeColor={
								editor?.getAttributes("highlight")?.color ?? null
							}
							onSelect={(color) =>
								editor
									?.chain()
									.focus()
									.toggleMark("highlight", { color })
									.run()
							}
							onClear={() =>
								editor?.chain().focus().unsetMark("highlight").run()
							}
							onClose={() => setShowHighlightPicker(false)}
						/>
					)}
				</div>
				<div ref={emojiWrapperRef} className="relative">
					<ToolbarButton
						title="表情"
						onClick={() => setShowEmojiPicker(!showEmojiPicker)}
					>
						<SmileIcon className="size-4" />
					</ToolbarButton>
					{showEmojiPicker && (
						<EmojiPicker
							onSelect={handleInsertEmoji}
							onClose={() => setShowEmojiPicker(false)}
						/>
					)}
				</div>
			</div>
			<EditorContent editor={editor} />
		</div>
	);
}

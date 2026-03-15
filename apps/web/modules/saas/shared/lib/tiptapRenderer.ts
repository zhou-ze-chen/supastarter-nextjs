interface TiptapNode {
	type?: string;
	content?: TiptapNode[];
	text?: string;
	marks?: { type: string; attrs?: Record<string, unknown> }[];
	attrs?: Record<string, unknown>;
}

function renderNode(node: TiptapNode): string {
	if (node.type === "text") {
		let text = node.text ?? "";
		if (node.marks) {
			for (const mark of node.marks) {
				switch (mark.type) {
					case "bold":
						text = `<strong>${text}</strong>`;
						break;
					case "italic":
						text = `<em>${text}</em>`;
						break;
					case "strike":
						text = `<s>${text}</s>`;
						break;
					case "code":
						text = `<code>${text}</code>`;
						break;
					case "highlight": {
						const color = mark.attrs?.color as string | undefined;
						text = color
							? `<mark style="background-color: ${color}">${text}</mark>`
							: `<mark>${text}</mark>`;
						break;
					}
				}
			}
		}
		return text;
	}

	const children = (node.content ?? []).map(renderNode).join("");

	switch (node.type) {
		case "doc":
			return children;
		case "paragraph":
			return `<p>${children}</p>`;
		case "heading": {
			const level = (node.attrs?.level as number) ?? 1;
			return `<h${level}>${children}</h${level}>`;
		}
		case "bulletList":
			return `<ul>${children}</ul>`;
		case "orderedList":
			return `<ol>${children}</ol>`;
		case "listItem":
			return `<li>${children}</li>`;
		case "blockquote":
			return `<blockquote>${children}</blockquote>`;
		case "codeBlock":
			return `<pre><code>${children}</code></pre>`;
		case "hardBreak":
			return "<br>";
		case "horizontalRule":
			return "<hr>";
		default:
			return children;
	}
}

function extractText(node: TiptapNode): string {
	if (node.type === "text") {
		return node.text ?? "";
	}
	if (node.type === "hardBreak") {
		return "\n";
	}
	const parts = (node.content ?? []).map(extractText);
	const text = parts.join("");
	if (
		node.type === "paragraph" ||
		node.type === "heading" ||
		node.type === "listItem"
	) {
		return `${text}\n`;
	}
	return text;
}

export function tiptapJsonToHtml(
	json: TiptapNode | string | null,
): string {
	if (!json) {
		return "";
	}
	if (typeof json === "string") {
		return json;
	}
	try {
		return renderNode(json);
	} catch {
		return "";
	}
}

export function tiptapJsonToText(
	json: TiptapNode | string | null,
): string {
	if (!json) {
		return "";
	}
	if (typeof json === "string") {
		return json;
	}
	try {
		return extractText(json).trim();
	} catch {
		return "";
	}
}

export function isTiptapJsonEmpty(json: TiptapNode | null): boolean {
	if (!json) return true;
	const content = json.content;
	if (!content || content.length === 0) return true;
	if (
		content.length === 1 &&
		content[0].type === "paragraph" &&
		!content[0].content
	) {
		return true;
	}
	return false;
}

"use server";

import { config } from "@repo/config";
import { db } from "@repo/database";
import { getSignedUploadUrl } from "@repo/storage";
import { revalidatePath } from "next/cache";

export async function createNote(data: {
	title: string;
	content: Record<string, unknown>;
	noteTagId: string;
	imageUrl?: string;
	description?: string;
}) {
	const note = await db.note.create({ data });
	revalidatePath("/app/notes");
	return note.id;
}

export async function updateNote(
	id: string,
	data: {
		title: string;
		content: Record<string, unknown>;
		noteTagId: string;
		imageUrl?: string;
		description?: string;
	},
) {
	await db.note.update({ where: { id }, data });
	revalidatePath("/app/notes");
}

export async function publishNote(id: string) {
	await db.note.update({ where: { id }, data: { published: true } });
	revalidatePath("/app/notes");
}

export async function unpublishNote(id: string) {
	await db.note.update({ where: { id }, data: { published: false } });
	revalidatePath("/app/notes");
}

export async function deleteNote(id: string) {
	await db.note.delete({ where: { id } });
	revalidatePath("/app/notes");
}

export async function getNoteCoverUploadUrl(noteId: string) {
	const bucket = config.storage.bucketNames.notes;
	const path = `covers/${noteId}-${Date.now()}.jpg`;
	const signedUploadUrl = await getSignedUploadUrl(path, { bucket });

	// Public bucket: construct the public URL directly
	const s3Endpoint = process.env.S3_ENDPOINT as string;
	// e.g. https://xxx.supabase.co/storage/v1/s3 -> https://xxx.supabase.co/storage/v1/object/public
	const publicBaseUrl = s3Endpoint.replace(/\/s3$/, "/object/public");
	const publicUrl = `${publicBaseUrl}/${bucket}/${path}`;

	return { signedUploadUrl, publicUrl };
}

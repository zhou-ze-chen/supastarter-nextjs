"use server";

import { config } from "@repo/config";
import { db } from "@repo/database";
import { getSignedUploadUrl } from "@repo/storage";
import { revalidatePath } from "next/cache";

export async function createFell(data: {
	name: string;
	weather: string;
	content: Record<string, unknown>;
	imageUrl?: string;
}) {
	const fell = await db.fell.create({ data });
	revalidatePath("/app/fell");
	return fell.id;
}

export async function updateFell(
	id: string,
	data: {
		name: string;
		weather: string;
		content: Record<string, unknown>;
		imageUrl?: string;
	},
) {
	await db.fell.update({ where: { id }, data });
	revalidatePath("/app/fell");
}

export async function deleteFell(id: string) {
	await db.fell.delete({ where: { id } });
	revalidatePath("/app/fell");
}

export async function publishFell(id: string) {
	await db.fell.update({ where: { id }, data: { published: true } });
	revalidatePath("/app/fell");
	revalidatePath("/zh/diary");
	revalidatePath("/en/diary");
}

export async function unpublishFell(id: string) {
	await db.fell.update({ where: { id }, data: { published: false } });
	revalidatePath("/app/fell");
	revalidatePath("/zh/diary");
	revalidatePath("/en/diary");
}

export async function getFellCoverUploadUrl(fellId: string) {
	const bucket = config.storage.bucketNames.fell;
	const path = `covers/${fellId}-${Date.now()}.jpg`;
	const signedUploadUrl = await getSignedUploadUrl(path, { bucket });

	const s3Endpoint = process.env.S3_ENDPOINT as string;
	const publicBaseUrl = s3Endpoint.replace(/\/s3$/, "/object/public");
	const publicUrl = `${publicBaseUrl}/${bucket}/${path}`;

	return { signedUploadUrl, publicUrl };
}

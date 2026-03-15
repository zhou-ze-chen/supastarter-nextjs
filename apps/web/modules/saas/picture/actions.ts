"use server";

import { config } from "@repo/config";
import { db } from "@repo/database";
import { getSignedUploadUrl } from "@repo/storage";
import { revalidatePath } from "next/cache";

export async function createPicture(data: {
	name: string;
	title: string;
	description?: string;
	imageUrl?: string;
}) {
	const picture = await db.picture.create({ data });
	revalidatePath("/app/pictures");
	return picture.id;
}

export async function updatePicture(
	id: string,
	data: {
		name: string;
		title: string;
		description?: string;
		imageUrl?: string;
	},
) {
	await db.picture.update({ where: { id }, data });
	revalidatePath("/app/pictures");
}

export async function deletePicture(id: string) {
	await db.picture.delete({ where: { id } });
	revalidatePath("/app/pictures");
}

export async function publishPicture(id: string) {
	await db.picture.update({ where: { id }, data: { published: true } });
	revalidatePath("/app/pictures");
	revalidatePath("/zh/gallery");
	revalidatePath("/en/gallery");
}

export async function unpublishPicture(id: string) {
	await db.picture.update({ where: { id }, data: { published: false } });
	revalidatePath("/app/pictures");
	revalidatePath("/zh/gallery");
	revalidatePath("/en/gallery");
}

export async function getPictureCoverUploadUrl() {
	const bucket = config.storage.bucketNames.pictures;
	const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
	const path = `covers/${uniqueId}.jpg`;
	const signedUploadUrl = await getSignedUploadUrl(path, { bucket });

	const s3Endpoint = process.env.S3_ENDPOINT as string;
	const publicBaseUrl = s3Endpoint.replace(/\/s3$/, "/object/public");
	const publicUrl = `${publicBaseUrl}/${bucket}/${path}`;

	return { signedUploadUrl, publicUrl };
}

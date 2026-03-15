"use server";

import { db } from "@repo/database";
import { revalidatePath } from "next/cache";

export async function createTag(name: string) {
	await db.noteTag.create({ data: { name } });
	revalidatePath("/app/tags");
}

export async function updateTag(id: string, name: string) {
	await db.noteTag.update({ where: { id }, data: { name } });
	revalidatePath("/app/tags");
}

export async function deleteTag(id: string) {
	await db.noteTag.delete({ where: { id } });
	revalidatePath("/app/tags");
	revalidatePath("/app/notes");
}

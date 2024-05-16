import { AireServices, Content } from "aire";

/**
 * Function that gets all the chats the user has save in the database order from newest to oldest.
 * @returns array of chats format id: string, date: string
 */
export async function getAllContent(): Promise<Content[]> {
    if (AireServices.Memory) {
        const result = await AireServices.Memory.getContents()
        if (result.data) {
            console.log("result", result);
            return result.data;
        }
    } else {
        console.error("Memory service is not available")
    }
    return []
}
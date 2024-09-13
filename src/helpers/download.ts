export function downloadObjectAsJson(obj: object, filename: string) {
    const json = JSON.stringify(obj, null, 2);
    const url = URL.createObjectURL(
        new Blob([json], { type: "application/json" })
    );

    const el = document.createElement("a");
    el.href = url;
    el.download = filename;
    el.innerHTML = `Download ${filename}`;
    document.body.appendChild(el);

    el.click();
    el.remove();
    URL.revokeObjectURL(url);
}

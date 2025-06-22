export interface Content {
  id?: number;
  title: string;
  description: string;
  content: string;
  path: string;
}

export async function makeContentRoutes(repoUrl: string) {
  const res = await fetch(`${repoUrl}/api/content`);

  if (!res.ok) {
    throw new Error(`Failed to fetch content from ${repoUrl}: ${res.statusText}`);
  }

  const content: Content[] = await res.json();

  if (!Array.isArray(content)) {
    throw new Error(`Expected an array of content, but got ${typeof content}`);
  }

  return content.map((item) => {
    return {
      params: {
        content: item.path,
      },
      props: {
        id: item.id,
        title: item.title,
        description: item.description,
        content: item.content,
      }
    }
  })

}
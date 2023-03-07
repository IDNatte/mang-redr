import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params }) => {
	const getChapterMeta = async () => {
		const chapterMeta = await fetch(`https://api.mangadex.org/at-home/server/${params.chapterId}`);
		const chapter = await chapterMeta.json();

		const chapterData = [];

		for (const chapterImg in chapter.chapter.data) {
			chapterData.push({
				url: `${chapter.baseUrl}/data/${chapter.chapter.hash}/${chapter.chapter.data[chapterImg]}`
			});
		}

		return chapterData;
	};

	return {
		chapter: getChapterMeta(),
		chapterId: params.chapterId
	};
};

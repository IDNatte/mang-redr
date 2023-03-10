import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const getMangaDetail = async () => {
		const getManga = await fetch(
			'https://api.mangadex.org/manga?originalLanguage[]=ja&excludedTags[]=5920b825-4181-4a17-beeb-9918b0ff7a30'
		).then((response) => response.json());
		const manga = getManga.data;

		const mangaDetail = manga.map((manga: any) => {
			const mangaCover = manga.relationships
				.filter((rel: any) => {
					return rel.type == 'cover_art';
				})
				.map((rel: any) => {
					return rel.id;
				});

			return {
				id: manga.id,
				title: manga.attributes.title,
				altTitles: manga.attributes.altTitles,
				mangaCover: mangaCover[0]
			};
		});

		return await mangaDetail;
	};

	const getCoverImage = async () => {
		const manga = await getMangaDetail();

		const mangaCover = await Promise.all(
			manga.map(async (coverID: any) => {
				const getCoverData = await fetch(
					`https://api.mangadex.org/cover/${coverID.mangaCover}`
				).then((response) => response.json());

				return {
					mangaId: coverID.id,
					mangaTitle: coverID.title,
					mangaAltTitles: coverID.altTitles,
					coverUrl: `https://uploads.mangadex.org/covers/${coverID.id}/${getCoverData.data.attributes.fileName}`
				};
			})
		);

		return mangaCover;
	};

	return {
		manga: getMangaDetail(),
		cover: getCoverImage()
	};
};

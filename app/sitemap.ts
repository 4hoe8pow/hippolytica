import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = "https://hippolytica.grill-ware.com/";
	const today = new Date();

	return [
		{
			url: baseUrl,
			lastModified: today,
			changeFrequency: "yearly",
			priority: 1,
		},
		{
			url: `${baseUrl}about-us`,
			lastModified: today,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}development-status`,
			lastModified: today,
			changeFrequency: "weekly",
			priority: 0.5,
		},
		{
			url: `${baseUrl}what-is-kabaddi`,
			lastModified: today,
			changeFrequency: "weekly",
			priority: 0.5,
		},
	];
}

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.fauzansinta.my.id";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/dashboard/",
          "/api/",
          "/link-generator",
          "/link-generator/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

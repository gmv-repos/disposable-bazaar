// 🟩 Dynamic Metadata Function for Customization Page
import { resolveCanonical, getCanonicalUrl } from "../lib/getCanonicalUrl";
import { API_BASE } from "../../constants/constants";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  try {
    const res = await fetch(`${API_BASE}/page/detail/3`, {
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`API returned status ${res.status}`);

    const data = await res.json();
    const canonical = resolveCanonical(
      data?.data?.canonical_url,
      "/customization/",
    );

    return {
      title: data?.data?.meta_title || "Customization - Disposable Bazar",
      description:
        data?.data?.meta_description ||
        "Customization services for all your disposal needs.",
      ...(data?.data?.focus_keyword
        ? { keywords: data.data.focus_keyword }
        : {}),
      ...(canonical ? { alternates: { canonical } } : {}),
      // robots: {
      //   index: data?.data?.robots_index !== "noindex",
      //   follow: data?.data?.robots_follow !== "nofollow",
      //   googleBot: {
      //     index: data?.data?.robots_index !== "noindex",
      //     follow: data?.data?.robots_follow !== "nofollow",
      //   },
      // },
    };
  } catch (error) {
    console.error("Customization metadata fetch failed:", error);
    return {
      title: "Customization - Disposable Bazar",
      description: "Customization Services",
      alternates: {
        canonical: getCanonicalUrl("/customization/") ?? undefined,
      },
      // robots: { index: true, follow: true },
    };
  }
}

import { Suspense } from "react";
import Customization from "../src/Pages/Customization ";
import { fetchPageDetailById, serializeLdJson } from "../lib/seo/pageDetail";

async function getPageData() {
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      fetch(`${API_BASE}/search/Customizeproduct?sort_by=1`, {
        cache: "no-store",
      }),
      fetch(`${API_BASE}/product/category`, { cache: "no-store" }),
    ]);
    const products = productsRes.ok ? await productsRes.json() : null;
    const categories = categoriesRes.ok ? await categoriesRes.json() : null;
    return {
      products: products?.data || [],
      categories: categories?.data || [],
    };
  } catch {
    return { products: [], categories: [] };
  }
}

export default async function Page() {
  const [{ products, categories }, pageDetail] = await Promise.all([
    getPageData(),
    fetchPageDetailById(3, { cache: "no-store" }),
  ]);
  const schemaLd = serializeLdJson(pageDetail?.schema);

  return (
    <>
      {schemaLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schemaLd }}
        />
      ) : null}
      <Suspense fallback={null}>
        <div className="pt-20 md:pt-10">
          <Customization
            initialProducts={products}
            initialCategories={categories}
          />
        </div>
      </Suspense>
    </>
  );
}

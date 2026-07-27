import { resolveCanonical, getCanonicalUrl } from "../lib/getCanonicalUrl";
import { API_BASE } from "../../constants/constants";

// 🟩 Dynamic Metadata Function for Account Settings Page
export async function generateMetadata() {
  try {
    const res = await fetch(`${API_BASE}/page/detail/6`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();

    return {
      title: data?.data?.meta_title || "Account Settings",
      description:
        data?.data?.meta_description || "Manage your account settings",

      alternates: {
        canonical:
          resolveCanonical(data?.data?.canonical_url, "/profile/") ?? undefined,
      },

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
    console.error("Account Settings metadata fetch failed:", error);

    return {
      title: "Account Settings",
      description: "Manage your account settings",
      alternates: { canonical: getCanonicalUrl("/profile/") ?? undefined },
      // robots: {
      //   index: true,
      //   follow: true,
      // },
    };
  }
}

// 🟩 Load AccountSettings Component

import React, { Suspense } from "react";
import { AccountSettings } from "../../app/src/Pages/AccountSettings";

export const dynamic = "force-dynamic";
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccountSettings />
    </Suspense>
  );
}

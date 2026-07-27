import { API_Image_BASE } from "@/constants/constants";

export const Image_Url =
  process.env.NEXT_PUBLIC_IMAGE_URL ||
  `${API_Image_BASE}/public/Frontend/Assets/`;

export const Assets_Url =
  process.env.NEXT_PUBLIC_ASSETS_URL || `${API_Image_BASE}`;

export const Profile_Assets_Url =
  process.env.NEXT_PUBLIC_PROFILE_ASSETS_URL ||
  `${API_Image_BASE}/storage/app/public`;

export const Image_Not_Found =
  process.env.NEXT_PUBLIC_IMAGE_NOT_FOUND ||
  `${API_Image_BASE}/public/Frontend/Assets/defaultImage.svg`;

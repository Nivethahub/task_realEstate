export type Property = {
  id: string; title: string; description: string; city: string; locality: string; address: string;
  isArchive:boolean,
  price: string | number; bedrooms: number; bathrooms: number; areaSqft: number;
  propertyType: 'APARTMENT' | 'INDEPENDENT_HOUSE' | 'VILLA' | 'PLOT' | 'COMMERCIAL';
  listingType: 'SALE' | 'RENT'; images: string[]; amenities: string[]; isAvailable: boolean;
  owner?: { id: string; name: string; phone?: string | null; email?: string };
  createdAt: string;
};
export type ApiList = { success: boolean; data: Property[]; pagination?: { page: number; limit: number; total: number; totalPages: number } };

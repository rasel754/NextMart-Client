export interface IShop {
  _id: string;
  shopName: string;
  businessLicenseNumber: string;
  address: string;
  contactNumber: string;
  website?: string | null;
  user?: string | null;
  servicesOffered: string[];
  ratings?: number;
  establishedYear: number;
  socialMediaLinks?: Record<string, string> | null;
  taxIdentificationNumber: string;
  logo?: string | null;
  isOfficial?: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Client {
  id: number;
  name: string;
  profile_id: string;
  birthday: string;
  organization_name: string;
  image: string;
  number: string;
  division: string;
  district: string;
  thana: string;
  ward: string;
  localArea: string;
  road: string;
  category: string;
  subcategories: string;
  gender: string;
  data: string;
  email: string | null;
  password: string;
  role: string;
  action: string;
  emp_id: string;
  emp_name: string;
  admin_id: string | null;
  admin_name: string | null;
  adminTime: string | null;
  supperAdmin_id: string | null;
  supperAdmin_name: string | null;
  SupperAdminTime: string | null;
  created_at?: string;
  updated_at?: string;
}



export interface ClientData {
  organization_name: string;
  category: string;
  subcategories: string[];
  division: string;
  district: string;
  thana: string;
  ward: string;
  localArea: string;
  road: string;
  image: string;
  profile_id: string;
  // Add other properties as needed
}

export interface NewPost {
  title: string;
  category: string;
  subcategories: string[];
  division: string;
  district: string;
  thana: string;
  ward: string;
  localArea: string;
  road: string;
  image: string;
  client_id: string;
  created_at: string;
  updated_at: string;
}
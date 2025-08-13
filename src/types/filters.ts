export type Filters = {
  name: string;
  email: string;
  country: string[]; 
  registeredFrom?: string | null; 
  registeredTo?: string | null;   
};

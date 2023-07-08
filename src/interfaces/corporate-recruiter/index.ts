import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface CorporateRecruiterInterface {
  id?: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface CorporateRecruiterGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
}

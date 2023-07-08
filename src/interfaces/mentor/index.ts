import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface MentorInterface {
  id?: string;
  user_id?: string;
  professional_background?: string;
  expertise?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface MentorGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
  professional_background?: string;
  expertise?: string;
}

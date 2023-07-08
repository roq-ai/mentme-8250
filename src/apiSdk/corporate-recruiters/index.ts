import axios from 'axios';
import queryString from 'query-string';
import { CorporateRecruiterInterface, CorporateRecruiterGetQueryInterface } from 'interfaces/corporate-recruiter';
import { GetQueryInterface } from '../../interfaces';

export const getCorporateRecruiters = async (query?: CorporateRecruiterGetQueryInterface) => {
  const response = await axios.get(`/api/corporate-recruiters${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCorporateRecruiter = async (corporateRecruiter: CorporateRecruiterInterface) => {
  const response = await axios.post('/api/corporate-recruiters', corporateRecruiter);
  return response.data;
};

export const updateCorporateRecruiterById = async (id: string, corporateRecruiter: CorporateRecruiterInterface) => {
  const response = await axios.put(`/api/corporate-recruiters/${id}`, corporateRecruiter);
  return response.data;
};

export const getCorporateRecruiterById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/corporate-recruiters/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteCorporateRecruiterById = async (id: string) => {
  const response = await axios.delete(`/api/corporate-recruiters/${id}`);
  return response.data;
};

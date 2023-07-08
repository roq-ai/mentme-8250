const mapping: Record<string, string> = {
  'corporate-recruiters': 'corporate_recruiter',
  mentors: 'mentor',
  organizations: 'organization',
  students: 'student',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}

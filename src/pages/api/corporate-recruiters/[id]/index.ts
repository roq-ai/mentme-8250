import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { corporateRecruiterValidationSchema } from 'validationSchema/corporate-recruiters';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.corporate_recruiter
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getCorporateRecruiterById();
    case 'PUT':
      return updateCorporateRecruiterById();
    case 'DELETE':
      return deleteCorporateRecruiterById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCorporateRecruiterById() {
    const data = await prisma.corporate_recruiter.findFirst(convertQueryToPrismaUtil(req.query, 'corporate_recruiter'));
    return res.status(200).json(data);
  }

  async function updateCorporateRecruiterById() {
    await corporateRecruiterValidationSchema.validate(req.body);
    const data = await prisma.corporate_recruiter.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteCorporateRecruiterById() {
    const data = await prisma.corporate_recruiter.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}

import prisma from '@root/prisma/connection';

export interface CreateLogsPayment {
  status: 'approved' | 'rejected' | 'pending';
  id_user?: string;
  message?: string;
}


class LogsPaymentRepository {
    async create(data: CreateLogsPayment) {
        return prisma.logsPayment.create({
            data: {
                ...data,
                status: data.status,
            },
        });
    }
}

export default new LogsPaymentRepository();

import { InvoiceController } from "../controllers/invoice.controller.js";
import { validateRequest } from "../middleware/validation.js";
import { invoiceSchema } from "../schemas/invoice.schema.js";

const invoiceController = new InvoiceController();

export default async function (fastify, opts) {
  // Get all invoices
  fastify.get(
    "/",
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      return invoiceController.getAllInvoices(request, reply);
    }
  );

  // Get invoice by ID
  fastify.get(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      return invoiceController.getInvoiceById(request, reply);
    }
  );

  // Create invoice
  fastify.post(
    "/",
    {
      preHandler: [
        fastify.authenticate,
        validateRequest({ body: invoiceSchema.create }),
      ],
    },
    async (request, reply) => {
      return invoiceController.createInvoice(request, reply);
    }
  );

  // Update invoice
  fastify.put(
    "/:id",
    {
      preHandler: [
        fastify.authenticate,
        validateRequest({ body: invoiceSchema.update }),
      ],
    },
    async (request, reply) => {
      return invoiceController.updateInvoice(request, reply);
    }
  );

  // Delete invoice
  fastify.delete(
    "/:id",
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      return invoiceController.deleteInvoice(request, reply);
    }
  );

  // Mark invoice as paid
  fastify.patch(
    "/:id/paid",
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      return invoiceController.markInvoiceAsPaid(request, reply);
    }
  );

  // Send invoice
  fastify.post(
    "/:id/send",
    {
      preHandler: [fastify.authenticate],
    },
    async (request, reply) => {
      return invoiceController.sendInvoice(request, reply);
    }
  );
}

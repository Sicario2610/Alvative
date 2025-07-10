import express, { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";
import crypto from "crypto";
import Email from "./EmailService";

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors()); // Allow all origins for CORS

// Middleware to parse JSON request bodies
app.use(express.json());

// Homepage
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express with TypeScript!");
});

// Interface for payment initialization request
interface PaymentRequest {
  email: string;
  name: string;
  price: number;
}

// Interface for Paystack response
interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

// Endpoint for payment initialization
app.post(
  "/initialize-payment",
  async (req: Request<{}, {}, PaymentRequest>, res: Response) => {
    const { email, name, price } = req.body;

    // Validate request body
    if (!email || !name || !price || price <= 0) {
      return res
        .status(400)
        .json({ error: "Email, name, and valid price are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    try {
      // Initialize Paystack transaction
      const response = await axios.post<PaystackInitializeResponse>(
        "https://api.paystack.co/transaction/initialize",
        {
          email,
          amount: price * 100, // Convert Naira to kobo
          currency: "NGN",
          metadata: {
            item_name: name,
            custom_fields: [
              {
                display_name: "Item",
                variable_name: "item_name",
                value: name,
              },
            ],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      res.status(200).json({
        status: true,
        message: "Payment initialized successfully",
        reference: response.data.data.reference,
        access_code: response.data.data.access_code,
      });
    } catch (error: any) {
      console.error("Paystack error:", error.response?.data || error.message);
      res.status(500).json({
        status: false,
        error: "Failed to initialize payment",
        message:
          error.response?.data?.message || "Payment initialization failed",
      });
    }
  }
);

// Endpoint for payment verification
app.get("/verify-payment/:reference", async (req: Request, res: Response) => {
  const { reference } = req.params;

  if (!reference) {
    return res.status(400).json({ error: "Payment reference is required" });
  }

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const { data } = response.data;

    if (data.status === "success") {
      // Payment was successful
      console.log("Payment verified successfully:", data);

      res.status(200).json({
        status: true,
        message: "Payment verified successfully",
        data: {
          reference: data.reference,
          amount: data.amount / 100, // Convert back to Naira
          currency: data.currency,
          status: data.status,
          customer: data.customer,
          metadata: data.metadata,
        },
      });
    } else {
      res.status(400).json({
        status: false,
        message: "Payment verification failed",
        data: data,
      });
    }
  } catch (error: any) {
    console.error(
      "Payment verification error:",
      error.response?.data || error.message
    );
    res.status(500).json({
      status: false,
      error: "Failed to verify payment",
      message: error.response?.data?.message || "Payment verification failed",
    });
  }
});

// Webhook endpoint for Paystack
app.post("/webhook/paystack", (req: Request, res: Response) => {
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash === req.headers["x-paystack-signature"]) {
    const event = req.body;

    switch (event.event) {
      case "charge.success":
        console.log("Webhook: Payment successful", event.data);
        (async () => {
          try {
            console.log("Webhook: Payment successful", event.data);

            const customer = event.data.customer;
            const amount = event.data.amount / 100;
            const reference = event.data.reference;

            const user = {
              name: customer.first_name || "Customer",
              email: customer.email,
            };

            const email = new Email(user);
            await email.sendReceipt(amount, reference);
          } catch (err) {
            console.error("Email send error:", err);
          }
        })();
        break;

      case "charge.dispute.create":
        console.log("Webhook: Dispute created", event.data);
        // Handle dispute creation
        break;

      case "charge.dispute.remind":
        console.log("Webhook: Dispute reminder", event.data);
        // Handle dispute reminder
        break;

      case "charge.dispute.resolve":
        console.log("Webhook: Dispute resolved", event.data);
        // Handle dispute resolution
        break;

      default:
        console.log("Webhook: Unhandled event", event.event);
    }

    res.sendStatus(200);
  } else {
    console.log("Webhook: Invalid signature");
    res.sendStatus(400);
  }
});

// Error handling middleware
app.use((error: any, req: Request, res: Response, next: any) => {
  console.error("Server error:", error);
  res.status(500).json({
    status: false,
    error: "Internal server error",
    message: "Something went wrong on the server",
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(
    `Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`
  );
});

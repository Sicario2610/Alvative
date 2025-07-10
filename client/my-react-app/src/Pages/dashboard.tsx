import PaystackPop from "@paystack/inline-js";
import watch1 from "../assets/Screenshot_1901.png";
import watch2 from "../assets/Screenshot_1902.png";
import axios from "axios";
import { useState } from "react";
import EmailModal from "../components/EmailModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [selectedItem, setSelectedItem] = useState<{
    id: number;
    price: number;
    name: string;
  } | null>(null);

  const items = [
    { id: 1, image: watch1, price: 90000, alt: "Watch 1", name: "Watch 1" },
    { id: 2, image: watch2, price: 50000, alt: "Watch 2", name: "Watch 2" },
  ];

  // Format price to Naira with commas
  const formatPrice = (price: number) => {
    return `₦${price.toLocaleString("en-NG")}`;
  };

  // Handle Buy button click
  const handleBuyClick = (item: {
    id: number;
    price: number;
    name: string;
  }) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // Handle Paystack payment
  const handleBuy = async () => {
    if (!selectedItem || !userEmail) return;

    try {
      // Step 1: Call backend to initialize payment
      const response = await axios.post(
        "http://localhost:3000/initialize-payment",
        {
          email: userEmail,
          name: selectedItem.name,
          price: selectedItem.price,
        }
      );

      const { reference } = response.data;

      // Step 2: Initialize Paystack payment
      const paystack = new PaystackPop();
      paystack.newTransaction({
        key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
        email: userEmail,
        amount: selectedItem.price * 100, // Convert to kobo
        reference,
        onSuccess: (transaction) => {
          // Handle successful payment
          console.log("Payment successful:", transaction);
          toast.success(
            `Payment successful! Reference: ${transaction.reference}`
          );
        },
        onCancel: () => {
          // Handle payment cancellation
          console.log("Payment cancelled");
          toast.info("Payment was cancelled.");
        },
      });
    } catch (error) {
      console.error("Payment initialization failed:", error);
      toast.error("Failed to initialize payment. Please try again.");
    } finally {
      setIsModalOpen(false);
      setUserEmail("");
      setSelectedItem(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="w-full max-w-7xl mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800">
          Dashboard
        </h1>
      </header>

      {/* Image Grid */}
      <main className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative w-full aspect-[4/3] overflow-hidden rounded-lg shadow-lg bg-white"
          >
            <img
              src={item.image}
              alt={item.alt}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
              <span className="bg-gray-900 text-white text-base font-bold px-4 py-2 rounded-full shadow-md">
                {formatPrice(item.price)}
              </span>
              <button
                onClick={() => handleBuyClick(item)}
                className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Buy
              </button>
            </div>
          </div>
        ))}
      </main>

      {/* Email Input Modal */}
      <EmailModal
        isOpen={isModalOpen}
        email={userEmail}
        onEmailChange={setUserEmail}
        onClose={() => setIsModalOpen(false)}
        onProceed={handleBuy}
      />
      <ToastContainer />
    </div>
  );
}

export default Dashboard;

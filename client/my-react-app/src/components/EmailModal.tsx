interface EmailModalProps {
  isOpen: boolean;
  email: string;
  onEmailChange: (email: string) => void;
  onClose: () => void;
  onProceed: () => void;
  userPhone: string; // New prop for user's phone number
  onUserPhoneChange: (phone: string) => void; // New prop for phone number change handler
}

const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  email,
  onEmailChange,
  onClose,
  onProceed,
  userPhone, // Destructure new prop
  onUserPhoneChange, // Destructure new prop
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Enter Details</h2>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email:
          </label>
          <input
            type="email"
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="your.email@example.com"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="phone" className="block text-gray-700 text-sm font-bold mb-2">
            Phone Number:
          </label>
          <input
            type="tel"
            id="phone"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={userPhone}
            onChange={(e) => onUserPhoneChange(e.target.value)}
            placeholder="+2348012345678"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onProceed}
            className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;

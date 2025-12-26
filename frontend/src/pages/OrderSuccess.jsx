import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const OrderSuccess = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-rose-50 px-6">
      <FaCheckCircle className="text-green-500 text-6xl mb-6" />
      <h1 className="text-4xl font-serif text-gray-900 mb-4">Order Placed Successfully!</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Thank you for your purchase. Your order has been received and is being processed. 
        You will receive an email confirmation shortly.
      </p>
      <div className="flex gap-4">
        <Link 
          to="/profile" 
          className="bg-white text-gray-900 px-6 py-3 rounded border border-gray-200 hover:bg-gray-50 transition-colors uppercase tracking-wider text-sm font-medium"
        >
          View Order
        </Link>
        <Link 
          to="/" 
          className="bg-rose-500 text-white px-6 py-3 rounded hover:bg-rose-600 transition-colors uppercase tracking-wider text-sm font-medium"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;

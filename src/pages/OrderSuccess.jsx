import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

export default function OrderSuccess() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow p-8 max-w-md w-full text-center">
        <CheckCircle2 className="w-14 h-14 text-green-600 mx-auto mb-3" />
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-600">Thanks for your Purchase My bro</p>
        <Link
          to="/"
          className="mt-6 inline-block bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-semibold"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
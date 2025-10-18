// /pages/CheckoutPage.jsx
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { Pizza, CreditCard, Truck, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function CheckOutPage() {
  const { items, totalPrice, setItems } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const placeOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    // mock payment flow
    setTimeout(() => {
      setItems([]);                 // เคลียร์ตะกร้าเมื่อสำเร็จ
      navigate("/order-success");
    }, 1200);
  };

  return (
    <div className="h-full bg-[url('https://images.unsplash.com/photo-1548365328-9f547fb09530?q=80&w=1600&auto=format&fit=crop')] bg-cover bg-center">
      <div className="backdrop-brightness-[.95] backdrop-blur-[2px]">
      

        <main className="max-w-6xl mx-auto px-4 py-6 grid lg:grid-cols-3 gap-6">
          {/* ฟอร์มซ้าย */}
          <section className="lg:col-span-2 space-y-6">
            <Card>
              <h2 className="font-bold text-xl flex items-center gap-2 text-red-600">
                <Truck className="w-5 h-5" /> Shipping Address
              </h2>
              <form onSubmit={placeOrder} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="First name" required />
                <Input label="Last name" required />
                <Input label="Address 1" className="md:col-span-2" required />
                <Input label="Address 2" className="md:col-span-2" placeholder="Apartment, suite (optional)" />
                <Input label="City" />
                <Input label="ZIP / Postal code" />
                <Input label="Phone" />
                <Input type="email" label="Email (for receipt)" required />
                
                <div className="md:col-span-2 border-t pt-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-2 text-green-700">
                    <CreditCard className="w-5 h-5" /> Payment
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    <Input label="Card holder" required />
                    <Input label="Card number" placeholder="4242 4242 4242 4242" required />
                    <Input label="Expiry (MM/YY)" placeholder="12/29" required />
                    <Input label="CVC" placeholder="123" required />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || items.length === 0}
                  className="md:col-span-2 mt-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg"
                >
                  {loading ? "Processing..." : "Place Order"}
                </button>
              </form>
            </Card>

            <Card className="border-green-200">
              <h2 className="font-bold text-xl flex items-center gap-2 text-green-700">
                <Pizza className="w-5 h-5" /> Delivery Notes (Optional)
              </h2>
              <textarea
                rows="3"
                placeholder="E.g. Leave at the door, call when arrived..."
                className="mt-3 w-full rounded-lg border-gray-300 focus:border-red-500 focus:ring-red-500"
              />
            </Card>
          </section>

          {/* สรุปออเดอร์ขวา */}
          <aside className="lg:sticky lg:top-20 h-fit">
            <Card>
              <h3 className="font-bold text-lg mb-3">Order Summary</h3>
              <div className="space-y-3 max-h-60 overflow-auto pr-1">
                {items.length === 0 ? (
                  <p className="text-gray-500">Your cart is empty.</p>
                ) : (
                  items.map((it) => (
                    <div key={it.id} className="flex justify-between text-sm">
                      <span className="truncate pr-2">{it.name} × {it.quantity}</span>
                      <span className="font-medium">฿{it.price * it.quantity}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t mt-4 pt-3 space-y-1 text-sm">
                <Row label="Subtotal" value={`฿${totalPrice}`} />
                <Row label="Shipping" value="฿0 (Free over ฿200)" />
                <Row label="Duties & Taxes" value="Included" />
                <div className="flex justify-between font-semibold text-base pt-2">
                  <span>You Pay</span>
                  <span className="text-red-600">฿{totalPrice}</span>
                </div>
              </div>

              <button
                onClick={placeOrder}
                disabled={loading || items.length === 0}
                className="mt-4 w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white py-2 rounded-lg font-semibold"
              >
                {loading ? "Processing..." : "Place Order"}
              </button>
              <p className="text-xs text-gray-500 mt-2">By placing order, you agree to our terms & privacy.</p>
            </Card>

            <div className="flex justify-center mt-6">
        <button
          onClick={() => navigate('/')}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg text-sm font-semibold transition cursor-pointer"
        >
          Back to Home
        </button>
      </div>
          </aside>
        </main>
      </div>
    </div>
  );
}

function Step({ dot, label, active }) {
  return (
    <div className={`flex items-center gap-2 px-2 py-1 rounded-full ${active ? "bg-red-50 text-red-600" : "text-gray-500"}`}>
      <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${active ? "border-red-500" : "border-gray-300"}`}>{dot}</span>
      <span className="hidden sm:inline text-sm font-medium">{label}</span>
    </div>
  );
}

function Card({ children, className = "" }) {
  return <div className={`bg-white/95 backdrop-blur rounded-xl border shadow-sm p-4 md:p-6 ${className}`}>{children}</div>;
}

function Input({ label, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        {...props}
        className="mt-1 w-full rounded-lg border-gray-300 focus:border-green-600 focus:ring-green-600"
      />
    </label>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

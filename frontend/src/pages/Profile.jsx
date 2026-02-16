// src/pages/Profile.jsx
import AccountInfo from "../components/AccountInfo";
import OrderHistory from "./OrderHistory";
import AddressManagement from "./AddressManagement";

export default function Profile() {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">My Profile</h1>

      <section>
        <AccountInfo />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Order History</h2>
        <OrderHistory />
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Saved Addresses</h2>
        <AddressManagement />
      </section>
    </div>
  );
}

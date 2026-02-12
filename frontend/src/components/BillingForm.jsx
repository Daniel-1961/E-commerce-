export default function BillingForm() {
  return (
    <div className="border rounded p-6 bg-white shadow">
      <h2 className="text-lg font-semibold mb-4">Billing Details</h2>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium">First Name</label>
          <input type="text" className="border rounded p-2 w-full" />
        </div>

        <div>
          <label className="block text-sm font-medium">Last Name</label>
          <input type="text" className="border rounded p-2 w-full" />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input type="email" className="border rounded p-2 w-full" />
        </div>

        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input type="tel" className="border rounded p-2 w-full" />
        </div>

        <h2 className="text-lg font-semibold mt-6 mb-4">Delivery Address</h2>

        <div>
          <label className="block text-sm font-medium">Street Address</label>
          <input type="text" className="border rounded p-2 w-full" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">City</label>
            <input type="text" className="border rounded p-2 w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium">Zip Code</label>
            <input type="text" className="border rounded p-2 w-full" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Country</label>
          <input type="text" className="border rounded p-2 w-full" />
        </div>
      </form>
    </div>
  );
}

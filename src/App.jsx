import { useState } from "react";

//const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
// TEMP: hard-code for POC
const API_BASE_URL = "https://dspredictbaggage-production.up.railway.app";

console.log("API_BASE_URL from env:", API_BASE_URL);
const numericFields = [
  "party_size",
  "adt_count",
  "chd_count",
  "inf_count",
  "booking_horizon_days",
  "base_fare_total",
  "corporate_flag",
  "dep_month",
  "dep_dow",
];

function App() {
  const [form, setForm] = useState({
    // numeric
    party_size: 1,
    adt_count: 1,
    chd_count: 0,
    inf_count: 0,
    booking_horizon_days: 14,
    base_fare_total: 1200,

    // categorical
    traveler_type: "SOLO",
    od: "KUL-SIN",
    trip_type: "DOMESTIC",
    flight_no: "MH601",
    cabin: "Y",
    fare_family: "VALUE",
    pos_country: "MY",
    sales_channel: "DIRECT",
    device: "WEB",
    loyalty_tier: "NONE",
    corporate_flag: 0,
    dep_month: 10,
    dep_dow: 2,
    dep_season: "AUTUMN",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value || 0) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setResult(null);

    try {
      if (!API_BASE_URL) {
        throw new Error("API base URL not configured");
      }

      const resp = await fetch(`${API_BASE_URL}/predict_bag`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!resp.ok) {
        throw new Error(`HTTP ${resp.status}`);
      }

      const data = await resp.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setErrorMsg("Error calling API. Check console / backend logs.");
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    fontFamily: "Arial, sans-serif",
    margin: "20px",
    maxWidth: "600px",
  };

  const labelStyle = {
    display: "block",
    marginTop: "8px",
    fontSize: "0.9rem",
  };

  const inputStyle = {
    width: "260px",
    padding: "4px",
    marginTop: "2px",
  };

  return (
    <div style={containerStyle}>
      <h1>Extra Baggage Propensity – POC</h1>
      <p style={{ maxWidth: "520px" }}>
        Enter booking details to estimate the probability that this PNR will buy{" "}
        <strong>extra baggage</strong>.
      </p>

      <form onSubmit={handleSubmit}>
        {/* PARTY & FARE */}
        <h3>Party &amp; Fare</h3>

        <label style={labelStyle}>
          Party size
          <input
            style={inputStyle}
            type="number"
            name="party_size"
            value={form.party_size}
            onChange={handleChange}
            min={1}
          />
        </label>

        <label style={labelStyle}>
          ADT count
          <input
            style={inputStyle}
            type="number"
            name="adt_count"
            value={form.adt_count}
            onChange={handleChange}
            min={0}
          />
        </label>

        <label style={labelStyle}>
          CHD count
          <input
            style={inputStyle}
            type="number"
            name="chd_count"
            value={form.chd_count}
            onChange={handleChange}
            min={0}
          />
        </label>

        <label style={labelStyle}>
          INF count
          <input
            style={inputStyle}
            type="number"
            name="inf_count"
            value={form.inf_count}
            onChange={handleChange}
            min={0}
          />
        </label>

        <label style={labelStyle}>
          Booking horizon (days)
          <input
            style={inputStyle}
            type="number"
            name="booking_horizon_days"
            value={form.booking_horizon_days}
            onChange={handleChange}
            min={-1}
          />
        </label>

        <label style={labelStyle}>
          Base fare total
          <input
            style={inputStyle}
            type="number"
            name="base_fare_total"
            value={form.base_fare_total}
            onChange={handleChange}
            min={0}
          />
        </label>

        {/* TRAVELER & ROUTE */}
        <h3 style={{ marginTop: "16px" }}>Traveler &amp; Route</h3>

        <label style={labelStyle}>
          Traveler type
          <select
            style={inputStyle}
            name="traveler_type"
            value={form.traveler_type}
            onChange={handleChange}
          >
            <option value="SOLO">SOLO</option>
            <option value="COUPLE">COUPLE</option>
            <option value="FAMILY_SMALL">FAMILY_SMALL</option>
            <option value="FAMILY_LARGE">FAMILY_LARGE</option>
            <option value="GROUP">GROUP</option>
          </select>
        </label>

        <label style={labelStyle}>
          Route (OD)
          <select
            style={inputStyle}
            name="od"
            value={form.od}
            onChange={handleChange}
          >
            <option value="KUL-SIN">KUL-SIN</option>
            <option value="KUL-NRT">KUL-NRT</option>
            <option value="PEN-KUL">PEN-KUL</option>
            <option value="KUL-LHR">KUL-LHR</option>
          </select>
        </label>

        <label style={labelStyle}>
          Trip type
          <select
            style={inputStyle}
            name="trip_type"
            value={form.trip_type}
            onChange={handleChange}
          >
            <option value="DOMESTIC">DOMESTIC</option>
            <option value="REGIONAL_INTL">REGIONAL_INTL</option>
            <option value="LONG_HAUL">LONG_HAUL</option>
          </select>
        </label>

        <label style={labelStyle}>
          Flight number
          <input
            style={inputStyle}
            type="text"
            name="flight_no"
            value={form.flight_no}
            onChange={handleChange}
          />
        </label>

        <label style={labelStyle}>
          Cabin
          <select
            style={inputStyle}
            name="cabin"
            value={form.cabin}
            onChange={handleChange}
          >
            <option value="Y">Y</option>
            <option value="J">J</option>
          </select>
        </label>

        <label style={labelStyle}>
          Fare family
          <select
            style={inputStyle}
            name="fare_family"
            value={form.fare_family}
            onChange={handleChange}
          >
            <option value="VALUE">VALUE</option>
            <option value="FLEX">FLEX</option>
            <option value="BUSINESS_SAVER">BUSINESS_SAVER</option>
            <option value="BUSINESS_FLEX">BUSINESS_FLEX</option>
          </select>
        </label>

        {/* POS / CHANNEL / DEVICE */}
        <h3 style={{ marginTop: "16px" }}>POS &amp; Channel</h3>

        <label style={labelStyle}>
          POS country
          <input
            style={inputStyle}
            type="text"
            name="pos_country"
            value={form.pos_country}
            onChange={handleChange}
          />
        </label>

        <label style={labelStyle}>
          Sales channel
          <select
            style={inputStyle}
            name="sales_channel"
            value={form.sales_channel}
            onChange={handleChange}
          >
            <option value="DIRECT">DIRECT</option>
            <option value="OTA">OTA</option>
            <option value="CORPORATE">CORPORATE</option>
            <option value="AGENT">AGENT</option>
          </select>
        </label>

        <label style={labelStyle}>
          Device
          <select
            style={inputStyle}
            name="device"
            value={form.device}
            onChange={handleChange}
          >
            <option value="WEB">WEB</option>
            <option value="APP">APP</option>
          </select>
        </label>

        <label style={labelStyle}>
          Loyalty tier
          <select
            style={inputStyle}
            name="loyalty_tier"
            value={form.loyalty_tier}
            onChange={handleChange}
          >
            <option value="NONE">NONE</option>
            <option value="SILVER">SILVER</option>
            <option value="GOLD">GOLD</option>
            <option value="PLATINUM">PLATINUM</option>
          </select>
        </label>

        <label style={labelStyle}>
          Corporate flag
          <select
            style={inputStyle}
            name="corporate_flag"
            value={form.corporate_flag}
            onChange={handleChange}
          >
            <option value={0}>No</option>
            <option value={1}>Yes</option>
          </select>
        </label>

        {/* TIME / SEASON */}
        <h3 style={{ marginTop: "16px" }}>Departure Timing</h3>

        <label style={labelStyle}>
          Departure month (1–12)
          <input
            style={inputStyle}
            type="number"
            name="dep_month"
            value={form.dep_month}
            onChange={handleChange}
            min={1}
            max={12}
          />
        </label>

        <label style={labelStyle}>
          Departure day of week (0=Mon … 6=Sun)
          <input
            style={inputStyle}
            type="number"
            name="dep_dow"
            value={form.dep_dow}
            onChange={handleChange}
            min={0}
            max={6}
          />
        </label>

        <label style={labelStyle}>
          Season
          <select
            style={inputStyle}
            name="dep_season"
            value={form.dep_season}
            onChange={handleChange}
          >
            <option value="SPRING">SPRING</option>
            <option value="SUMMER">SUMMER</option>
            <option value="AUTUMN">AUTUMN</option>
            <option value="WINTER">WINTER</option>
          </select>
        </label>

        <button
          type="submit"
          style={{ marginTop: "16px", padding: "8px 16px" }}
          disabled={loading}
        >
          {loading ? "Scoring..." : "Predict Extra Bag Propensity"}
        </button>
      </form>

      <div style={{ marginTop: "20px" }}>
        {errorMsg && (
          <div style={{ color: "red", marginBottom: "8px" }}>{errorMsg}</div>
        )}

        {result && !errorMsg && (
          <div
            style={{
              border: "1px solid #ddd",
              padding: "12px",
              borderRadius: "6px",
              maxWidth: "360px",
            }}
          >
            <h3>Result</h3>
            <p>
              Probability of buying extra baggage:{" "}
              <strong>{result.probability_bag.toFixed(3)}</strong>
            </p>
            <p>
              Targeting band: <strong>{result.band}</strong>
            </p>
            <p style={{ fontSize: "0.85rem", color: "#666" }}>
              Use HIGH / MEDIUM customers for focused bag upsell prompts,
              emails, or bundled offers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [ticketAmount, setTicketAmount] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [fare, setFare] = useState(null);
  const [errors, setErrors] = useState({});

  const stations = [
    "Stasiun Lebak Bulus",
    "Stasiun Fatmawati Indomaret",
    "Stasiun Cipete Raya",
    "Stasiun Haji Nawi",
    "Stasiun Blok A",
    "Stasiun Blok M BCA",
    "Stasiun ASEAN",
    "Stasiun Senayan Mastercard",
    "Stasiun Istora Mandiri",
    "Stasiun Bendungan Hilir",
    "Stasiun Setiabudi Astra",
    "Stasiun Dukuh Atas BNI",
    "Stasiun Bundaran HI Bank DKI",
  ];

  const fares = {};
  stations.forEach((start, i) => {
    fares[start] = {};
    stations.forEach((end, j) => {
      if (i !== j) {
        fares[start][end] = 3000 + Math.abs(i - j) * 1000;
      }
    });
  });

  const randomFare = Math.floor(Math.random() * 1000);

  const handleSelectStations = () => {
    const newErrors = {};
    
    if (!phoneNumber || phoneNumber.length < 10) {
      newErrors.phoneNumber = "Silakan masukkan nomor WhatsApp yang valid";
    }
    
    if (!departure) {
      newErrors.departure = "Silakan pilih stasiun keberangkatan";
    }
    
    if (!destination) {
      newErrors.destination = "Silakan pilih stasiun tujuan";
    }
    
    if (departure && destination && departure === destination) {
      newErrors.sameStation = "Stasiun keberangkatan dan tujuan tidak boleh sama";
    }
    
    if (!ticketAmount || ticketAmount < 1) {
      newErrors.ticketAmount = "Jumlah tiket minimal 1";
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setFare(fares[departure][destination]);
      setIsPopupOpen(true);
    }
  };

  const handleConfirmPayment = () => {
    setIsPopupOpen(false);
    setIsPaymentOpen(true);
  };

  const handleBack = () => {
    setIsPaymentOpen(false);
  };

  const handlePaymentSuccess = () => {
    setIsPaymentOpen(false);
    setIsSuccessOpen(true);
  };

  useEffect(() => {
    if (isSuccessOpen) {
      const timeout = setTimeout(() => {
        setIsSuccessOpen(false);
      }, 10000);

      return () => clearTimeout(timeout);
    }
  }, [isSuccessOpen]);

  const handleDoneClick = () => {
    setIsSuccessOpen(false);
  };

  const totalPayment = fare !== "Tidak tersedia" ? fare * ticketAmount + randomFare : "Tidak tersedia";

  return (
    <div className="home-container">
      {!isPaymentOpen && !isSuccessOpen ? (
        <>
          <h1 className="welcome-text">Selamat Datang di MRT</h1>
          <h2 className="header-text">Pilih stasiun Anda dan dapatkan tiket dengan mudah dalam beberapa langkah!</h2>

          <div className="booking-section">
            <label>Masukkan Nomor WhatsApp:</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Masukkan nomor WhatsApp"
              className="input-field whatsapp-input"
            />
            {errors.phoneNumber && <p className="error-message">{errors.phoneNumber}</p>}
            
            <label>Stasiun Keberangkatan:</label>
            <select value={departure} onChange={(e) => setDeparture(e.target.value)} className="input-field">
              <option value="">Pilih Stasiun</option>
              {stations.map((station, index) => (
                <option key={index} value={station}>{station}</option>
              ))}
            </select>
            {errors.departure && <p className="error-message">{errors.departure}</p>}

            <label>Stasiun Tujuan:</label>
            <select value={destination} onChange={(e) => setDestination(e.target.value)} className="input-field">
              <option value="">Pilih Stasiun</option>
              {stations.map((station, index) => (
                <option key={index} value={station}>{station}</option>
              ))}
            </select>
            {errors.destination && <p className="error-message">{errors.destination}</p>}
            {errors.sameStation && <p className="error-message">{errors.sameStation}</p>}

            <label>Jumlah Tiket:</label>
            <input
              type="number"
              value={ticketAmount}
              onChange={(e) => setTicketAmount(parseInt(e.target.value) || 0)}
              min="1"
              className="input-field"
            />
            {errors.ticketAmount && <p className="error-message">{errors.ticketAmount}</p>}

            <button className="button choose-station-button" onClick={handleSelectStations}>Pilih Stasiun</button>
          </div>

          {isPopupOpen && (
            <div className="popup">
              <div className="popup-content">
                <h3>Konfirmasi Stasiun</h3>
                <p>Nomor WhatsApp: {phoneNumber || "Belum dimasukkan"}</p>
                <p>Keberangkatan: {departure || "Belum dipilih"}</p>
                <p>Tujuan: {destination || "Belum dipilih"}</p>
                <p>Tarif: {fare !== "Tidak tersedia" ? `Rp ${fare}` : "Tidak tersedia"}</p>
                <p>Jumlah Tiket: {ticketAmount || "0" }</p>
                <button onClick={() => setIsPopupOpen(false)}>Tutup</button>
                <button className="button confirm-button" onClick={handleConfirmPayment}>Konfirmasi</button>
              </div>
            </div>
          )}
        </>
      ) : isPaymentOpen ? (
        <div className="payment-section">
          <h2>Konfirmasi Pembayaran</h2>
          <p><strong>Nomor WhatsApp:</strong> {phoneNumber}</p>
          <p><strong>Keberangkatan:</strong> {departure}</p>
          <p><strong>Tujuan:</strong> {destination}</p>
          <p><strong>Jumlah Tiket:</strong> {ticketAmount} </p>
          <p><strong>Tarif Perjalanan:</strong> Rp {fare}</p>
          <p><strong>Kode Unik:</strong> Rp {randomFare}</p>
          <p><strong>Total Pembayaran:</strong> Rp {totalPayment}</p>
          <div className="qris-container">
            <img src="qris.jpeg" alt="QRIS Pembayaran" className="qris-image" />
          </div>
          <button className="button telah-membayar-button" onClick={handlePaymentSuccess}>Telah Membayar</button>
          <button className="button back-button" onClick={handleBack}>Kembali</button>
        </div>
      ) : (
        <div className="popup">
          <div className="popup-content">
            <span className="success-icon">✔</span>
            <h2 className="success-message">Pembayaran Berhasil!</h2>
            <p className="success-text">Barcode telah dikirim ke WhatsApp Anda.</p>
            <p className="success-text">Selamat menikmati perjalanan!</p>
            <button className="done-button" onClick={handleDoneClick}>Selesai</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

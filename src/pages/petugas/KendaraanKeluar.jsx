import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Search, Printer } from 'lucide-react';
import api from '../../api/axios';

const KendaraanKeluar = () => {
  const [platNomor, setPlatNomor] = useState('');
  const [kendaraanData, setKendaraanData] = useState(null);
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    setKendaraanData(null);
    setReceiptData(null);

    try {
      const { data } = await api.get(`/transaksi?status=masuk&plat_nomor=${platNomor}`);
      const transactions = data.data?.data || data.data || [];
      if (transactions.length === 0) {
        throw new Error('Kendaraan tidak ditemukan atau sudah keluar.');
      }
      const trx = transactions[0];
      setKendaraanData({
         plat_nomor: trx.kendaraan?.plat_nomor,
         jenis_kendaraan: trx.kendaraan?.jenis_kendaraan || trx.tarif?.jenis_kendaraan,
         waktu_masuk: trx.waktu_masuk,
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || error.message || 'Kendaraan tidak ditemukan atau sudah keluar.' });
    } finally {
      setLoading(false);
    }
  };

  const handleKeluar = async () => {
    if (!window.confirm('Proses kendaraan keluar sekarang?')) return;
    setLoading(true);

    try {
      const { data } = await api.post('/parkir/keluar', { 
        plat_nomor: kendaraanData.plat_nomor
      });
      setReceiptData(data.data || data);
      setMessage({ type: 'success', text: 'Kendaraan berhasil diproses keluar.' });
      setKendaraanData(null);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Gagal memproses kendaraan keluar.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Proses Kendaraan Keluar</h2>

      <Card className="print:hidden">
        <form onSubmit={handleSearch} className="flex space-x-2">
          <div className="flex-1">
            <label className="sr-only">Cari Plat Nomor</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg uppercase focus:ring-blue-500 focus:border-blue-500"
                placeholder="CARI PLAT NOMOR..."
                value={platNomor}
                onChange={(e) => setPlatNomor(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Mencari...' : 'Cari'}
          </button>
        </form>

        {message.text && (
          <div className={`mt-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}
      </Card>

      {/* Kendaraan Detail */}
      {kendaraanData && (
        <Card className="print:hidden">
          <h3 className="text-lg font-bold mb-4 border-b pb-2">Detail Kendaraan</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Plat Nomor</span>
              <span className="font-bold uppercase text-lg">{kendaraanData.plat_nomor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Jenis Kendaraan</span>
              <span className="font-semibold capitalize">{kendaraanData.jenis_kendaraan || kendaraanData.tarif?.jenis_kendaraan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Waktu Masuk</span>
              <span className="font-semibold">{new Date(kendaraanData.waktu_masuk).toLocaleString('id-ID')}</span>
            </div>
            <div className="pt-4 border-t">
              <button
                onClick={handleKeluar}
                disabled={loading}
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg"
              >
                PROSES KELUAR & HITUNG BIAYA
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Struk / Receipt */}
      {receiptData && (
        <Card className="border-t-4 border-t-green-500 shadow-xl bg-white mx-auto print:shadow-none print:border-none print:m-0 print:p-0">
          <div className="text-center mb-6 border-b pb-4">
            <h2 className="text-2xl font-bold">PARKIR SYSTEM</h2>
            <p className="text-gray-500 text-sm">Struk Pembayaran Parkir</p>
          </div>
          
          <div className="space-y-4 text-sm font-mono mb-6">
            <div className="flex justify-between">
              <span>Plat Nomor:</span>
              <span className="font-bold text-lg uppercase">{receiptData.plat_nomor}</span>
            </div>
            <div className="flex justify-between">
              <span>Waktu Masuk:</span>
              <span>{new Date(receiptData.waktu_masuk).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span>Waktu Keluar:</span>
              <span>{new Date(receiptData.waktu_keluar).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span>Durasi:</span>
              <span>{receiptData.durasi_jam} Jam</span>
            </div>
            <div className="flex justify-between pt-4 border-t border-dashed">
              <span className="font-bold">Total Biaya:</span>
              <span className="font-bold text-xl">Rp {parseInt(receiptData.biaya_total_raw).toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="text-center text-xs text-gray-400 mt-8 mb-4">
            Terima kasih telah menggunakan fasilitas parkir kami.
            <br/>Barang hilang atau rusak di luar tanggung jawab kami.
          </div>

          <button
            onClick={handlePrint}
            className="w-full flex justify-center items-center py-3 bg-gray-100 text-gray-800 font-bold rounded hover:bg-gray-200 print:hidden"
          >
            <Printer className="w-5 h-5 mr-2" />
            Cetak Struk
          </button>
        </Card>
      )}
    </div>
  );
};

export default KendaraanKeluar;

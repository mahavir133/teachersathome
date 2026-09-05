import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { Assignment, FeeCollection } from '../types';
import { IndianRupee, TrendingUp, Edit2, Trash2, X, Check, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export function FeeManager() {
  const { token } = useAuth();
  const [fees, setFees] = useState<FeeCollection[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [stats, setStats] = useState<{ month_year: string, total: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ amount: '', payment_mode: '', month_year: '', txn_id: '' });

  const [newFee, setNewFee] = useState({
    assignment_id: '',
    month_year: new Date().toISOString().slice(0, 7), // YYYY-MM
    amount: '',
    payment_mode: 'Cash',
    txn_id: '',
    status: 'Paid'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${token}` };
      const [feeRes, assRes, statsRes] = await Promise.all([
        fetch('/api/admin/fees', { headers }),
        fetch('/api/admin/assignments', { headers }),
        fetch('/api/admin/fees/stats', { headers })
      ]);

      const feeData = await feeRes.json();
      const assData = await assRes.json();
      const statsData = await statsRes.json();

      setFees(feeData || []);
      setAssignments(assData || []);
      setStats(statsData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRecordFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFee.assignment_id || !newFee.amount || !newFee.month_year) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch('/api/admin/fees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newFee)
      });
      if (res.ok) {
        setNewFee({ ...newFee, amount: '', assignment_id: '', txn_id: '' });
        fetchData();
        alert("Fee recorded successfully");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to record fee");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this fee record?")) return;
    try {
      const res = await fetch(`/api/admin/fees/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSave = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/fees/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });
      if (res.ok) {
        setEditingId(null);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const numberToWords = (num: number): string => {
    const a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
    const b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];

    let numStr = num.toString();
    if (numStr.length > 9) return 'overflow';
    let n = ('000000000' + numStr).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return ''; 
    let str = '';
    str += (n[1] !== '00') ? (a[Number(n[1])] || b[Number(n[1][0])] + ' ' + a[Number(n[1][1])]) + 'Crore ' : '';
    str += (n[2] !== '00') ? (a[Number(n[2])] || b[Number(n[2][0])] + ' ' + a[Number(n[2][1])]) + 'Lakh ' : '';
    str += (n[3] !== '00') ? (a[Number(n[3])] || b[Number(n[3][0])] + ' ' + a[Number(n[3][1])]) + 'Thousand ' : '';
    str += (n[4] !== '0') ? (a[Number(n[4])] || b[Number(n[4][0])] + ' ' + a[Number(n[4][1])]) + 'Hundred ' : '';
    str += (n[5] !== '00') ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[Number(n[5][0])] + ' ' + a[Number(n[5][1])]) + 'Only' : 'Only';
    return str.trim() || 'Zero';
  };

  const generateReceipt = async (fee: FeeCollection) => {
    const doc = new jsPDF();
    
    try {
      const response = await fetch('/logo.png');
      if (response.ok) {
        const blob = await response.blob();
        const reader = new FileReader();
        const base64data = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
        doc.addImage(base64data, 'PNG', 15, 10, 50, 30);
      }
    } catch (err) {
      console.warn("Could not load logo", err);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(60, 26, 21);
    doc.text('PAYMENT RECEIPT', 195, 20, { align: 'right' });
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Rooted in Care, Focused on Future', 195, 26, { align: 'right' });

    doc.setDrawColor(245, 130, 32);
    doc.setLineWidth(0.5);
    doc.line(15, 45, 195, 45);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    
    const drawDottedLine = (x: number, y: number, w: number) => {
      doc.setDrawColor(200, 200, 200);
      doc.setLineDashPattern([1, 1], 0);
      doc.line(x, y, x + w, y);
      doc.setLineDashPattern([], 0);
    };

    doc.text('Receipt No:', 120, 55);
    doc.setFont("helvetica", "normal");
    doc.text(fee.id.toString(), 145, 55);
    drawDottedLine(145, 56, 45);

    doc.setFont("helvetica", "bold");
    doc.text('Date:', 120, 65);
    doc.setFont("helvetica", "normal");
    doc.text(new Date(fee.payment_date).toLocaleDateString(), 145, 65);
    drawDottedLine(145, 66, 45);

    let y = 85;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(60, 26, 21);
    doc.text('RECEIVED FROM', 15, y);
    
    y += 10;
    doc.setFontSize(10);
    const addField = (label: string, value: string, yPos: number, xStart = 70) => {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(20, 40, 80);
      doc.text(label, 15, yPos);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(50, 50, 50);
      doc.text(value, xStart, yPos);
      drawDottedLine(xStart, yPos + 1, 100);
    };

    addField('Parent / Guardian Name:', fee.parentName || 'N/A', y);
    addField('Student Name:', fee.studentName || 'N/A', y += 10);
    addField('Contact Number:', 'N/A', y += 10);
    addField('Email Address:', 'N/A', y += 10);

    y += 20;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(60, 26, 21);
    doc.text('PAYMENT DETAILS', 15, y);

    y += 10;
    doc.setFontSize(10);
    addField('Amount Paid:', `Rs. ${fee.amount}`, y);
    addField('Amount in Words:', numberToWords(Number(fee.amount)), y += 10);
    addField('Payment Mode:', fee.payment_mode, y += 10);
    addField('Reference / Txn ID:', fee.txn_id || 'N/A', y += 10);
    addField('Payment For (Month/Service):', `Tuition Fee - ${fee.month_year}`, y += 10);

    y += 20;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(60, 26, 21);
    doc.text('NOTES', 15, y);

    y += 10;
    drawDottedLine(15, y, 175);
    drawDottedLine(15, y += 10, 175);

    y += 30;
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.line(15, y, 85, y);
    doc.line(125, y, 195, y);
    
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text('Authorized Signature', 15, y);
    doc.text('Stamp / Seal', 125, y);

    y += 25;
    doc.setDrawColor(245, 130, 32);
    doc.line(15, y, 195, y);

    y += 5;
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.text('Teachers At Home | This is a computer-generated receipt.', 105, y, { align: 'center' });
    doc.text('Thank you for trusting us with your child\'s learning journey.', 105, y + 4, { align: 'center' });

    doc.save(`Receipt_${fee.parentName?.replace(/\s+/g, '_')}_${fee.month_year}.pdf`);
  };

  const handleAssignmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const aid = e.target.value;
    const assignment = assignments.find(a => a.id === aid);
    setNewFee({
      ...newFee,
      assignment_id: aid,
      amount: assignment ? assignment.fee_agreed.toString() : ''
    });
  };

  // Find max for scaling the chart
  const maxTotal = stats.reduce((max, s) => Math.max(max, Number(s.total)), 0) || 1;

  return (
    <div className="space-y-6">
      
      {/* Revenue Graph Dashboard */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Monthly Revenue</h3>
            <p className="text-sm text-slate-500">Fee collection trends</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span className="font-black text-emerald-700">
              ₹{stats.reduce((sum, s) => sum + Number(s.total), 0).toLocaleString()} Total
            </span>
          </div>
        </div>

        {stats.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-slate-400 font-medium">
            No fee data available yet.
          </div>
        ) : (
          <div className="flex items-end gap-4 h-48 pt-4 pb-2 border-b border-slate-100">
            {stats.map((s) => {
              const heightPercent = (Number(s.total) / maxTotal) * 100;
              return (
                <div key={s.month_year} className="flex-1 flex flex-col items-center justify-end group">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-slate-700 mb-2">
                    ₹{Number(s.total).toLocaleString()}
                  </div>
                  <div 
                    className="w-full bg-indigo-500 rounded-t-sm hover:bg-indigo-600 transition-colors cursor-pointer"
                    style={{ height: `${heightPercent}%`, minHeight: '4px' }}
                  ></div>
                  <div className="mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {s.month_year}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Record Fee Form */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-emerald-600" /> Log Payment
          </h3>
          <form onSubmit={handleRecordFee} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Assignment</label>
              <select
                required
                value={newFee.assignment_id}
                onChange={handleAssignmentChange}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Choose Mapping...</option>
                {assignments.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.parentName} & {a.tutorName}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Month/Year</label>
                <input
                  type="month"
                  required
                  value={newFee.month_year}
                  onChange={e => setNewFee({ ...newFee, month_year: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  required
                  value={newFee.amount}
                  onChange={e => setNewFee({ ...newFee, amount: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Payment Mode</label>
              <select
                value={newFee.payment_mode}
                onChange={e => setNewFee({ ...newFee, payment_mode: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI / Online</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
            {newFee.payment_mode !== 'Cash' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Transaction ID / Reference</label>
                <input
                  type="text"
                  required
                  value={newFee.txn_id}
                  onChange={e => setNewFee({ ...newFee, txn_id: e.target.value })}
                  placeholder="e.g. UTR123456789"
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>
            )}
            <button type="submit" disabled={loading} className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors">
              Record Fee
            </button>
          </form>
        </div>

        {/* Fees History */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
            Payment History
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Month</th>
                  <th className="p-3">Mapping</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Mode</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fees.map(f => (
                  <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-black text-slate-700">
                      {editingId === f.id ? (
                        <input
                          type="month"
                          value={editForm.month_year}
                          onChange={e => setEditForm({...editForm, month_year: e.target.value})}
                          className="w-32 border rounded p-1 text-sm"
                        />
                      ) : (
                        f.month_year
                      )}
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{f.parentName}</div>
                      <div className="text-xs text-slate-500">Tutor: {f.tutorName}</div>
                    </td>
                    <td className="p-3 font-bold text-emerald-600">
                      {editingId === f.id ? (
                        <input
                          type="number"
                          value={editForm.amount}
                          onChange={e => setEditForm({...editForm, amount: e.target.value})}
                          className="w-24 border rounded p-1 text-sm"
                        />
                      ) : (
                        `₹${f.amount}`
                      )}
                    </td>
                    <td className="p-3 text-slate-500 text-xs">
                      {editingId === f.id ? (
                        <div className="space-y-2">
                          <select
                            value={editForm.payment_mode}
                            onChange={e => setEditForm({...editForm, payment_mode: e.target.value})}
                            className="border rounded p-1 text-sm w-full"
                          >
                            <option value="Cash">Cash</option>
                            <option value="UPI">UPI</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                          </select>
                          {editForm.payment_mode !== 'Cash' && (
                            <input
                              type="text"
                              value={editForm.txn_id}
                              onChange={e => setEditForm({...editForm, txn_id: e.target.value})}
                              placeholder="Txn ID"
                              className="border rounded p-1 text-sm w-full"
                            />
                          )}
                        </div>
                      ) : (
                        <div>
                          <div>{f.payment_mode}</div>
                          {f.txn_id && <div className="text-[10px] text-slate-400 font-mono mt-0.5">{f.txn_id}</div>}
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-slate-500 text-xs">{new Date(f.payment_date).toLocaleDateString()}</td>
                    
                    <td className="p-3 text-right">
                      {editingId === f.id ? (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEditSave(f.id)} className="text-emerald-600 hover:bg-emerald-50 p-1 rounded">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => setEditingId(null)} className="text-slate-400 hover:bg-slate-100 p-1 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => generateReceipt(f)} 
                            className="text-slate-400 hover:text-blue-600 p-1 transition-colors"
                            title="Download Receipt"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setEditingId(f.id);
                              setEditForm({ amount: f.amount.toString(), payment_mode: f.payment_mode, month_year: f.month_year, txn_id: f.txn_id || '' });
                            }} 
                            className="text-slate-400 hover:text-indigo-600 p-1 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(f.id)} 
                            className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {fees.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">No fee records found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

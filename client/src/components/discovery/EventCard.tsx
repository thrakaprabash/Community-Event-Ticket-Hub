import React, { useState } from 'react';
import { Calendar, MapPin, Ticket, Tag, CheckCircle2, X, Edit, Trash2, AlertTriangle, ShieldCheck, Download, QrCode } from 'lucide-react';
import { EventItem } from '../../types';
import { API_BASE_URL } from '../../config';
import { useAuth } from '../../context/AuthContext';
import { EditEventModal } from '../dashboard/EditEventModal';

interface EventCardProps {
  event: EventItem;
  onBookSuccess?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onBookSuccess }) => {
  const { user, token } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [ticketResult, setTicketResult] = useState<any>(null);

  // Edit and Delete state for organizers owning this event
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const isOwner = user?.role === 'organizer' && user.orgId === event.organizationId;

  const handleDelete = async (cancelOnly: boolean = false) => {
    setDeleteLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/events/${event._id}${cancelOnly ? '?cancel=true' : ''}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const data = await res.json();
      if (data.success) {
        setDeleteConfirmOpen(false);
        if (onBookSuccess) onBookSuccess();
      } else {
        alert(data.message || 'Failed to delete event');
      }
    } catch {
      alert('Error deleting event');
    } finally {
      setDeleteLoading(false);
    }
  };

  const availableTickets = Math.max(0, event.capacity - event.ticketsSold);
  const isSoldOut = availableTickets <= 0;

  const handleClosePass = () => {
    setModalOpen(false);
    setTicketResult(null);
    setAttendeeName('');
    setAttendeeEmail('');
    setQuantity(1);
    if (onBookSuccess) onBookSuccess();
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendeeName || !attendeeEmail) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event._id,
          attendeeName,
          attendeeEmail,
          quantity
        })
      });

      const data = await res.json();
      if (data.success) {
        setTicketResult(data.data);
      } else {
        alert(data.message || 'Booking failed');
      }
    } catch (err) {
      alert('Error processing mock registration');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Tech':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Music':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'University':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Sports':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 flex flex-col group">
        <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
          <img
            src={event.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 flex items-center space-x-2">
            <span
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg border backdrop-blur-md bg-white/90 ${getCategoryColor(
                event.category
              )}`}
            >
              {event.category}
            </span>
            {isOwner && (
              <span className="px-2 py-1 text-xs font-bold rounded-lg border backdrop-blur-md bg-indigo-600/90 text-white flex items-center space-x-1 shadow-sm">
                <ShieldCheck className="w-3 h-3" />
                <span>Your Event</span>
              </span>
            )}
          </div>
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 text-xs font-bold rounded-lg shadow-sm bg-slate-900/80 text-white backdrop-blur-md">
              {event.price === 0 ? 'FREE' : `$${event.price}`}
            </span>
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-medium text-slate-500 mb-2">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              <span>
                {new Date(event.date).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}{' '}
                • {event.time}
              </span>
            </div>

            <h3 className="font-bold text-slate-900 text-lg line-clamp-1 group-hover:text-indigo-600 transition-colors">
              {event.title}
            </h3>

            <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
              {event.description}
            </p>

            <div className="flex items-center space-x-1 text-xs text-slate-500 mt-3">
              <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
              <span className="truncate">{event.venue}, {event.city}</span>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-3">
              <span className="font-medium text-slate-700 truncate max-w-[170px]">
                By {event.organizationName}
              </span>
              <span className={isSoldOut ? 'text-rose-600 font-semibold' : 'text-emerald-600 font-medium'}>
                {isSoldOut ? 'Sold out' : `${availableTickets} spots left`}
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <button
              onClick={() => setModalOpen(true)}
              disabled={isSoldOut}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all shadow-sm ${
                isSoldOut
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-indigo-200'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>{isSoldOut ? 'Sold Out' : (event.price === 0 ? 'Register for Free' : `Get Tickets ($${event.price})`)}</span>
            </button>

            {isOwner && (
              <div className="pt-2 border-t border-slate-100 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(true)}
                  className="flex-1 py-1.5 px-3 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 flex items-center justify-center space-x-1.5 transition-colors border border-indigo-100"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmOpen(true)}
                  className="flex-1 py-1.5 px-3 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 flex items-center justify-center space-x-1.5 transition-colors border border-rose-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ticket Purchase / Registration Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100">
            <button
              onClick={handleClosePass}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {!ticketResult ? (
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Reserve Tickets
                </h3>
                <p className="text-xs text-slate-500 mb-4">{event.title}</p>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 mb-4 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date & Time:</span>
                    <span className="font-semibold text-slate-800">{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Unit Price:</span>
                    <span className="font-semibold text-slate-800">{event.price === 0 ? 'Free' : `$${event.price}`}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-1 font-bold text-indigo-700">
                    <span>Total Amount:</span>
                    <span>{event.price === 0 ? 'Free' : `$${event.price * quantity}`}</span>
                  </div>
                </div>

                <form onSubmit={handleBooking} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={attendeeName}
                      onChange={(e) => setAttendeeName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={attendeeEmail}
                      onChange={(e) => setAttendeeEmail(e.target.value)}
                      placeholder="kasun@example.com"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tickets Quantity
                    </label>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                    >
                      {[1, 2, 3, 4, 5].map((q) => (
                        <option key={q} value={q}>
                          {q} {q === 1 ? 'ticket' : 'tickets'}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <span>Issuing Ticket Pass...</span>
                      ) : (
                        <span>{event.price === 0 ? 'Confirm Registration' : `Complete Order ($${event.price * quantity})`}</span>
                      )}
                    </button>
                    <p className="text-[11px] text-center text-slate-400 mt-2">
                      ⚡ Instant electronic pass with admission QR code generated
                    </p>
                  </div>
                </form>
              </div>
            ) : (
              <div className="text-center py-2">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  Registration Confirmed!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Your ticket pass has been issued for <strong>{event.title}</strong>
                </p>

                <div className="my-3 p-4 bg-white rounded-2xl border-2 border-indigo-100 shadow-inner inline-block">
                  <img
                    src={ticketResult.ticket.qrCode}
                    alt="Admission QR Code"
                    className="w-44 h-44 mx-auto rounded-xl shadow-sm border border-slate-100"
                  />
                  <p className="text-[10px] font-mono text-slate-500 mt-2 uppercase tracking-wider">
                    Scan for Venue Gate Check-In
                  </p>
                </div>

                <div className="text-xs text-slate-600 space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-left">
                  <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                    <span className="text-slate-500">Pass Reference:</span>
                    <span className="font-mono font-bold text-indigo-700">
                      {ticketResult.ticket._id?.substring(18)?.toUpperCase() || 'PASS-OK'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Attendee:</span>
                    <span className="font-semibold text-slate-800">{ticketResult.ticket.attendeeName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Quantity:</span>
                    <span className="font-bold text-indigo-600">{ticketResult.ticket.quantity} Ticket(s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status:</span>
                    <span className="font-bold text-emerald-600">Confirmed (Instant Pass)</span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <a
                    href={ticketResult.ticket.qrCode}
                    download={`${event.title.replace(/[^a-zA-Z0-9]/g, '_')}_QR_Pass.png`}
                    className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download QR Pass</span>
                  </a>
                  <button
                    onClick={handleClosePass}
                    className="py-2 px-4 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-200 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Organizer Edit Modal */}
      {isOwner && (
        <EditEventModal
          isOpen={editModalOpen}
          event={event}
          onClose={() => setEditModalOpen(false)}
          onSuccess={() => {
            if (onBookSuccess) onBookSuccess();
          }}
        />
      )}

      {/* Organizer Delete Confirmation Modal */}
      {isOwner && deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setDeleteConfirmOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Delete Event</h3>
                <p className="text-[11px] text-slate-500">Remove listing from discovery</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Are you sure you want to delete <strong>{event.title}</strong>? This action cannot be reversed.
            </p>

            <div className="space-y-2">
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => handleDelete(false)}
                className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting...' : 'Delete Permanently'}
              </button>

              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => handleDelete(true)}
                className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold text-xs rounded-xl border border-amber-200 transition-colors disabled:opacity-50"
              >
                Mark as Cancelled
              </button>

              <button
                type="button"
                onClick={() => setDeleteConfirmOpen(false)}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

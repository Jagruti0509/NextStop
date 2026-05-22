import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Map, Wallet, Globe, Calendar, ArrowRight, Sparkles, Navigation, MapPin, Compass, CheckCircle2 } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useTripStore from '../../store/tripStore';
import AppLayout from '../../components/layout/AppLayout';
import { StatCardSkeleton, CardSkeleton } from '../../components/ui/Skeleton';
import { formatDate, formatCurrency, getTotalBudget, STATUS_CONFIG, getDestinationImage } from '../../utils';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { trips, fetchTrips, isLoading } = useTripStore();
  const navigate = useNavigate();

  useEffect(() => { fetchTrips(); }, []);

  const totalBudget = trips.reduce((sum, t) => sum + getTotalBudget(t.budget), 0);
  const countries = [...new Set(trips.flatMap(t => (t.stops || []).map(s => s.country)))].length;
  const upcoming = trips.filter(t => t.status === 'planned' && new Date(t.start_date) > new Date()).length;
  const recent = trips.slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <AppLayout noPadding={true}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950"
      >
        {/* Asymmetrical Immersive Welcome Header */}
        <div className="relative w-full overflow-hidden bg-slate-900 dark:bg-[#030712] border-b border-gray-100 dark:border-slate-800/60 min-h-[380px] flex items-center pt-8 lg:pt-0">
          {/* Advanced Background Mesh */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none bg-grid-overlay opacity-30" />
          <div className="absolute top-[-30%] right-[-10%] w-[50%] h-[70%] bg-primary-600/20 rounded-full blur-[140px] animate-pulse-glow" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[60%] bg-accent-500/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '4s' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-transparent to-transparent" />

          <div className="max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-16 py-12 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Header Left: Welcome & Brand */}
            <div className="text-left max-w-2xl">
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 mb-6 shadow-md"
              >
                <Compass className="w-4 h-4 text-accent-400 animate-spin-slow" style={{ animationDuration: '10s' }} />
                <span className="text-white/80 text-xs font-black tracking-widest uppercase">NextStop Co-pilot</span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-black text-white font-display leading-[1.1] mb-5 tracking-tight">
                Hey {user?.name?.split(' ')?.[0] || 'Traveler'},<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-accent-300 to-coral-450">
                  Where to next?
                </span>
              </h1>
              
              <p className="text-lg text-slate-300 font-medium mb-8 leading-relaxed max-w-xl">
                Plan your perfect route instantly. Harness authentic regional data and AI pathfinding to draft your custom journey.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button 
                  onClick={() => navigate('/planner')} 
                  className="group relative px-6 py-4 rounded-2xl bg-gradient-to-r from-primary-600 to-accent-500 text-white font-black text-base hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(99,102,241,0.25)] flex items-center gap-2.5 overflow-hidden"
                >
                  <Sparkles className="w-5 h-5 text-white animate-pulse" />
                  <span>AI Co-Pilot Planner</span>
                </button>
                <button 
                  onClick={() => navigate('/trips/create')} 
                  className="px-6 py-4 rounded-2xl text-base font-bold text-white bg-slate-805 border border-slate-700 hover:bg-slate-900 transition-all hover:scale-[1.02] flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Manual Draft</span>
                </button>
              </div>
            </div>

            {/* Header Right: Graphic / Quick Preview Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-full lg:w-[380px] shrink-0"
            >
              <div className="card-glass p-6 border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-2xl bg-white/5">
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent-500/10 rounded-full blur-xl pointer-events-none" />
                <h3 className="text-white font-black font-display text-lg mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
                  <Globe className="w-5 h-5 text-accent-400" />
                  Global Insight
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm font-semibold">Active Journeys</span>
                    <span className="text-white font-black">{trips.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm font-semibold">Upcoming Stops</span>
                    <span className="text-white font-black">{upcoming}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm font-semibold">Total Budget Planned</span>
                    <span className="text-accent-400 font-black">{formatCurrency(totalBudget)}</span>
                  </div>
                </div>

                <div className="mt-5 p-3.5 bg-white/5 rounded-xl border border-white/5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent-500/20 flex items-center justify-center">
                    <Compass className="w-4.5 h-4.5 text-accent-400 animate-pulse" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] text-white/50 font-black uppercase tracking-wider">Explore Hint</div>
                    <div className="text-xs text-white/90 font-bold truncate">Try searching "Kyoto" for cherry blossom trails.</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Asymmetrical Content Grid */}
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-16 py-12 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Main Content Column (2/3 width) */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Flagship AI Spotlight Block */}
              <motion.div 
                variants={itemVariants} 
                className="group cursor-pointer relative"
                onClick={() => navigate('/planner')}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-accent-500 to-coral-500 rounded-[2rem] blur-xl opacity-35 group-hover:opacity-60 transition duration-700 animate-pulse-slow" />
                <div className="relative rounded-[2rem] p-1 bg-gradient-to-br from-white/90 to-white/40 dark:from-slate-800/80 dark:to-slate-900/40 shadow-2xl">
                  <div className="bg-white/95 dark:bg-[#0b1021]/95 backdrop-blur-2xl rounded-[1.9rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/60 dark:border-slate-800/80 shadow-inner">
                    <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/25 shrink-0 group-hover:scale-110 transition-transform duration-500">
                        <Sparkles className="w-9 h-9 text-white animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-black font-display text-slate-900 dark:text-white mb-2 tracking-tight">AI Trip Planner</h3>
                        <p className="text-slate-600 dark:text-slate-350 text-base font-semibold leading-relaxed">
                          Provide your destination and mood. Our pathfinding engine maps optimized day-by-day routing with live place verification.
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 w-14 h-14 rounded-full bg-slate-955 dark:bg-slate-800 text-white flex items-center justify-center group-hover:translate-x-3 transition-transform shadow-xl">
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Journeys List */}
              <motion.div variants={itemVariants} className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight">Your Journeys</h2>
                  <button onClick={() => navigate('/trips')} className="text-xs font-black text-primary-600 dark:text-primary-400 hover:text-primary-700 bg-primary-50 dark:bg-primary-950/20 px-5 py-2.5 rounded-full flex items-center gap-1.5 transition-colors border border-primary-100/50 dark:border-primary-900/30">
                    View All Trips <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {Array(2).fill(0).map((_, i) => <CardSkeleton key={i} />)}
                  </div>
                ) : trips.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {recent.map((trip) => (
                      <motion.div
                        key={trip.id}
                        whileHover={{ y: -8 }}
                        className="group relative h-[440px] rounded-[2.2rem] overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-slate-800"
                        onClick={() => navigate(`/trips/${trip.id}`)}
                      >
                        <img
                          src={trip.cover_image ? `http://localhost:5000${trip.cover_image}` : getDestinationImage(trip.stops?.[0]?.city)}
                          alt={trip.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300" />

                        {/* Top Badges */}
                        <div className="absolute top-6 right-6">
                          <span className={`px-4 py-1.5 text-[10px] font-black tracking-wider uppercase rounded-full shadow-lg backdrop-blur-md border border-white/20 ${
                              trip.status === 'completed' ? 'bg-emerald-500/90 text-white' :
                              trip.status === 'active' ? 'bg-accent-500/90 text-white' :
                              'bg-white/20 text-white'
                            }`}
                          >
                            {STATUS_CONFIG[trip.status]?.label}
                          </span>
                        </div>

                        {/* Card Details (hover animated) */}
                        <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-3 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                          <div className="flex items-center gap-3 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                            <span className="bg-white/10 backdrop-blur-xl border border-white/10 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl flex items-center gap-1.5">
                              <Map className="w-3.5 h-3.5 text-accent-400" /> {(trip.stops || []).length} stops
                            </span>
                            {getTotalBudget(trip.budget) > 0 && (
                              <span className="bg-white/10 backdrop-blur-xl border border-white/10 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl flex items-center gap-1.5">
                                <Wallet className="w-3.5 h-3.5 text-coral-400" /> {formatCurrency(getTotalBudget(trip.budget))}
                              </span>
                            )}
                          </div>
                          <h3 className="font-black font-display text-white text-2xl mb-3 line-clamp-2 leading-tight tracking-tight">
                            {trip.title}
                          </h3>
                          <p className="text-white/70 font-semibold text-xs flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-accent-400" />
                            {trip.start_date ? formatDate(trip.start_date) : 'No dates set'}
                            {trip.end_date && ` → ${formatDate(trip.end_date)}`}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="card p-12 text-center bg-white dark:bg-[#0b1021] border border-gray-150 dark:border-slate-800">
                    <Compass className="w-12 h-12 text-gray-300 dark:text-slate-600 mx-auto mb-4 animate-bounce" />
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No active journeys</h3>
                    <p className="text-gray-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">Start drafting your first itinerary with our manual form or the smart AI builder.</p>
                    <button onClick={() => navigate('/planner')} className="btn-primary">
                      <Sparkles className="w-4.5 h-4.5" /> Start planning now
                    </button>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar Column (1/3 width) */}
            <div className="space-y-8">
              
              {/* Modular Stats Center */}
              <motion.div variants={itemVariants} className="space-y-4">
                <h2 className="text-2xl font-black font-display text-slate-900 dark:text-white tracking-tight">Stats & Vibe</h2>
                
                {isLoading ? (
                  <div className="space-y-4">
                    {Array(4).fill(0).map((_, i) => <StatCardSkeleton key={i} />)}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                    
                    {/* Stat Card 1: Trips */}
                    <div className="bg-white dark:bg-[#0b1021] rounded-3xl p-5 border border-gray-100 dark:border-slate-800 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300 shadow-sm">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-650 flex items-center justify-center shrink-0 shadow-md">
                        <Map className="w-5.5 h-5.5 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 dark:text-slate-500 font-extrabold tracking-wider uppercase mb-0.5">Total Trips</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">{trips.length}</p>
                      </div>
                    </div>

                    {/* Stat Card 2: Upcoming */}
                    <div className="bg-white dark:bg-[#0b1021] rounded-3xl p-5 border border-gray-100 dark:border-slate-800 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300 shadow-sm">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-500 to-teal-600 flex items-center justify-center shrink-0 shadow-md">
                        <Calendar className="w-5.5 h-5.5 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 dark:text-slate-500 font-extrabold tracking-wider uppercase mb-0.5">Upcoming</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">{upcoming}</p>
                      </div>
                    </div>

                    {/* Stat Card 3: Countries */}
                    <div className="bg-white dark:bg-[#0b1021] rounded-3xl p-5 border border-gray-100 dark:border-slate-800 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300 shadow-sm">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-coral-400 to-pink-600 flex items-center justify-center shrink-0 shadow-md">
                        <Globe className="w-5.5 h-5.5 text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 dark:text-slate-500 font-extrabold tracking-wider uppercase mb-0.5">Countries Visited</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">{countries}</p>
                      </div>
                    </div>

                    {/* Stat Card 4: Budget */}
                    <div className="bg-white dark:bg-[#0b1021] rounded-3xl p-5 border border-gray-100 dark:border-slate-800 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300 shadow-sm">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shrink-0 shadow-md">
                        <Wallet className="w-5.5 h-5.5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 dark:text-slate-500 font-extrabold tracking-wider uppercase mb-0.5">Budget Drafted</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white truncate">{formatCurrency(totalBudget)}</p>
                      </div>
                    </div>

                  </div>
                )}
              </motion.div>

              {/* Quick Start Card / Feature Spotlight */}
              <motion.div 
                variants={itemVariants}
                className="bg-gradient-to-br from-slate-900 to-slate-950 dark:from-[#0b1021] dark:to-[#030712] rounded-[2rem] p-6 border border-slate-800 text-white relative overflow-hidden shadow-xl"
              >
                <div className="absolute -right-8 -top-8 w-24 h-24 bg-accent-500/10 rounded-full blur-xl pointer-events-none" />
                <h3 className="text-xl font-black font-display mb-2 flex items-center gap-2">
                  <Compass className="w-5.5 h-5.5 text-accent-400 animate-bounce" />
                  Trip Checklist
                </h3>
                <p className="text-xs text-slate-400 font-semibold mb-6">Make sure your roadmap is solid prior to departures:</p>
                <ul className="space-y-3.5 text-xs text-slate-350 font-bold">
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-lg bg-emerald-500/25 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-[10px]">✔</div>
                    <span>Persist stop details</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-lg bg-emerald-500/25 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-[10px]">✔</div>
                    <span>Plan daily schedule slots</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400"></div>
                    <span>Add Packing Checklists</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400"></div>
                    <span>Explore offbeat gems</span>
                  </li>
                </ul>
              </motion.div>

            </div>

          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}

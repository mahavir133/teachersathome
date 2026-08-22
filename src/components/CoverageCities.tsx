import React, { useState } from 'react';
import { MapPin, Users, CheckCircle2, Search, Building2, ArrowRight } from 'lucide-react';
import { COVERAGE_AREAS } from '../data/content';

interface CoverageCitiesProps {
  onSelectCityFilter: (city: string) => void;
  onRequestTutor: () => void;
}

export const CoverageCities: React.FC<CoverageCitiesProps> = ({ onSelectCityFilter, onRequestTutor }) => {
  const [citySearch, setCitySearch] = useState('');

  const filteredAreas = COVERAGE_AREAS.filter((area) => {
    if (!citySearch.trim()) return true;
    const q = citySearch.toLowerCase();
    return (
      area.city.toLowerCase().includes(q) ||
      area.state.toLowerCase().includes(q) ||
      area.popularLocalities.some((l) => l.toLowerCase().includes(q))
    );
  });

  return (
    <section id="cities" className="py-16 bg-white border-b border-[#E6E8E1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-black text-[#2C3317] bg-[#E9EDDE] border border-[#D1D5CB] px-3 py-1 rounded-full uppercase tracking-wider">
            Presence & Coverage Network
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C3317] tracking-tight mt-3">
            Serving Top Cities Across Jharkhand, Bihar & Pan-India
          </h2>
          <p className="text-sm text-[#5C6348] mt-2">
            Our network of over 10,000 verified home tutors covers major residential sectors, colonies, and academic hubs.
          </p>
        </div>

        {/* City/Locality Search Bar */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-[#5C6348]" />
            <input
              type="text"
              placeholder="Type your city or locality (e.g. Lalpur, Boring Road, Bistupur, Harmu)..."
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-[#F2F4EF] border border-[#D1D5CB] rounded-xl text-sm font-semibold text-[#2C3317] focus:ring-2 focus:ring-[#708238] focus:outline-none"
            />
          </div>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAreas.map((area, idx) => (
            <div
              key={idx}
              className="bg-[#F2F4EF] rounded-2xl border border-[#E6E8E1] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              {/* Top Banner Image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={area.image}
                  alt={area.city}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C3317]/80 via-[#2C3317]/30 to-transparent" />
                
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-black">{area.city}</h3>
                      <p className="text-xs text-[#E9EDDE]">{area.state}</p>
                    </div>
                    <span className="bg-[#708238] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full">
                      {area.tutorsCount}+ Tutors
                    </span>
                  </div>
                </div>
              </div>

              {/* Localities List */}
              <div className="p-5 flex-1 space-y-3">
                <p className="text-xs font-bold text-[#708238]">
                  {area.tagline}
                </p>

                <div>
                  <span className="text-[10px] font-extrabold uppercase text-[#5C6348] block mb-1.5">
                    Popular Localities Served
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {area.popularLocalities.map((loc, lIdx) => (
                      <span
                        key={lIdx}
                        className="bg-white border border-[#E6E8E1] text-[#2C3317] text-[11px] font-medium px-2 py-0.5 rounded-md"
                      >
                        {loc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-4 bg-white border-t border-[#E6E8E1] flex items-center justify-between">
                <button
                  onClick={() => onSelectCityFilter(area.city)}
                  className="text-xs font-extrabold text-[#708238] hover:text-[#5A692D] flex items-center gap-1 cursor-pointer"
                >
                  <span>View Tutors in {area.city}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onRequestTutor}
                  className="text-xs font-bold text-[#3D441E] hover:text-[#708238] cursor-pointer"
                >
                  Book Demo
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
